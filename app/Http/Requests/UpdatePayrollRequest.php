<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdatePayrollRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'employee_id'  => 'required|exists:employees,id',
            'period_start' => 'required|date',
            'period_end'   => 'required|date|after_or_equal:period_start',
            'basic_salary' => 'required|numeric|min:0',
            'allowances'   => 'required|numeric|min:0',
            'deductions'   => 'required|numeric|min:0',
            'status'       => 'required|in:draft,processed,paid',
            'notes'        => 'nullable|string',
        ];
    }
}
