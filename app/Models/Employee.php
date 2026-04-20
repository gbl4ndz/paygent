<?php

namespace App\Models;

use App\Traits\BelongsToCompany;
use Illuminate\Database\Eloquent\Model;

class Employee extends Model
{
    use BelongsToCompany;

    protected $fillable = [
        'company_id', 'department_id', 'manager_id', 'shift_schedule_id',
        'employee_number', 'first_name', 'middle_name', 'last_name',
        'gender', 'civil_status', 'birthdate', 'nationality',
        'permanent_address', 'permanent_city', 'permanent_province', 'permanent_zip_code',
        'present_address',  'present_city',  'present_province',  'present_zip_code',
        'email', 'phone', 'alternative_phone', 'personal_email',
        'sss_number', 'philhealth_number', 'pagibig_number', 'tin_number',
        'dependents',
        'bank_name', 'bank_account_number', 'bank_account_name',
        'emergency_contact_name', 'emergency_contact_relationship',
        'emergency_contact_phone', 'emergency_contact_address',
        'position', 'employment_type', 'basic_salary', 'hired_at', 'status',
    ];

    protected $casts = [
        'hired_at'    => 'date',
        'birthdate'   => 'date',
        'basic_salary'=> 'decimal:2',
        'dependents'  => 'array',
    ];

    public function getFullNameAttribute(): string
    {
        return "{$this->first_name} {$this->last_name}";
    }

    public function department()     { return $this->belongsTo(Department::class); }
    public function manager()        { return $this->belongsTo(Employee::class, 'manager_id'); }
    public function subordinates()   { return $this->hasMany(Employee::class, 'manager_id'); }
    public function shiftSchedule()  { return $this->belongsTo(ShiftSchedule::class); }

    /** Returns the User whose role is 'manager' and is linked to this employee's manager */
    public function managerUser(): ?User
    {
        if (! $this->manager_id) return null;
        return User::where('employee_id', $this->manager_id)
            ->where('role', 'manager')
            ->first();
    }

    public function attendance()   { return $this->hasMany(Attendance::class); }
    public function payrolls()     { return $this->hasMany(Payroll::class); }
    public function leaveRequests(){ return $this->hasMany(LeaveRequest::class); }
    public function leaveBalances(){ return $this->hasMany(LeaveBalance::class); }
    public function user()         { return $this->hasOne(User::class); }
}
