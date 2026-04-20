<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Payroll extends Model
{
    protected $fillable = [
        'employee_id', 'period_start', 'period_end',
        'basic_salary', 'allowances', 'deductions', 'net_pay',
        'status', 'processed_at', 'notes',
    ];

    protected $casts = [
        'period_start' => 'date',
        'period_end' => 'date',
        'processed_at' => 'datetime',
        'basic_salary'   => 'decimal:2',
        'allowances'     => 'decimal:2',
        'deductions'     => 'decimal:2',
        'net_pay'        => 'decimal:2',
        'ph_deductions'  => 'array',
    ];

    public function employee()
    {
        return $this->belongsTo(Employee::class);
    }
}
