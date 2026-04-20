<?php

namespace Database\Seeders;

use App\Models\Company;
use App\Models\LeaveType;
use App\Models\PayrollSetting;
use Illuminate\Database\Seeder;

class DefaultLeaveTypesSeeder extends Seeder
{
    /**
     * Seeds default leave types and payroll settings for every existing company.
     * Also called when a new company registers.
     */
    public static function seedForCompany(int $companyId): void
    {
        $defaults = [
            [
                'name'              => 'Vacation Leave',
                'days_per_year'     => 6,
                'is_paid'           => true,
                'requires_approval' => true,
                'is_accrual_based'  => true,
                'accrual_per_month' => 0.5,
                'max_balance'       => 6,
                'is_active'         => true,
            ],
            [
                'name'              => 'Sick Leave',
                'days_per_year'     => 6,
                'is_paid'           => true,
                'requires_approval' => true,
                'is_accrual_based'  => true,
                'accrual_per_month' => 0.5,
                'max_balance'       => 6,
                'is_active'         => true,
            ],
            [
                'name'              => 'Emergency Leave',
                'days_per_year'     => 0,
                'is_paid'           => false,
                'requires_approval' => true,
                'is_accrual_based'  => false,
                'accrual_per_month' => 0,
                'max_balance'       => 0,
                'is_active'         => true,
            ],
            [
                'name'              => 'Paternity Leave',
                'days_per_year'     => 7,
                'is_paid'           => true,
                'requires_approval' => true,
                'is_accrual_based'  => false,
                'accrual_per_month' => 0,
                'max_balance'       => 0,
                'is_active'         => true,
            ],
            [
                'name'              => 'Maternity Leave',
                'days_per_year'     => 105,
                'is_paid'           => true,
                'requires_approval' => true,
                'is_accrual_based'  => false,
                'accrual_per_month' => 0,
                'max_balance'       => 0,
                'is_active'         => true,
            ],
            [
                'name'              => 'Bereavement Leave',
                'days_per_year'     => 3,
                'is_paid'           => true,
                'requires_approval' => true,
                'is_accrual_based'  => false,
                'accrual_per_month' => 0,
                'max_balance'       => 0,
                'is_active'         => true,
            ],
        ];

        foreach ($defaults as $type) {
            LeaveType::firstOrCreate(
                ['company_id' => $companyId, 'name' => $type['name']],
                $type
            );
        }

        PayrollSetting::firstOrCreate(
            ['company_id' => $companyId],
            ['first_cutoff_day' => 15, 'second_cutoff_day' => 31, 'review_days_after_cutoff' => 5]
        );
    }

    public function run(): void
    {
        Company::all()->each(fn($c) => static::seedForCompany($c->id));
    }
}
