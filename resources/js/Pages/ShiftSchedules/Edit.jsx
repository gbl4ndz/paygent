import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';

const DAYS = [
    { value: 1, label: 'Monday' }, { value: 2, label: 'Tuesday' },
    { value: 3, label: 'Wednesday' }, { value: 4, label: 'Thursday' },
    { value: 5, label: 'Friday' }, { value: 6, label: 'Saturday' },
    { value: 7, label: 'Sunday' },
];

export default function Edit({ schedule }) {
    const { data, setData, put, processing, errors } = useForm({
        name: schedule.name, clock_in_time: schedule.clock_in_time,
        clock_out_time: schedule.clock_out_time, work_days: schedule.work_days,
        is_default: schedule.is_default,
    });
    const toggleDay = d => setData('work_days',
        data.work_days.includes(d) ? data.work_days.filter(x => x !== d) : [...data.work_days, d].sort()
    );
    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold text-gray-800">Edit Shift Schedule</h2>}>
            <Head title="Edit Shift Schedule" />
            <div className="py-8 max-w-xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-xl shadow p-6 space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Schedule Name</label>
                        <input value={data.name} onChange={e => setData('name', e.target.value)}
                            className="w-full border-gray-300 rounded-lg text-sm focus:ring-brand-green focus:border-brand-green" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Clock In</label>
                            <input type="time" value={data.clock_in_time} onChange={e => setData('clock_in_time', e.target.value)}
                                className="w-full border-gray-300 rounded-lg text-sm focus:ring-brand-green focus:border-brand-green" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Clock Out</label>
                            <input type="time" value={data.clock_out_time} onChange={e => setData('clock_out_time', e.target.value)}
                                className="w-full border-gray-300 rounded-lg text-sm focus:ring-brand-green focus:border-brand-green" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Work Days</label>
                        <div className="flex flex-wrap gap-2">
                            {DAYS.map(d => (
                                <button key={d.value} type="button" onClick={() => toggleDay(d.value)}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition ${
                                        data.work_days.includes(d.value)
                                            ? 'bg-brand-navy text-white border-brand-navy'
                                            : 'bg-white text-gray-600 border-gray-300 hover:border-brand-navy'
                                    }`}>{d.label}</button>
                            ))}
                        </div>
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={data.is_default} onChange={e => setData('is_default', e.target.checked)}
                            className="rounded border-gray-300 text-brand-green focus:ring-brand-green" />
                        <span className="text-sm text-gray-700">Set as default schedule</span>
                    </label>
                    <div className="flex justify-end gap-3 pt-2">
                        <a href={route('shift-schedules.index')} className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700">Cancel</a>
                        <button onClick={() => put(route('shift-schedules.update', schedule.id))} disabled={processing}
                            className="px-4 py-2 bg-brand-navy text-white text-sm rounded-lg hover:bg-brand-navy-700 disabled:opacity-50">
                            Save Changes
                        </button>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
