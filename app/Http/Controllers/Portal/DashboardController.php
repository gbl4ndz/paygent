<?php

namespace App\Http\Controllers\Portal;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use App\Models\LeaveBalance;
use App\Models\LeaveRequest;
use App\Models\Payroll;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $employee = auth()->user()->employee;
        abort_unless($employee, 403, 'No employee profile linked.');

        $todayAttendance = Attendance::with('timeLogs')
            ->where('employee_id', $employee->id)
            ->where('date', today())->first();

        $leaveBalances = LeaveBalance::with('leaveType')
            ->where('employee_id', $employee->id)
            ->where('year', now()->year)->get();

        $recentPayrolls = Payroll::where('employee_id', $employee->id)
            ->latest()->take(3)->get();

        $pendingLeave = LeaveRequest::where('employee_id', $employee->id)
            ->where('status', 'pending')->count();

        return Inertia::render('Portal/Dashboard', compact(
            'employee', 'todayAttendance', 'leaveBalances', 'recentPayrolls', 'pendingLeave'
        ));
    }
}
