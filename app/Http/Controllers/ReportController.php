<?php

namespace App\Http\Controllers;

use App\Models\Attendance;
use App\Models\Department;
use App\Models\Employee;
use App\Models\Payroll;
use Inertia\Inertia;

class ReportController extends Controller
{
    public function index()
    {
        return Inertia::render('Reports/Index', [
            'summary' => [
                'total_employees'    => Employee::count(),
                'active_employees'   => Employee::where('status', 'active')->count(),
                'total_departments'  => Department::count(),
                'total_payroll'      => Payroll::where('status', 'paid')->sum('net_pay'),
                'pending_payroll'    => Payroll::whereIn('status', ['draft', 'processed'])->count(),
                'present_today'      => Attendance::where('date', today())->where('status', 'present')->count(),
                'absent_today'       => Attendance::where('date', today())->where('status', 'absent')->count(),
            ],
            'payroll_by_month' => Payroll::selectRaw("strftime('%Y-%m', period_start) as month, sum(net_pay) as total")
                ->where('status', 'paid')
                ->groupBy('month')
                ->orderBy('month', 'desc')
                ->limit(12)
                ->get(),
            'employees_by_department' => Department::withCount('employees')->get(['id', 'name']),
        ]);
    }
}
