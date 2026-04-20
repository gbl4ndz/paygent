<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreAttendanceRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'employee_id' => 'required|exists:employees,id',
            'date'        => 'required|date',
            'clock_in'    => 'nullable|date_format:H:i',
            'clock_out'   => 'nullable|date_format:H:i|after:clock_in',
            'status'      => 'required|in:present,absent,late,half-day,on-leave',
            'notes'       => 'nullable|string',
        ];
    }
}
