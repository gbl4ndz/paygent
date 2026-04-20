<?php

namespace App\Http\Controllers;

use App\Models\ShiftSchedule;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ShiftScheduleController extends Controller
{
    public function index()
    {
        return Inertia::render('ShiftSchedules/Index', [
            'schedules' => ShiftSchedule::withCount('employees')->get(),
        ]);
    }

    public function create()
    {
        return Inertia::render('ShiftSchedules/Create');
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name'         => 'required|string|max:100',
            'clock_in_time'=> 'required|date_format:H:i',
            'clock_out_time'=> 'required|date_format:H:i',
            'work_days'    => 'required|array|min:1',
            'work_days.*'  => 'integer|between:1,7',
            'is_default'   => 'boolean',
        ]);

        if ($data['is_default'] ?? false) {
            ShiftSchedule::where('company_id', auth()->user()->company_id)->update(['is_default' => false]);
        }

        ShiftSchedule::create($data);
        return redirect()->route('shift-schedules.index')->with('success', 'Shift schedule created.');
    }

    public function edit(ShiftSchedule $shiftSchedule)
    {
        return Inertia::render('ShiftSchedules/Edit', ['schedule' => $shiftSchedule]);
    }

    public function update(Request $request, ShiftSchedule $shiftSchedule)
    {
        $data = $request->validate([
            'name'          => 'required|string|max:100',
            'clock_in_time' => 'required|date_format:H:i',
            'clock_out_time'=> 'required|date_format:H:i',
            'work_days'     => 'required|array|min:1',
            'work_days.*'   => 'integer|between:1,7',
            'is_default'    => 'boolean',
        ]);

        if ($data['is_default'] ?? false) {
            ShiftSchedule::where('company_id', auth()->user()->company_id)
                ->where('id', '!=', $shiftSchedule->id)
                ->update(['is_default' => false]);
        }

        $shiftSchedule->update($data);
        return redirect()->route('shift-schedules.index')->with('success', 'Shift schedule updated.');
    }

    public function destroy(ShiftSchedule $shiftSchedule)
    {
        $shiftSchedule->delete();
        return redirect()->route('shift-schedules.index')->with('success', 'Shift schedule deleted.');
    }
}
