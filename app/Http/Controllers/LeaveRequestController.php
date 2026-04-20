<?php

namespace App\Http\Controllers;

use App\Models\LeaveBalance;
use App\Models\LeaveRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LeaveRequestController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('Leave/Requests/Index', [
            'requests' => LeaveRequest::with(['employee', 'leaveType', 'reviewer'])
                ->latest()->paginate(20),
            'pending' => LeaveRequest::with(['employee', 'leaveType'])
                ->whereIn('status', ['pending', 'manager_approved'])
                ->latest()->get(),
        ]);
    }

    public function show(LeaveRequest $leaveRequest)
    {
        return Inertia::render('Leave/Requests/Show', [
            'leaveRequest' => $leaveRequest->load(['employee', 'leaveType', 'reviewer']),
        ]);
    }

    public function approve(LeaveRequest $leaveRequest)
    {
        // HR can approve from 'pending' (no manager) or 'manager_approved'
        abort_unless(in_array($leaveRequest->status, ['pending', 'manager_approved']), 422, 'Already reviewed.');

        $leaveRequest->update([
            'status'      => 'approved',
            'reviewed_by' => auth()->id(),
            'reviewed_at' => now(),
        ]);

        LeaveBalance::firstOrCreate(
            [
                'company_id'    => auth()->user()->company_id,
                'employee_id'   => $leaveRequest->employee_id,
                'leave_type_id' => $leaveRequest->leave_type_id,
                'year'          => $leaveRequest->start_date->year,
            ],
            ['allocated_days' => $leaveRequest->leaveType->days_per_year, 'used_days' => 0]
        )->increment('used_days', $leaveRequest->total_days);

        return back()->with('success', 'Leave approved.');
    }

    public function reject(Request $request, LeaveRequest $leaveRequest)
    {
        abort_unless(in_array($leaveRequest->status, ['pending', 'manager_approved']), 422, 'Already reviewed.');

        $leaveRequest->update([
            'status' => 'rejected', 'reviewed_by' => auth()->id(),
            'reviewed_at' => now(), 'review_notes' => $request->notes,
        ]);

        return back()->with('success', 'Leave rejected.');
    }

    public function destroy(LeaveRequest $leaveRequest)
    {
        $leaveRequest->delete();
        return redirect()->route('leave-requests.index')->with('success', 'Request deleted.');
    }
}
