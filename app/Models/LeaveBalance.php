<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LeaveBalance extends Model
{
    use \App\Traits\BelongsToCompany;

    protected $fillable = ['company_id', 'employee_id', 'leave_type_id', 'year', 'allocated_days', 'used_days'];

    public function getRemainingDaysAttribute(): float
    {
        return $this->allocated_days - $this->used_days;
    }

    public function employee() { return $this->belongsTo(Employee::class); }
    public function leaveType() { return $this->belongsTo(LeaveType::class); }
}
