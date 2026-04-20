<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreEmployeeRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'department_id'   => 'nullable|exists:departments,id',
            'employee_number' => 'required|string|max:50|unique:employees,employee_number',
            'first_name'      => 'required|string|max:100',
            'last_name'       => 'required|string|max:100',
            'email'           => 'required|email|unique:employees,email',
            'phone'           => 'nullable|string|max:30',
            'position'        => 'required|string|max:100',
            'employment_type' => 'required|in:full-time,part-time,contract',
            'basic_salary'    => 'required|numeric|min:0',
            'hired_at'        => 'required|date',
            'status'          => 'required|in:active,inactive,terminated',
        ];
    }
}
