<?php

namespace App\Http\Controllers;

use App\Models\LeaveType;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LeaveTypeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('Leave/Types/Index', [
            'leaveTypes' => LeaveType::withCount('leaveRequests')->latest()->get(),
        ]);
    }

    public function create()
    {
        return Inertia::render('Leave/Types/Create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'name'              => 'required|string|max:100',
            'days_per_year'     => 'required|integer|min:0',
            'is_paid'           => 'boolean',
            'requires_approval' => 'boolean',
            'is_active'         => 'boolean',
        ]);
        LeaveType::create($request->all());
        return redirect()->route('leave-types.index')->with('success', 'Leave type created.');
    }

    public function edit(LeaveType $leaveType)
    {
        return Inertia::render('Leave/Types/Edit', ['leaveType' => $leaveType]);
    }

    public function update(Request $request, LeaveType $leaveType)
    {
        $request->validate([
            'name'              => 'required|string|max:100',
            'days_per_year'     => 'required|integer|min:0',
            'is_paid'           => 'boolean',
            'requires_approval' => 'boolean',
            'is_active'         => 'boolean',
        ]);
        $leaveType->update($request->all());
        return redirect()->route('leave-types.index')->with('success', 'Leave type updated.');
    }

    public function destroy(LeaveType $leaveType)
    {
        $leaveType->delete();
        return redirect()->route('leave-types.index')->with('success', 'Leave type deleted.');
    }
}
