<?php

namespace App\Http\Controllers\Portal;

use App\Http\Controllers\Controller;
use App\Models\Payroll;
use Inertia\Inertia;

class PayslipController extends Controller
{
    public function index()
    {
        $employee = auth()->user()->employee;
        abort_unless($employee, 403);

        $payslips = Payroll::where('employee_id', $employee->id)
            ->latest('period_start')
            ->get()
            ->map(fn($p) => [
                'id'           => $p->id,
                'period_start' => \Carbon\Carbon::parse($p->period_start)->format('M d, Y'),
                'period_end'   => \Carbon\Carbon::parse($p->period_end)->format('M d, Y'),
                'basic_salary' => (float) $p->basic_salary,
                'allowances'   => (float) $p->allowances,
                'deductions'   => (float) $p->deductions,
                'net_pay'      => (float) $p->net_pay,
                'status'       => $p->status,
                'processed_at' => $p->processed_at ? \Carbon\Carbon::parse($p->processed_at)->format('M d, Y') : null,
                'ph_deductions'=> is_string($p->ph_deductions) ? json_decode($p->ph_deductions, true) : ($p->ph_deductions ?? []),
            ]);

        return Inertia::render('Portal/Payslips', [
            'payslips' => $payslips,
            'employee' => [
                'full_name'       => $employee->full_name,
                'employee_number' => $employee->employee_number,
                'position'        => $employee->position,
            ],
        ]);
    }
}
