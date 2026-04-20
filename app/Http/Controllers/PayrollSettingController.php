<?php

namespace App\Http\Controllers;

use App\Models\PayrollSetting;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PayrollSettingController extends Controller
{
    public function edit()
    {
        $settings = PayrollSetting::firstOrCreate(
            ['company_id' => auth()->user()->company_id],
            ['first_cutoff_day' => 15, 'second_cutoff_day' => 31, 'review_days_after_cutoff' => 5]
        );

        return Inertia::render('PayrollSettings/Edit', ['settings' => $settings]);
    }

    public function update(Request $request)
    {
        $data = $request->validate([
            'first_cutoff_day'         => 'required|integer|between:1,28',
            'second_cutoff_day'        => 'required|integer|between:1,31',
            'review_days_after_cutoff' => 'required|integer|between:1,30',
        ]);

        PayrollSetting::updateOrCreate(
            ['company_id' => auth()->user()->company_id],
            $data
        );

        return redirect()->route('payroll-settings.edit')->with('success', 'Payroll settings saved.');
    }
}
