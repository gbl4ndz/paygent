<?php

namespace App\Http\Controllers\Manager;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use App\Models\Employee;
use App\Models\TimeLog;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AttendanceController extends Controller
{
    public function index()
    {
        $employee = auth()->user()->employee;
        abort_unless($employee, 403);

        $subordinateIds = $employee->subordinates()->pluck('id');

        return Inertia::render('Manager/Attendance', [
            'pending' => Attendance::with(['employee', 'timeLogs'])
                ->whereIn('employee_id', $subordinateIds)
                ->where('approval_status', 'submitted')
                ->latest('submitted_at')
                ->get(),
            'recent' => Attendance::with(['employee', 'timeLogs'])
                ->whereIn('employee_id', $subordinateIds)
                ->whereIn('approval_status', ['manager_approved', 'approved', 'rejected'])
                ->latest('updated_at')
                ->limit(30)
                ->get(),
        ]);
    }

    public function approve(Attendance $attendance)
    {
        $this->authorizeSubordinate($attendance);
        abort_unless($attendance->approval_status === 'submitted', 422);

        $employee      = $attendance->employee;
        $managerExists = $employee->managerUser() !== null;

        $attendance->update([
            'approval_status'    => $managerExists ? 'manager_approved' : 'approved',
            'manager_approved_by'=> auth()->id(),
            'manager_approved_at'=> now(),
            'manager_rejection_notes' => null,
        ]);

        return back()->with('success', 'Attendance approved.');
    }

    public function reject(Request $request, Attendance $attendance)
    {
        $this->authorizeSubordinate($attendance);
        abort_unless($attendance->approval_status === 'submitted', 422);

        $attendance->update([
            'approval_status'         => 'rejected',
            'manager_approved_by'     => auth()->id(),
            'manager_approved_at'     => now(),
            'manager_rejection_notes' => $request->notes,
        ]);

        return back()->with('success', 'Attendance rejected.');
    }

    public function employeeSummary(Employee $employee)
    {
        $mgr = auth()->user()->employee;
        abort_unless($mgr, 403);
        abort_unless($employee->manager_id === $mgr->id, 403, 'Not your subordinate.');

        $records = Attendance::with('timeLogs')
            ->where('employee_id', $employee->id)
            ->orderByDesc('date')
            ->paginate(50);

        $records->getCollection()->transform(function ($r) {
            return array_merge($r->toArray(), [
                'date'         => $r->date?->format('Y-m-d'),
                'submitted_at' => $r->submitted_at?->toISOString(),
            ]);
        });

        return Inertia::render('Manager/AttendanceEmployee', [
            'employee' => $employee->only(['id', 'first_name', 'last_name', 'employee_number', 'position']),
            'records'  => $records,
        ]);
    }

    public function updateLogs(Request $request, Attendance $attendance)
    {
        $this->authorizeSubordinate($attendance);

        $request->validate([
            'status'            => 'required|in:present,absent,late,half-day,on-leave',
            'notes'             => 'nullable|string|max:500',
            'logs'              => 'array',
            'logs.*.clock_in'   => 'required|date_format:H:i',
            'logs.*.clock_out'  => 'nullable|date_format:H:i',
        ]);

        $attendance->timeLogs()->delete();
        foreach ($request->logs ?? [] as $log) {
            TimeLog::create([
                'attendance_id' => $attendance->id,
                'clock_in'      => $log['clock_in'],
                'clock_out'     => $log['clock_out'] ?: null,
            ]);
        }

        $attendance->update([
            'status' => $request->status,
            'notes'  => $request->notes,
        ]);

        return back()->with('success', 'Attendance updated.');
    }

    private function authorizeSubordinate(Attendance $attendance): void
    {
        $employee = auth()->user()->employee;
        abort_unless($employee, 403);
        abort_unless(
            $attendance->employee->manager_id === $employee->id,
            403, 'Not your subordinate.'
        );
    }
}
