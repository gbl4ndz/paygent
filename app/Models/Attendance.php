<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Attendance extends Model
{
    protected $table = 'attendance';

    protected $fillable = [
        'employee_id', 'date', 'clock_in', 'clock_out', 'status', 'notes',
        'approval_status', 'submitted_at',
        'approved_by', 'approved_at', 'rejection_notes',
        'manager_approved_by', 'manager_approved_at', 'manager_rejection_notes',
    ];

    protected $casts = [
        'date'                => 'date',
        'submitted_at'        => 'datetime',
        'approved_at'         => 'datetime',
        'manager_approved_at' => 'datetime',
    ];

    // approval_status values: draft | submitted | manager_approved | approved | rejected

    public function employee()       { return $this->belongsTo(Employee::class); }
    public function approver()       { return $this->belongsTo(\App\Models\User::class, 'approved_by'); }
    public function managerApprover(){ return $this->belongsTo(\App\Models\User::class, 'manager_approved_by'); }
    public function timeLogs()       { return $this->hasMany(TimeLog::class); }
}
