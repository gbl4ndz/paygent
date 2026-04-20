<?php

namespace App\Models;

use App\Traits\BelongsToCompany;
use Illuminate\Database\Eloquent\Model;

class PayrollSetting extends Model
{
    use BelongsToCompany;

    protected $fillable = [
        'company_id', 'first_cutoff_day', 'second_cutoff_day', 'review_days_after_cutoff',
    ];

    /**
     * Given a date, return the attendance review deadline (cutoff + review_days_after_cutoff).
     * Returns null if the date is outside any active review window.
     */
    public function currentReviewDeadline(\Carbon\Carbon $forDate = null): ?\Carbon\Carbon
    {
        $date    = $forDate ?? now();
        $year    = $date->year;
        $month   = $date->month;
        $days    = $this->review_days_after_cutoff;

        $cutoff1 = \Carbon\Carbon::create($year, $month, $this->first_cutoff_day)->endOfDay();
        $cutoff2 = \Carbon\Carbon::create($year, $month, 1)
            ->endOfMonth()
            ->startOfDay()
            ->addDays($this->second_cutoff_day === 31 ? 0 : ($this->second_cutoff_day - 1))
            ->endOfDay();

        if ($date <= $cutoff1->copy()->addDays($days)) return $cutoff1->copy()->addDays($days);
        if ($date <= $cutoff2->copy()->addDays($days)) return $cutoff2->copy()->addDays($days);
        return null;
    }
}
