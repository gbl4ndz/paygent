<?php

namespace App\Services;

class PhilippinePayrollService
{
    public function compute(float $basicSalary): array
    {
        $sss       = $this->computeSSS($basicSalary);
        $philhealth = $this->computePhilHealth($basicSalary);
        $pagibig   = $this->computePagIbig($basicSalary);
        $taxable   = $basicSalary - $sss - $philhealth - $pagibig;
        $tax       = $this->computeWithholdingTax($taxable);

        return [
            'sss'        => round($sss, 2),
            'philhealth' => round($philhealth, 2),
            'pagibig'    => round($pagibig, 2),
            'tax'        => round($tax, 2),
            'total'      => round($sss + $philhealth + $pagibig + $tax, 2),
        ];
    }

    // SSS 2024: 4.5% of Monthly Salary Credit (MSC), capped ₱4k-₱30k
    public function computeSSS(float $salary): float
    {
        $msc = match(true) {
            $salary < 4250   => 4000,
            $salary < 4750   => 4500,
            $salary < 5250   => 5000,
            $salary < 5750   => 5500,
            $salary < 6250   => 6000,
            $salary < 6750   => 6500,
            $salary < 7250   => 7000,
            $salary < 7750   => 7500,
            $salary < 8250   => 8000,
            $salary < 8750   => 8500,
            $salary < 9250   => 9000,
            $salary < 9750   => 9500,
            $salary < 10250  => 10000,
            $salary < 10750  => 10500,
            $salary < 11250  => 11000,
            $salary < 11750  => 11500,
            $salary < 12250  => 12000,
            $salary < 12750  => 12500,
            $salary < 13250  => 13000,
            $salary < 13750  => 13500,
            $salary < 14250  => 14000,
            $salary < 14750  => 14500,
            $salary < 15250  => 15000,
            $salary < 15750  => 15500,
            $salary < 16250  => 16000,
            $salary < 16750  => 16500,
            $salary < 17250  => 17000,
            $salary < 17750  => 17500,
            $salary < 18250  => 18000,
            $salary < 18750  => 18500,
            $salary < 19250  => 19000,
            $salary < 19750  => 19500,
            $salary < 20250  => 20000,
            $salary < 20750  => 20500,
            $salary < 21250  => 21000,
            $salary < 21750  => 21500,
            $salary < 22250  => 22000,
            $salary < 22750  => 22500,
            $salary < 23250  => 23000,
            $salary < 23750  => 23500,
            $salary < 24250  => 24000,
            $salary < 24750  => 24500,
            $salary < 25250  => 25000,
            $salary < 25750  => 25500,
            $salary < 26250  => 26000,
            $salary < 26750  => 26500,
            $salary < 27250  => 27000,
            $salary < 27750  => 27500,
            $salary < 28250  => 28000,
            $salary < 28750  => 28500,
            $salary < 29250  => 29000,
            $salary < 29750  => 29500,
            default          => 30000,
        };

        return $msc * 0.045;
    }

    // PhilHealth 2024: 2.5% of basic salary, min ₱500, max ₱2,500
    public function computePhilHealth(float $salary): float
    {
        $contribution = $salary * 0.025;
        return min(max($contribution, 500), 2500);
    }

    // Pag-IBIG 2024: 2% (1% if ≤₱1,500), max ₱200
    public function computePagIbig(float $salary): float
    {
        $rate = $salary <= 1500 ? 0.01 : 0.02;
        return min($salary * $rate, 200);
    }

    // BIR TRAIN Law (2023+): monthly withholding tax
    public function computeWithholdingTax(float $monthlyTaxable): float
    {
        $annual = $monthlyTaxable * 12;

        $annualTax = match(true) {
            $annual <= 250000               => 0,
            $annual <= 400000               => ($annual - 250000) * 0.15,
            $annual <= 800000               => 22500  + ($annual - 400000) * 0.20,
            $annual <= 2000000              => 102500 + ($annual - 800000) * 0.25,
            $annual <= 8000000              => 402500 + ($annual - 2000000) * 0.30,
            default                         => 2202500 + ($annual - 8000000) * 0.35,
        };

        return $annualTax / 12;
    }
}
