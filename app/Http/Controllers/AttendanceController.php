<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreAttendanceRequest;
use App\Http\Requests\UpdateAttendanceRequest;
use App\Models\Attendance;
use App\Models\Employee;
use App\Models\TimeLog;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AttendanceController extends Controller
{
    public function index()
    {
        return Inertia::render('Attendance/Index', [
            'records' => Attendance::with('employee')
                ->latest('date')
                ->paginate(30),
            // HR sees submitted (no manager) + manager_approved records awaiting final HR approval
            'pending' => Attendance::with(['employee', 'timeLogs'])
                ->whereIn('approval_status', ['submitted', 'manager_approved'])
                ->latest('submitted_at')
                ->get(),
        ]);
    }

    public function approve(Attendance $attendance)
    {
        abort_unless(in_array($attendance->approval_status, ['submitted', 'manager_approved']), 422);

        // If the employee has a manager and the manager hasn't approved yet, block
        if ($attendance->approval_status === 'submitted' && $attendance->employee->manager_id) {
            abort(422, 'Waiting for manager approval first.');
        }

        $attendance->update([
            'approval_status' => 'approved',
            'approved_by'     => auth()->id(),
            'approved_at'     => now(),
            'rejection_notes' => null,
        ]);
        return back()->with('success', 'Attendance approved.');
    }

    public function reject(\Illuminate\Http\Request $request, Attendance $attendance)
    {
        abort_unless(in_array($attendance->approval_status, ['submitted', 'manager_approved']), 422);
        $attendance->update([
            'approval_status' => 'rejected',
            'approved_by'     => auth()->id(),
            'approved_at'     => now(),
            'rejection_notes' => $request->notes,
        ]);
        return back()->with('success', 'Attendance rejected.');
    }

    public function create()
    {
        return Inertia::render('Attendance/Create', [
            'employees' => Employee::where('status', 'active')->get(['id', 'first_name', 'last_name', 'employee_number']),
        ]);
    }

    public function store(StoreAttendanceRequest $request)
    {
        Attendance::create($request->validated());
        return redirect()->route('attendance.index')->with('success', 'Attendance recorded.');
    }

    public function edit(Attendance $attendance)
    {
        return Inertia::render('Attendance/Edit', [
            'record' => $attendance->load('employee'),
            'employees' => Employee::where('status', 'active')->get(['id', 'first_name', 'last_name', 'employee_number']),
        ]);
    }

    public function update(UpdateAttendanceRequest $request, Attendance $attendance)
    {
        $attendance->update($request->validated());
        return redirect()->route('attendance.index')->with('success', 'Attendance updated.');
    }

    public function destroy(Attendance $attendance)
    {
        $attendance->delete();
        return redirect()->route('attendance.index')->with('success', 'Record deleted.');
    }

    public function employeeSummary(Employee $employee)
    {
        $records = Attendance::with('timeLogs')
            ->where('employee_id', $employee->id)
            ->orderByDesc('date')
            ->paginate(50);

        // Format dates for JS
        $records->getCollection()->transform(function ($r) {
            return array_merge($r->toArray(), [
                'date'         => $r->date?->format('Y-m-d'),
                'submitted_at' => $r->submitted_at?->toISOString(),
            ]);
        });

        return Inertia::render('Attendance/Employee', [
            'employee' => $employee->load('department')->only(['id', 'first_name', 'last_name', 'employee_number', 'position']),
            'records'  => $records,
        ]);
    }

    public function updateLogs(Request $request, Attendance $attendance)
    {
        $request->validate([
            'status'            => 'required|in:present,absent,late,half-day,on-leave',
            'notes'             => 'nullable|string|max:500',
            'logs'              => 'array',
            'logs.*.clock_in'   => 'required|date_format:H:i',
            'logs.*.clock_out'  => 'nullable|date_format:H:i',
        ]);

        $attendance->timeLogs()->delete();
        foreach ($request->logs ?? [] as $log) {
            TimeLog::create([
                'attendance_id' => $attendance->id,
                'clock_in'      => $log['clock_in'],
                'clock_out'     => $log['clock_out'] ?: null,
            ]);
        }

        $attendance->update([
            'status' => $request->status,
            'notes'  => $request->notes,
        ]);

        return back()->with('success', 'Attendance updated.');
    }
}
