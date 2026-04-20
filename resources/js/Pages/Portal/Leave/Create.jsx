import PortalLayout from '@/Layouts/PortalLayout';
import { Head, Link, useForm } from '@inertiajs/react';

const inputClass = "w-full border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm";

export default function Create({ leaveTypes, balances }) {
    const { data, setData, post, processing, errors } = useForm({
        leave_type_id: '', start_date: '', end_date: '', reason: '',
    });

    const selectedBalance = balances.find(b => String(b.leave_type_id) === String(data.leave_type_id));
    const remaining = selectedBalance ? selectedBalance.allocated_days - selectedBalance.used_days : null;

    return (
        <PortalLayout header={<h2 className="text-xl font-semibold text-gray-800">Apply for Leave</h2>}>
            <Head title="Apply for Leave" />
            <div className="max-w-xl">
                <div className="bg-white rounded-xl shadow p-6">
                    <form onSubmit={e => { e.preventDefault(); post(route('portal.leave.store')); }} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Leave Type *</label>
                            <select value={data.leave_type_id} onChange={e => setData('leave_type_id', e.target.value)} className={inputClass}>
                                <option value="">Select type…</option>
                                {leaveTypes.map(lt => <option key={lt.id} value={lt.id}>{lt.name} ({lt.days_per_year} days/yr) {lt.is_paid ? '· Paid' : '· Unpaid'}</option>)}
                            </select>
                            {remaining !== null && (
                                <p className="mt-1 text-xs text-indigo-600">{remaining} day{remaining !== 1 ? 's' : ''} remaining this year</p>
                            )}
                            {errors.leave_type_id && <p className="mt-1 text-xs text-red-500">{errors.leave_type_id}</p>}
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date *</label>
                                <input type="date" value={data.start_date} onChange={e => setData('start_date', e.target.value)} className={inputClass} />
                                {errors.start_date && <p className="mt-1 text-xs text-red-500">{errors.start_date}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">End Date *</label>
                                <input type="date" value={data.end_date} onChange={e => setData('end_date', e.target.value)} className={inputClass} />
                                {errors.end_date && <p className="mt-1 text-xs text-red-500">{errors.end_date}</p>}
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
                            <textarea rows={3} value={data.reason} onChange={e => setData('reason', e.target.value)}
                                placeholder="Optional — provide context for your request" className={inputClass} />
                        </div>
                        <div className="flex justify-end gap-3 pt-2">
                            <Link href={route('portal.leave.index')} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800">Cancel</Link>
                            <button type="submit" disabled={processing}
                                className="px-5 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition">
                                Submit Request
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </PortalLayout>
    );
}
