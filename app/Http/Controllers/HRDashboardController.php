<?php

namespace App\Http\Controllers;

use App\Models\Attendance;
use App\Models\Employee;
use App\Models\LeaveRequest;
use App\Models\Payroll;
use Inertia\Inertia;

class HRDashboardController extends Controller
{
    public function index()
    {
        $companyId = auth()->user()->company_id;

        $employeeIds = Employee::where('company_id', $companyId)->pluck('id');

        $totalEmployees  = $employeeIds->count();
        $activeEmployees = Employee::where('company_id', $companyId)->where('status', 'active')->count();

        $pendingAttendance = Attendance::whereIn('employee_id', $employeeIds)
            ->whereIn('approval_status', ['submitted', 'manager_approved'])
            ->count();

        $pendingLeave = LeaveRequest::whereIn('employee_id', $employeeIds)
            ->whereIn('status', ['pending', 'manager_approved'])
            ->count();

        $recentAttendance = Attendance::with('employee')
            ->whereIn('employee_id', $employeeIds)
            ->whereIn('approval_status', ['submitted', 'manager_approved'])
            ->latest('updated_at')
            ->take(5)
            ->get()
            ->map(fn($a) => [
                'id'              => $a->id,
                'employee'        => $a->employee->full_name ?? '—',
                'date'            => $a->date instanceof \Carbon\Carbon ? $a->date->format('M d, Y') : $a->date,
                'approval_status' => $a->approval_status,
            ]);

        $recentLeave = LeaveRequest::with(['employee', 'leaveType'])
            ->whereIn('employee_id', $employeeIds)
            ->whereIn('status', ['pending', 'manager_approved'])
            ->latest('updated_at')
            ->take(5)
            ->get()
            ->map(fn($l) => [
                'id'         => $l->id,
                'employee'   => $l->employee->full_name ?? '—',
                'type'       => $l->leaveType->name ?? '—',
                'start_date' => $l->start_date instanceof \Carbon\Carbon ? $l->start_date->format('M d') : $l->start_date,
                'end_date'   => $l->end_date instanceof \Carbon\Carbon ? $l->end_date->format('M d, Y') : $l->end_date,
                'status'     => $l->status,
            ]);

        return Inertia::render('Dashboard', [
            'stats' => [
                'totalEmployees'   => $totalEmployees,
                'activeEmployees'  => $activeEmployees,
                'pendingAttendance'=> $pendingAttendance,
                'pendingLeave'     => $pendingLeave,
            ],
            'recentAttendance' => $recentAttendance,
            'recentLeave'      => $recentLeave,
        ]);
    }
}
