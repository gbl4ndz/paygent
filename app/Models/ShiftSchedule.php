<?php

namespace App\Models;

use App\Traits\BelongsToCompany;
use Illuminate\Database\Eloquent\Model;

class ShiftSchedule extends Model
{
    use BelongsToCompany;

    protected $fillable = [
        'company_id', 'name', 'clock_in_time', 'clock_out_time', 'work_days', 'is_default',
    ];

    protected $casts = [
        'work_days'  => 'array',
        'is_default' => 'boolean',
    ];

    public function employees() { return $this->hasMany(Employee::class); }

    public function getWorkDayLabelsAttribute(): string
    {
        $labels = [1 => 'Mon', 2 => 'Tue', 3 => 'Wed', 4 => 'Thu', 5 => 'Fri', 6 => 'Sat', 7 => 'Sun'];
        return collect($this->work_days)->map(fn($d) => $labels[$d] ?? $d)->join(', ');
    }
}
