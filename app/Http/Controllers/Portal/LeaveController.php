<?php

namespace App\Http\Controllers\Portal;

use App\Http\Controllers\Controller;
use App\Models\LeaveBalance;
use App\Models\LeaveRequest;
use App\Models\LeaveType;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LeaveController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $employee = auth()->user()->employee;
        abort_unless($employee, 403);

        return Inertia::render('Portal/Leave/Index', [
            'requests' => LeaveRequest::with('leaveType')
                ->where('employee_id', $employee->id)
                ->latest()->paginate(20),
            'balances' => LeaveBalance::with('leaveType')
                ->where('employee_id', $employee->id)
                ->where('year', now()->year)->get(),
        ]);
    }

    public function create()
    {
        $employee = auth()->user()->employee;
        abort_unless($employee, 403);

        return Inertia::render('Portal/Leave/Create', [
            'leaveTypes' => LeaveType::where('is_active', true)->get(['id', 'name', 'days_per_year', 'is_paid']),
            'balances'   => LeaveBalance::with('leaveType')
                ->where('employee_id', $employee->id)
                ->where('year', now()->year)->get(),
        ]);
    }

    public function store(Request $request)
    {
        $employee = auth()->user()->employee;
        abort_unless($employee, 403);

        $request->validate([
            'leave_type_id' => 'required|exists:leave_types,id',
            'start_date'    => 'required|date|after_or_equal:today',
            'end_date'      => 'required|date|after_or_equal:start_date',
            'reason'        => 'nullable|string|max:500',
        ]);

        $totalDays = (new \Carbon\Carbon($request->start_date))
            ->diffInWeekdays(new \Carbon\Carbon($request->end_date)) + 1;

        LeaveRequest::create([
            'company_id'    => auth()->user()->company_id,
            'employee_id'   => $employee->id,
            'leave_type_id' => $request->leave_type_id,
            'start_date'    => $request->start_date,
            'end_date'      => $request->end_date,
            'total_days'    => $totalDays,
            'reason'        => $request->reason,
            'status'        => 'pending',
        ]);

        return redirect()->route('portal.leave.index')->with('success', 'Leave request submitted.');
    }

    public function destroy(LeaveRequest $leaveRequest)
    {
        abort_unless($leaveRequest->employee_id === auth()->user()->employee_id, 403);
        abort_unless($leaveRequest->status === 'pending', 422, 'Cannot cancel a reviewed request.');
        $leaveRequest->delete();
        return back()->with('success', 'Request cancelled.');
    }
}
