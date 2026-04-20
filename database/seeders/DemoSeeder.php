<?php

namespace Database\Seeders;

use App\Models\Company;
use App\Models\Department;
use App\Models\Employee;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DemoSeeder extends Seeder
{
    public function run(): void
    {
        // Create demo company
        $company = Company::firstOrCreate(
            ['slug' => 'demo-company'],
            [
                'name'      => 'Demo Company',
                'email'     => 'demo@paygent.ph',
                'industry'  => 'Technology',
                'plan'      => 'pro',
                'is_active' => true,
            ]
        );

        // Seed default leave types + payroll settings
        DefaultLeaveTypesSeeder::seedForCompany($company->id);

        // Department
        $dept = Department::firstOrCreate(
            ['company_id' => $company->id, 'code' => 'ENG'],
            ['name' => 'Engineering', 'description' => 'Software development team', 'is_active' => true]
        );

        // --- Admin user ---
        User::firstOrCreate(
            ['email' => 'admin@demo.com'],
            [
                'name'       => 'Admin User',
                'password'   => Hash::make('password'),
                'company_id' => $company->id,
                'role'       => 'admin',
            ]
        );

        // --- Manager employee + user ---
        $managerEmployee = Employee::firstOrCreate(
            ['email' => 'manager@demo.com', 'company_id' => $company->id],
            [
                'department_id'   => $dept->id,
                'employee_number' => 'EMP-0001',
                'first_name'      => 'Maria',
                'last_name'       => 'Santos',
                'phone'           => '09171234567',
                'position'        => 'Engineering Manager',
                'employment_type' => 'full-time',
                'basic_salary'    => 80000,
                'hired_at'        => '2022-01-15',
                'status'          => 'active',
            ]
        );

        $managerUser = User::firstOrCreate(
            ['email' => 'manager@demo.com'],
            [
                'name'        => 'Maria Santos',
                'password'    => Hash::make('password'),
                'company_id'  => $company->id,
                'employee_id' => $managerEmployee->id,
                'role'        => 'manager',
            ]
        );

        // --- Employee user ---
        $employee = Employee::firstOrCreate(
            ['email' => 'employee@demo.com', 'company_id' => $company->id],
            [
                'department_id'   => $dept->id,
                'manager_id'      => $managerEmployee->id,
                'employee_number' => 'EMP-0002',
                'first_name'      => 'Juan',
                'last_name'       => 'dela Cruz',
                'phone'           => '09189876543',
                'position'        => 'Software Engineer',
                'employment_type' => 'full-time',
                'basic_salary'    => 45000,
                'hired_at'        => '2023-06-01',
                'status'          => 'active',
            ]
        );

        User::firstOrCreate(
            ['email' => 'employee@demo.com'],
            [
                'name'        => 'Juan dela Cruz',
                'password'    => Hash::make('password'),
                'company_id'  => $company->id,
                'employee_id' => $employee->id,
                'role'        => 'employee',
            ]
        );

        // Seed dummy data (attendance, leave, payroll)
        $this->call(DemoDummyDataSeeder::class);

        $this->command->info('');
        $this->command->info('✅  Demo accounts created:');
        $this->command->table(
            ['Role', 'Email', 'Password'],
            [
                ['Admin',    'admin@demo.com',    'password'],
                ['Manager',  'manager@demo.com',  'password'],
                ['Employee', 'employee@demo.com', 'password'],
            ]
        );
    }
}
