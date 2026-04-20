import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';

const inputClass = "w-full border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm";

export default function Edit({ record, employees }) {
    const { data, setData, patch, processing, errors } = useForm({
        employee_id: record.employee_id,
        date: (record.date || '').split('T')[0],
        clock_in: record.clock_in || '',
        clock_out: record.clock_out || '',
        status: record.status,
        notes: record.notes || '',
    });

    const submit = (e) => { e.preventDefault(); patch(route('attendance.update', record.id)); };

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold text-gray-800">Edit Attendance</h2>}>
            <Head title="Edit Attendance" />
            <div className="py-8 max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white shadow rounded-xl p-6">
                    <form onSubmit={submit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Employee *</label>
                            <select value={data.employee_id} onChange={e => setData('employee_id', e.target.value)} className={inputClass}>
                                {employees.map(e => (
                                    <option key={e.id} value={e.id}>{e.first_name} {e.last_name} ({e.employee_number})</option>
                                ))}
                            </select>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
                                <input type="date" value={data.date} onChange={e => setData('date', e.target.value)} className={inputClass} />
                                {errors.date && <p className="mt-1 text-xs text-red-500">{errors.date}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Status *</label>
                                <select value={data.status} onChange={e => setData('status', e.target.value)} className={inputClass}>
                                    <option value="present">Present</option>
                                    <option value="absent">Absent</option>
                                    <option value="late">Late</option>
                                    <option value="half-day">Half Day</option>
                                    <option value="on-leave">On Leave</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Clock In</label>
                                <input type="time" value={data.clock_in} onChange={e => setData('clock_in', e.target.value)} className={inputClass} />
                                {errors.clock_in && <p className="mt-1 text-xs text-red-500">{errors.clock_in}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Clock Out</label>
                                <input type="time" value={data.clock_out} onChange={e => setData('clock_out', e.target.value)} className={inputClass} />
                                {errors.clock_out && <p className="mt-1 text-xs text-red-500">{errors.clock_out}</p>}
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                            <textarea rows={2} value={data.notes} onChange={e => setData('notes', e.target.value)} className={inputClass} />
                        </div>
                        <div className="flex justify-end gap-3 pt-2">
                            <Link href={route('attendance.index')} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800">Cancel</Link>
                            <button type="submit" disabled={processing}
                                className="px-5 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition">
                                Save Changes
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
