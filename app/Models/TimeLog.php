<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TimeLog extends Model
{
    protected $fillable = ['attendance_id', 'clock_in', 'clock_out', 'notes'];

    public function attendance() { return $this->belongsTo(Attendance::class); }

    /** Duration in decimal hours */
    public function getHoursAttribute(): ?float
    {
        if (! $this->clock_out) return null;
        [$ih, $im] = explode(':', $this->clock_in);
        [$oh, $om] = explode(':', $this->clock_out);
        $diff = (($oh * 60 + $om) - ($ih * 60 + $im));
        return round($diff / 60, 2);
    }
}
