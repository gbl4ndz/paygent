<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePayrollRequest;
use App\Http\Requests\UpdatePayrollRequest;
use App\Models\Employee;
use App\Models\Payroll;
use App\Services\PhilippinePayrollService;
use Inertia\Inertia;

class PayrollController extends Controller
{
    public function index()
    {
        return Inertia::render('Payroll/Index', [
            'payrolls' => Payroll::with('employee')->latest()->paginate(20),
        ]);
    }

    public function create()
    {
        return Inertia::render('Payroll/Create', [
            'employees' => Employee::where('status', 'active')->get(['id', 'first_name', 'last_name', 'employee_number', 'basic_salary']),
        ]);
    }

    public function computeDeductions(float $salary): array
    {
        return (new PhilippinePayrollService())->compute($salary);
    }

    public function store(StorePayrollRequest $request)
    {
        $data = $request->validated();
        $phDeductions = (new PhilippinePayrollService())->compute($data['basic_salary']);
        $data['deductions'] = $data['deductions'] + $phDeductions['total'];
        $data['net_pay'] = $data['basic_salary'] + $data['allowances'] - $data['deductions'];
        $data['ph_deductions'] = $phDeductions;
        Payroll::create($data);
        return redirect()->route('payroll.index')->with('success', 'Payroll entry created.');
    }

    public function edit(Payroll $payroll)
    {
        return Inertia::render('Payroll/Edit', [
            'payroll' => $payroll,
            'employees' => Employee::where('status', 'active')->get(['id', 'first_name', 'last_name', 'employee_number', 'basic_salary']),
        ]);
    }

    public function update(UpdatePayrollRequest $request, Payroll $payroll)
    {
        $data = $request->validated();
        $data['net_pay'] = $data['basic_salary'] + $data['allowances'] - $data['deductions'];
        if ($data['status'] === 'processed' && !$payroll->processed_at) {
            $data['processed_at'] = now();
        }
        $payroll->update($data);
        return redirect()->route('payroll.index')->with('success', 'Payroll updated.');
    }

    public function destroy(Payroll $payroll)
    {
        $payroll->delete();
        return redirect()->route('payroll.index')->with('success', 'Payroll entry deleted.');
    }
}
