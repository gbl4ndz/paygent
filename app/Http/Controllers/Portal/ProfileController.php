<?php

namespace App\Http\Controllers\Portal;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProfileController extends Controller
{
    public function edit()
    {
        $employee = auth()->user()->employee;
        abort_unless($employee, 403);

        return Inertia::render('Portal/Profile', [
            'employee' => $employee->only([
                'id', 'employee_number', 'first_name', 'middle_name', 'last_name',
                'gender', 'civil_status', 'birthdate', 'nationality',
                'permanent_address', 'permanent_city', 'permanent_province', 'permanent_zip_code',
                'present_address',  'present_city',  'present_province',  'present_zip_code',
                'email', 'phone', 'alternative_phone', 'personal_email',
                'sss_number', 'philhealth_number', 'pagibig_number', 'tin_number',
                'dependents',
                'bank_name', 'bank_account_number', 'bank_account_name',
                'emergency_contact_name', 'emergency_contact_relationship',
                'emergency_contact_phone', 'emergency_contact_address',
                'position', 'employment_type', 'hired_at',
            ]),
        ]);
    }

    public function update(Request $request)
    {
        $employee = auth()->user()->employee;
        abort_unless($employee, 403);

        $request->validate([
            'middle_name'       => 'nullable|string|max:100',
            'gender'            => 'nullable|in:male,female,other',
            'civil_status'      => 'nullable|in:single,married,widowed,separated',
            'birthdate'         => 'nullable|date|before:today',
            'nationality'       => 'nullable|string|max:100',

            'permanent_address'  => 'nullable|string|max:500',
            'permanent_city'     => 'nullable|string|max:100',
            'permanent_province' => 'nullable|string|max:100',
            'permanent_zip_code' => 'nullable|string|max:10',
            'present_address'    => 'nullable|string|max:500',
            'present_city'       => 'nullable|string|max:100',
            'present_province'   => 'nullable|string|max:100',
            'present_zip_code'   => 'nullable|string|max:10',

            'phone'             => 'nullable|string|max:20',
            'alternative_phone' => 'nullable|string|max:20',
            'personal_email'    => 'nullable|email|max:150',

            'sss_number'        => 'nullable|string|max:20',
            'philhealth_number' => 'nullable|string|max:20',
            'pagibig_number'    => 'nullable|string|max:20',
            'tin_number'        => 'nullable|string|max:20',

            'dependents'                     => 'nullable|array',
            'dependents.*.name'              => 'required|string|max:150',
            'dependents.*.relationship'      => 'required|string|max:100',
            'dependents.*.birthdate'         => 'nullable|date',

            'bank_name'           => 'nullable|string|max:100',
            'bank_account_number' => 'nullable|string|max:50',
            'bank_account_name'   => 'nullable|string|max:150',

            'emergency_contact_name'         => 'nullable|string|max:150',
            'emergency_contact_relationship' => 'nullable|string|max:100',
            'emergency_contact_phone'        => 'nullable|string|max:20',
            'emergency_contact_address'      => 'nullable|string|max:500',
        ]);

        $employee->update($request->only([
            'middle_name', 'gender', 'civil_status', 'birthdate', 'nationality',
            'permanent_address', 'permanent_city', 'permanent_province', 'permanent_zip_code',
            'present_address',  'present_city',  'present_province',  'present_zip_code',
            'phone', 'alternative_phone', 'personal_email',
            'sss_number', 'philhealth_number', 'pagibig_number', 'tin_number',
            'dependents',
            'bank_name', 'bank_account_number', 'bank_account_name',
            'emergency_contact_name', 'emergency_contact_relationship',
            'emergency_contact_phone', 'emergency_contact_address',
        ]));

        return back()->with('success', 'Profile updated successfully.');
    }
}
