<?php

namespace App\Http\Controllers\Manager;

use App\Http\Controllers\Controller;
use App\Models\LeaveRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LeaveController extends Controller
{
    public function index()
    {
        $employee = auth()->user()->employee;
        abort_unless($employee, 403);

        $subordinateIds = $employee->subordinates()->pluck('id');

        return Inertia::render('Manager/Leave', [
            'pending' => LeaveRequest::with(['employee', 'leaveType'])
                ->whereIn('employee_id', $subordinateIds)
                ->where('status', 'pending')
                ->latest()
                ->get(),
            'recent' => LeaveRequest::with(['employee', 'leaveType'])
                ->whereIn('employee_id', $subordinateIds)
                ->whereIn('status', ['manager_approved', 'approved', 'rejected'])
                ->latest('updated_at')
                ->limit(30)
                ->get(),
        ]);
    }

    public function approve(LeaveRequest $leaveRequest)
    {
        $this->authorizeSubordinate($leaveRequest);
        abort_unless($leaveRequest->status === 'pending', 422);

        $leaveRequest->update([
            'status'               => 'manager_approved',
            'manager_reviewed_by'  => auth()->id(),
            'manager_reviewed_at'  => now(),
            'manager_review_notes' => null,
        ]);

        return back()->with('success', 'Leave request approved — pending HR final approval.');
    }

    public function reject(Request $request, LeaveRequest $leaveRequest)
    {
        $this->authorizeSubordinate($leaveRequest);
        abort_unless($leaveRequest->status === 'pending', 422);

        $leaveRequest->update([
            'status'               => 'rejected',
            'manager_reviewed_by'  => auth()->id(),
            'manager_reviewed_at'  => now(),
            'manager_review_notes' => $request->notes,
        ]);

        return back()->with('success', 'Leave request rejected.');
    }

    private function authorizeSubordinate(LeaveRequest $leaveRequest): void
    {
        $employee = auth()->user()->employee;
        abort_unless($employee, 403);
        abort_unless(
            $leaveRequest->employee->manager_id === $employee->id,
            403, 'Not your subordinate.'
        );
    }
}
