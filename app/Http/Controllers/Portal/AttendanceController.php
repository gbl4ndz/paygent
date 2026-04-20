<?php

namespace App\Http\Controllers\Portal;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use App\Models\PayrollSetting;
use App\Models\TimeLog;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AttendanceController extends Controller
{
    public function index(Request $request)
    {
        $employee = auth()->user()->employee;
        abort_unless($employee, 403);

        $settings = PayrollSetting::firstOrCreate(
            ['company_id' => auth()->user()->company_id],
            ['first_cutoff_day' => 15, 'second_cutoff_day' => 31, 'review_days_after_cutoff' => 5]
        );

        [$defaultFrom, $defaultTo, $reviewDeadline] = $this->currentPeriod($settings);

        $from = $request->get('from', $defaultFrom->toDateString());
        $to   = $request->get('to',   $defaultTo->toDateString());

        $withinReview = now()->lte(
            Carbon::parse($to)->addDays($settings->review_days_after_cutoff)->endOfDay()
        );

        $shift = $employee->shiftSchedule;

        $records = Attendance::with('timeLogs')
            ->where('employee_id', $employee->id)
            ->whereBetween('date', [$from, $to])
            ->orderBy('date', 'desc')
            ->get()
            ->map(fn($r) => $this->enrichRecord($r, $shift));

        return Inertia::render('Portal/Attendance', [
            'records'        => $records,
            'from'           => $from,
            'to'             => $to,
            'withinReview'   => $withinReview,
            'reviewDeadline' => Carbon::parse($to)->addDays($settings->review_days_after_cutoff)->toDateString(),
            'today'          => now()->toDateString(),
            'periods'        => $this->availablePeriods($settings),
            'hasManager'     => $employee->manager_id !== null,
        ]);
    }

    public function clockIn(Request $request)
    {
        $employee = auth()->user()->employee;
        abort_unless($employee, 403);

        $today  = now()->toDateString();
        $record = Attendance::where('employee_id', $employee->id)
            ->whereDate('date', $today)->first();
        if (!$record) {
            $record = Attendance::create([
                'employee_id'     => $employee->id,
                'date'            => $today,
                'status'          => 'present',
                'approval_status' => 'draft',
            ]);
        }

        $hasOpen = $record->timeLogs()
            ->where(fn($q) => $q->whereNull('clock_out')->orWhere('clock_out', ''))
            ->exists();
        if ($hasOpen) {
            return back()->withErrors(['clock' => 'You are already clocked in.']);
        }

        TimeLog::create([
            'attendance_id' => $record->id,
            'clock_in'      => now()->format('H:i'),
            'clock_out'     => null,
        ]);

        return back()->with('success', 'Clocked in at ' . now()->format('g:i A') . '.');
    }

    public function clockOut(Request $request)
    {
        $employee = auth()->user()->employee;
        abort_unless($employee, 403);

        $attendance = Attendance::where('employee_id', $employee->id)
            ->whereDate('date', now()->toDateString())->first();

        $openLog = $attendance?->timeLogs()
            ->where(fn($q) => $q->whereNull('clock_out')->orWhere('clock_out', ''))
            ->latest('clock_in')->first();

        // Normalize any empty-string clock_out to null
        if ($openLog && $openLog->clock_out === '') {
            $openLog->clock_out = null;
        }

        if (!$openLog) {
            return back()->withErrors(['clock' => 'You are not currently clocked in.']);
        }

        $openLog->update(['clock_out' => now()->format('H:i')]);

        return back()->with('success', 'Clocked out at ' . now()->format('g:i A') . '.');
    }

    public function save(Request $request)
    {
        $employee = auth()->user()->employee;
        abort_unless($employee, 403);

        $request->validate([
            'date'                  => 'required|date',
            'time_logs'             => 'required|array',
            'time_logs.*.clock_in'  => 'required|date_format:H:i',
            'time_logs.*.clock_out' => 'nullable|date_format:H:i|after:time_logs.*.clock_in',
            'time_logs.*.notes'     => 'nullable|string|max:200',
            'notes'                 => 'nullable|string|max:500',
        ]);

        $record = Attendance::where('employee_id', $employee->id)->whereDate('date', $request->date)->first();
        if ($record && in_array($record->approval_status, ['submitted', 'approved'])) {
            return back()->withErrors(['date' => 'Cannot edit a submitted or approved record.']);
        }

        $newStatus = ($record?->approval_status === 'rejected') ? 'draft' : ($record?->approval_status ?? 'draft');

        if ($record) {
            $record->update([
                'status'                  => 'present',
                'notes'                   => $request->notes,
                'approval_status'         => $newStatus,
                'rejection_notes'         => null,
                'manager_rejection_notes' => null,
            ]);
        } else {
            $record = Attendance::create([
                'employee_id'     => $employee->id,
                'date'            => $request->date,
                'status'          => 'present',
                'notes'           => $request->notes,
                'approval_status' => $newStatus,
            ]);
        }

        $record->timeLogs()->delete();
        foreach ($request->time_logs as $log) {
            if (!empty($log['clock_in'])) {
                TimeLog::create([
                    'attendance_id' => $record->id,
                    'clock_in'      => $log['clock_in'],
                    'clock_out'     => !empty($log['clock_out']) ? $log['clock_out'] : null,
                    'notes'         => $log['notes'] ?? null,
                ]);
            }
        }

        return back()->with('success', 'Time log saved.');
    }

    public function submit(Request $request)
    {
        $employee = auth()->user()->employee;
        abort_unless($employee, 403);

        $request->validate(['dates' => 'required|array|min:1', 'dates.*' => 'date']);

        $submitted = 0;
        foreach ($request->dates as $date) {
            $record = Attendance::where('employee_id', $employee->id)->whereDate('date', $date)->first();
            if (!$record || !in_array($record->approval_status, ['draft', 'rejected'])) continue;
            if ($record->timeLogs()->count() === 0) continue;

            $record->update([
                'approval_status'         => 'submitted',
                'submitted_at'            => now(),
                'rejection_notes'         => null,
                'manager_rejection_notes' => null,
            ]);
            $submitted++;
        }

        return back()->with('success', "{$submitted} day(s) submitted for approval.");
    }

    private function enrichRecord(Attendance $r, $shift): array
    {
        $logs    = $r->timeLogs->sortBy('clock_in');
        $firstIn = $logs->first()?->clock_in;
        $lastOut = $logs->last()?->clock_out;

        // Hours worked = first punch in → last punch out only
        $totalMin = ($firstIn && $lastOut) ? max(0, $this->timeDiffMinutes($firstIn, $lastOut)) : 0;

        $isWorkDay = true;
        $lateMin   = 0;
        $underMin  = 0;
        $shiftMin  = 0;
        $shiftLabel = '—';

        if ($shift) {
            $dow       = (int) $r->date->format('N'); // 1=Mon…7=Sun
            $isWorkDay = in_array($dow, $shift->work_days);
            $shiftLabel = $shift->name . ' · '
                . date('g:i A', strtotime($shift->clock_in_time))
                . ' – '
                . date('g:i A', strtotime($shift->clock_out_time));

            $shiftMin = $this->timeDiffMinutes($shift->clock_in_time, $shift->clock_out_time);

            if ($isWorkDay && $firstIn) {
                $lateMin = max(0, $this->timeDiffMinutes($shift->clock_in_time, $firstIn));
            }
            if ($isWorkDay && $lastOut) {
                $underMin = max(0, $this->timeDiffMinutes($lastOut, $shift->clock_out_time));
            }
        }

        $otMin = max(0, $totalMin - $shiftMin);

        return [
            'id'                      => $r->id,
            'raw_date'                => $r->date->format('Y-m-d'),
            'date_label'              => $r->date->format('M d, Y'),
            'day_name'                => $r->date->format('D'),
            'day_status'              => $isWorkDay ? 'Work Day' : 'Rest Day',
            'shift_label'             => $shiftLabel,
            'time_in'                 => $firstIn ? date('g:i A', strtotime($firstIn)) : '—',
            'time_out'                => $lastOut  ? date('g:i A', strtotime($lastOut))  : '—',
            'shift_name'              => $shift?->name ?? '—',
            'hours_worked'            => $totalMin > 0 ? round($totalMin / 60, 2) : 0,
            'late'                    => round($lateMin  / 60, 2),
            'undertime'               => round($underMin / 60, 2),
            'ot_logged'               => round($otMin    / 60, 2),
            'ot_approved'             => 0.00,
            'nd'                      => 0,
            'nd_ot'                   => 0.00,
            'approval_status'         => $r->approval_status ?? 'draft',
            'rejection_notes'         => $r->rejection_notes,
            'manager_rejection_notes' => $r->manager_rejection_notes,
            'time_logs'               => $logs->map(fn($l) => [
                'id'        => $l->id,
                'clock_in'  => $l->clock_in,
                'clock_out' => $l->clock_out ?: null,
                'notes'     => $l->notes ?? '',
            ])->values()->toArray(),
        ];
    }

    private function timeDiffMinutes(string $from, string $to): int
    {
        [$fh, $fm] = array_map('intval', explode(':', $from));
        [$th, $tm] = array_map('intval', explode(':', $to));
        return ($th * 60 + $tm) - ($fh * 60 + $fm);
    }

    private function currentPeriod(PayrollSetting $s): array
    {
        $now    = now();
        $y      = $now->year;
        $m      = $now->month;
        $c1     = $s->first_cutoff_day;
        $c2     = $s->second_cutoff_day === 31 ? $now->copy()->endOfMonth()->day : $s->second_cutoff_day;
        $review = $s->review_days_after_cutoff;

        if ($now->day <= $c1 + $review) {
            $start = Carbon::create($y, $m, 1);
            $end   = Carbon::create($y, $m, $c1);
        } else {
            $start = Carbon::create($y, $m, $c1 + 1);
            $end   = Carbon::create($y, $m, $c2);
        }

        return [$start, $end, $end->copy()->addDays($review)];
    }

    private function availablePeriods(PayrollSetting $s): array
    {
        $periods = [];
        $c1      = $s->first_cutoff_day;
        for ($i = 0; $i < 6; $i++) {
            $d    = now()->subMonths($i);
            $y    = $d->year;
            $mon  = $d->month;
            $last = Carbon::create($y, $mon, 1)->endOfMonth()->day;
            $c2   = $s->second_cutoff_day === 31 ? $last : $s->second_cutoff_day;
            $periods[] = [
                'label' => $d->format('M Y') . " (1–{$c1})",
                'from'  => Carbon::create($y, $mon, 1)->toDateString(),
                'to'    => Carbon::create($y, $mon, $c1)->toDateString(),
            ];
            $periods[] = [
                'label' => $d->format('M Y') . " (" . ($c1 + 1) . "–{$c2})",
                'from'  => Carbon::create($y, $mon, $c1 + 1)->toDateString(),
                'to'    => Carbon::create($y, $mon, $c2)->toDateString(),
            ];
        }
        return $periods;
    }
}
