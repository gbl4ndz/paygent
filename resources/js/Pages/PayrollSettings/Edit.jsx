import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';

export default function Edit({ settings, flash }) {
    const { data, setData, put, processing, errors } = useForm({
        first_cutoff_day: settings.first_cutoff_day,
        second_cutoff_day: settings.second_cutoff_day,
        review_days_after_cutoff: settings.review_days_after_cutoff,
    });
    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold text-gray-800">Payroll Settings</h2>}>
            <Head title="Payroll Settings" />
            <div className="py-8 max-w-lg mx-auto px-4 sm:px-6 lg:px-8">
                {flash?.success && <div className="mb-4 px-4 py-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">{flash.success}</div>}
                <div className="bg-white rounded-xl shadow p-6 space-y-6">
                    <p className="text-sm text-gray-500">Configure bi-monthly payroll cutoff dates and attendance review window.</p>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">1st Period Cutoff Day</label>
                            <p className="text-xs text-gray-400 mb-1">Period 1 runs from day 1 to this day</p>
                            <input type="number" min={1} max={28} value={data.first_cutoff_day}
                                onChange={e => setData('first_cutoff_day', parseInt(e.target.value))}
                                className="w-full border-gray-300 rounded-lg text-sm focus:ring-brand-green focus:border-brand-green" />
                            {errors.first_cutoff_day && <p className="mt-1 text-xs text-red-500">{errors.first_cutoff_day}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">2nd Period Cutoff Day</label>
                            <p className="text-xs text-gray-400 mb-1">Use 31 for last day of month</p>
                            <input type="number" min={1} max={31} value={data.second_cutoff_day}
                                onChange={e => setData('second_cutoff_day', parseInt(e.target.value))}
                                className="w-full border-gray-300 rounded-lg text-sm focus:ring-brand-green focus:border-brand-green" />
                            {errors.second_cutoff_day && <p className="mt-1 text-xs text-red-500">{errors.second_cutoff_day}</p>}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Attendance Review Window (days after cutoff)</label>
                        <p className="text-xs text-gray-400 mb-1">Employees can edit attendance within this many days after each cutoff</p>
                        <input type="number" min={1} max={30} value={data.review_days_after_cutoff}
                            onChange={e => setData('review_days_after_cutoff', parseInt(e.target.value))}
                            className="w-full border-gray-300 rounded-lg text-sm focus:ring-brand-green focus:border-brand-green" />
                    </div>

                    <div className="bg-brand-navy/5 rounded-lg p-4 text-xs text-gray-600 space-y-1">
                        <p className="font-medium text-brand-navy">Current Configuration Preview</p>
                        <p>• Period 1: Day 1 – Day {data.first_cutoff_day} · Review until Day {data.first_cutoff_day + data.review_days_after_cutoff}</p>
                        <p>• Period 2: Day {data.first_cutoff_day + 1} – Day {data.second_cutoff_day === 31 ? 'last' : data.second_cutoff_day} · Review {data.review_days_after_cutoff} days after end</p>
                    </div>

                    <div className="flex justify-end">
                        <button onClick={() => put(route('payroll-settings.update'))} disabled={processing}
                            className="px-5 py-2 bg-brand-navy text-white text-sm rounded-lg hover:bg-brand-navy-700 disabled:opacity-50">
                            Save Settings
                        </button>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
