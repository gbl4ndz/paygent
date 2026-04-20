<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LeaveRequest extends Model
{
    use \App\Traits\BelongsToCompany;

    protected $fillable = [
        'company_id', 'employee_id', 'leave_type_id', 'start_date', 'end_date',
        'total_days', 'reason', 'status',
        'reviewed_by', 'reviewed_at', 'review_notes',
        'manager_reviewed_by', 'manager_reviewed_at', 'manager_review_notes',
    ];

    protected $casts = [
        'start_date'          => 'date',
        'end_date'            => 'date',
        'reviewed_at'         => 'datetime',
        'manager_reviewed_at' => 'datetime',
    ];

    // status values: pending | manager_approved | approved | rejected

    public function employee()       { return $this->belongsTo(Employee::class); }
    public function leaveType()      { return $this->belongsTo(LeaveType::class); }
    public function reviewer()       { return $this->belongsTo(User::class, 'reviewed_by'); }
    public function managerReviewer(){ return $this->belongsTo(User::class, 'manager_reviewed_by'); }
}
