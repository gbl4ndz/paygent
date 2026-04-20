<?php

namespace App\Http\Controllers\Manager;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use App\Models\LeaveRequest;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $employee = auth()->user()->employee;
        abort_unless($employee, 403);

        $subordinates = $employee->subordinates()->with('shiftSchedule')->get();
        $subordinateIds = $subordinates->pluck('id');

        $recentAttendance = Attendance::with('employee')
            ->whereIn('employee_id', $subordinateIds)
            ->where('approval_status', 'submitted')
            ->latest('updated_at')
            ->take(5)
            ->get()
            ->map(fn($a) => [
                'id'       => $a->id,
                'employee' => $a->employee->full_name ?? '—',
                'date'     => $a->date instanceof \Carbon\Carbon ? $a->date->format('M d, Y') : $a->date,
            ]);

        $recentLeave = LeaveRequest::with(['employee', 'leaveType'])
            ->whereIn('employee_id', $subordinateIds)
            ->where('status', 'pending')
            ->latest('updated_at')
            ->take(5)
            ->get()
            ->map(fn($l) => [
                'id'       => $l->id,
                'employee' => $l->employee->full_name ?? '—',
                'type'     => $l->leaveType->name ?? '—',
                'dates'    => ($l->start_date instanceof \Carbon\Carbon ? $l->start_date->format('M d') : $l->start_date)
                            . ' – '
                            . ($l->end_date instanceof \Carbon\Carbon ? $l->end_date->format('M d, Y') : $l->end_date),
            ]);

        return Inertia::render('Manager/Dashboard', [
            'pendingAttendance' => Attendance::whereIn('employee_id', $subordinateIds)
                ->where('approval_status', 'submitted')->count(),
            'pendingLeave'      => LeaveRequest::whereIn('employee_id', $subordinateIds)
                ->where('status', 'pending')->count(),
            'teamCount'         => $subordinates->count(),
            'team'              => $subordinates->map(fn($s) => [
                'id'    => $s->id,
                'name'  => $s->full_name,
                'position' => $s->position ?? '—',
                'shift' => $s->shiftSchedule?->name ?? 'No shift',
            ]),
            'recentAttendance'  => $recentAttendance,
            'recentLeave'       => $recentLeave,
        ]);
    }
}
