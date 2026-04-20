<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LeaveType extends Model
{
    use \App\Traits\BelongsToCompany;

    protected $fillable = [
        'company_id', 'name', 'days_per_year', 'is_paid', 'requires_approval', 'is_active',
        'is_accrual_based', 'accrual_per_month', 'max_balance',
    ];

    protected $casts = [
        'is_paid'          => 'boolean',
        'requires_approval'=> 'boolean',
        'is_active'        => 'boolean',
        'is_accrual_based' => 'boolean',
        'accrual_per_month'=> 'decimal:2',
        'max_balance'      => 'decimal:2',
    ];

    public function leaveRequests() { return $this->hasMany(LeaveRequest::class); }
    public function leaveBalances() { return $this->hasMany(LeaveBalance::class); }
}
