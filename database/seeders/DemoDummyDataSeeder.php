<?php

namespace Database\Seeders;

use App\Models\Attendance;
use App\Models\Employee;
use App\Models\LeaveBalance;
use App\Models\LeaveRequest;
use App\Models\LeaveType;
use App\Models\Payroll;
use App\Models\ShiftSchedule;
use App\Models\TimeLog;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class DemoDummyDataSeeder extends Seeder
{
    public function run(): void
    {
        $employee = Employee::where('email', 'employee@demo.com')->firstOrFail();
        $manager  = Employee::where('email', 'manager@demo.com')->firstOrFail();
        $hrUser   = User::where('email', 'admin@demo.com')->firstOrFail();
        $mgrUser  = User::where('email', 'manager@demo.com')->firstOrFail();
        $company  = $employee->company_id;

        // ── 1. Ensure a proper day shift exists and assign to both employees ──────
        $shift = ShiftSchedule::firstOrCreate(
            ['company_id' => $company, 'name' => 'Day Shift'],
            [
                'clock_in_time'  => '08:00',
                'clock_out_time' => '17:00',
                'work_days'      => [1, 2, 3, 4, 5],
                'is_default'     => true,
            ]
        );

        $employee->update(['shift_schedule_id' => $shift->id]);
        $manager->update(['shift_schedule_id'  => $shift->id]);

        // ── 2. Leave balances ────────────────────────────────────────────────────
        $leaveTypes = LeaveType::where('company_id', $company)->get()->keyBy('name');

        $balances = [
            'Vacation Leave'   => ['allocated' => 6,   'used' => 2],
            'Sick Leave'       => ['allocated' => 6,   'used' => 1],
            'Emergency Leave'  => ['allocated' => 3,   'used' => 0],
            'Paternity Leave'  => ['allocated' => 7,   'used' => 0],
            'Maternity Leave'  => ['allocated' => 105, 'used' => 0],
            'Bereavement Leave'=> ['allocated' => 3,   'used' => 0],
        ];

        foreach ($balances as $typeName => $data) {
            $lt = $leaveTypes->get($typeName);
            if (!$lt) continue;
            LeaveBalance::updateOrCreate(
                ['employee_id' => $employee->id, 'leave_type_id' => $lt->id, 'year' => 2026],
                [
                    'company_id'     => $company,
                    'allocated_days' => $data['allocated'],
                    'used_days'      => $data['used'],
                ]
            );
        }

        // Manager balances too
        foreach ($balances as $typeName => $data) {
            $lt = $leaveTypes->get($typeName);
            if (!$lt) continue;
            LeaveBalance::updateOrCreate(
                ['employee_id' => $manager->id, 'leave_type_id' => $lt->id, 'year' => 2026],
                [
                    'company_id'     => $company,
                    'allocated_days' => $data['allocated'],
                    'used_days'      => 0,
                ]
            );
        }

        // ── 3. Leave requests ────────────────────────────────────────────────────
        $vl = $leaveTypes->get('Vacation Leave');
        $sl = $leaveTypes->get('Sick Leave');
        $el = $leaveTypes->get('Emergency Leave');

        $leaveData = [
            // Approved VL — March
            [
                'employee_id'   => $employee->id,
                'leave_type_id' => $vl?->id,
                'start_date'    => '2026-03-10',
                'end_date'      => '2026-03-11',
                'total_days'    => 2,
                'reason'        => 'Family vacation trip.',
                'status'        => 'approved',
                'manager_reviewed_by' => $mgrUser->id,
                'manager_reviewed_at' => '2026-03-05 09:00:00',
                'reviewed_by'   => $hrUser->id,
                'reviewed_at'   => '2026-03-05 11:00:00',
                'review_notes'  => 'Approved. Enjoy your vacation!',
            ],
            // Approved SL — April 3
            [
                'employee_id'   => $employee->id,
                'leave_type_id' => $sl?->id,
                'start_date'    => '2026-04-03',
                'end_date'      => '2026-04-03',
                'total_days'    => 1,
                'reason'        => 'Fever and flu symptoms.',
                'status'        => 'approved',
                'manager_reviewed_by' => $mgrUser->id,
                'manager_reviewed_at' => '2026-04-02 08:30:00',
                'reviewed_by'   => $hrUser->id,
                'reviewed_at'   => '2026-04-02 10:00:00',
                'review_notes'  => 'Approved. Get well soon.',
            ],
            // Manager-approved (waiting on HR) — current period
            [
                'employee_id'   => $employee->id,
                'leave_type_id' => $vl?->id,
                'start_date'    => '2026-04-22',
                'end_date'      => '2026-04-23',
                'total_days'    => 2,
                'reason'        => 'Personal matters.',
                'status'        => 'manager_approved',
                'manager_reviewed_by' => $mgrUser->id,
                'manager_reviewed_at' => '2026-04-16 09:15:00',
                'manager_review_notes'=> 'Approved by manager. Forwarded to HR.',
            ],
            // Pending (just filed)
            [
                'employee_id'   => $employee->id,
                'leave_type_id' => $el?->id,
                'start_date'    => '2026-04-28',
                'end_date'      => '2026-04-28',
                'total_days'    => 1,
                'reason'        => 'Family emergency.',
                'status'        => 'pending',
            ],
            // Rejected
            [
                'employee_id'   => $employee->id,
                'leave_type_id' => $vl?->id,
                'start_date'    => '2026-02-17',
                'end_date'      => '2026-02-18',
                'total_days'    => 2,
                'reason'        => 'Short trip.',
                'status'        => 'rejected',
                'manager_reviewed_by' => $mgrUser->id,
                'manager_reviewed_at' => '2026-02-10 14:00:00',
                'review_notes'  => 'Rejected due to project deadline conflict.',
                'reviewed_by'   => $hrUser->id,
                'reviewed_at'   => '2026-02-10 16:00:00',
            ],
        ];

        foreach ($leaveData as $data) {
            LeaveRequest::firstOrCreate(
                [
                    'employee_id'   => $data['employee_id'],
                    'start_date'    => $data['start_date'],
                    'leave_type_id' => $data['leave_type_id'],
                ],
                array_merge(['company_id' => $company], $data)
            );
        }

        // ── 4. Attendance + time logs ────────────────────────────────────────────
        // Clean up existing records first
        $existingIds = Attendance::where('employee_id', $employee->id)->pluck('id');
        TimeLog::whereIn('attendance_id', $existingIds)->delete();
        Attendance::where('employee_id', $employee->id)->delete();

        // Apr 1–15 complete cutoff — all approved, 3 late days
        // Format: [date, status, attendance_status, [clock_in, clock_out], notes]
        $days = [
            // Week 1
            ['2026-04-01', 'approved', 'present', ['08:02', '17:05']],
            ['2026-04-02', 'approved', 'present', ['07:58', '17:08']],
            ['2026-04-03', 'approved', 'on-leave', null, 'Sick leave — approved'],  // SL
            // Apr 4–5 weekend
            ['2026-04-06', 'approved', 'late',    ['08:22', '17:00']],
            ['2026-04-07', 'approved', 'present', ['08:04', '17:06']],
            ['2026-04-08', 'approved', 'present', ['07:59', '17:10']],
            ['2026-04-09', 'approved', 'late',    ['08:41', '17:15']],
            ['2026-04-10', 'approved', 'present', ['07:55', '17:03']],
            // Apr 11–12 weekend
            ['2026-04-13', 'approved', 'present', ['08:01', '17:05']],
            ['2026-04-14', 'approved', 'late',    ['08:19', '17:00']],
            ['2026-04-15', 'approved', 'present', ['08:03', '17:08']],
        ];

        foreach ($days as $day) {
            [$date, $approvalStatus, $attendanceStatus, $times, $notes] = array_pad($day, 5, null);

            $att = Attendance::create([
                'employee_id'         => $employee->id,
                'date'                => $date,
                'status'              => $attendanceStatus,
                'approval_status'     => $approvalStatus,
                'notes'               => $notes,
                'submitted_at'        => Carbon::parse($date)->addDay()->setTime(8, 0),
                'manager_approved_by' => $mgrUser->id,
                'manager_approved_at' => Carbon::parse($date)->addDays(2)->setTime(10, 0),
                'approved_by'         => $hrUser->id,
                'approved_at'         => Carbon::parse($date)->addDays(3)->setTime(14, 0),
            ]);

            if ($times) {
                TimeLog::create([
                    'attendance_id' => $att->id,
                    'clock_in'      => $times[0],
                    'clock_out'     => $times[1],
                ]);
            }
        }

        // ── 5. Payroll records ───────────────────────────────────────────────────
        $payrollData = [
            [
                'period_start' => '2026-03-01', 'period_end' => '2026-03-15',
                'basic_salary' => 22500, 'allowances' => 1500, 'deductions' => 2010.50,
                'ph_deductions'=> json_encode(['sss' => 1125, 'philhealth' => 450, 'pagibig' => 100, 'tax' => 335.50]),
                'net_pay'      => 21989.50, 'status' => 'paid',
                'processed_at' => '2026-03-20 10:00:00',
            ],
            [
                'period_start' => '2026-03-16', 'period_end' => '2026-03-31',
                'basic_salary' => 22500, 'allowances' => 1500, 'deductions' => 2010.50,
                'ph_deductions'=> json_encode(['sss' => 1125, 'philhealth' => 450, 'pagibig' => 100, 'tax' => 335.50]),
                'net_pay'      => 21989.50, 'status' => 'paid',
                'processed_at' => '2026-04-05 10:00:00',
            ],
            [
                'period_start' => '2026-04-01', 'period_end' => '2026-04-15',
                'basic_salary' => 22500, 'allowances' => 1500, 'deductions' => 2010.50,
                'ph_deductions'=> json_encode(['sss' => 1125, 'philhealth' => 450, 'pagibig' => 100, 'tax' => 335.50]),
                'net_pay'      => 21989.50, 'status' => 'processed',
                'processed_at' => '2026-04-20 10:00:00',
            ],
        ];

        foreach ($payrollData as $p) {
            Payroll::firstOrCreate(
                ['employee_id' => $employee->id, 'period_start' => $p['period_start']],
                array_merge(['employee_id' => $employee->id], $p)
            );
        }

        $this->command->info('✅  Demo dummy data seeded successfully.');
        $this->command->info('   - Day Shift schedule assigned');
        $this->command->info('   - Leave balances (6 types)');
        $this->command->info('   - Leave requests (5 records: approved/pending/rejected)');
        $this->command->info('   - Attendance + time logs (Apr 1–15 cutoff, 3 late days)');
        $this->command->info('   - Payroll records (3 periods)');
    }

}
