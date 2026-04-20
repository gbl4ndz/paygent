import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';

const inputClass = "w-full border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm";

export default function Edit({ leaveType }) {
    const { data, setData, patch, processing, errors } = useForm({
        name: leaveType.name,
        days_per_year: leaveType.days_per_year,
        is_paid: leaveType.is_paid,
        requires_approval: leaveType.requires_approval,
        is_active: leaveType.is_active,
    });

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold text-gray-800">Edit Leave Type</h2>}>
            <Head title="Edit Leave Type" />
            <div className="py-8 max-w-xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white shadow rounded-xl p-6">
                    <form onSubmit={e => { e.preventDefault(); patch(route('leave-types.update', leaveType.id)); }} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                            <input type="text" value={data.name} onChange={e => setData('name', e.target.value)} className={inputClass} />
                            {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Days Per Year *</label>
                            <input type="number" min="0" value={data.days_per_year} onChange={e => setData('days_per_year', e.target.value)} className={inputClass} />
                        </div>
                        <div className="space-y-3">
                            {[['is_paid', 'Paid Leave'], ['requires_approval', 'Requires Approval'], ['is_active', 'Active']].map(([key, label]) => (
                                <label key={key} className="flex items-center gap-3 cursor-pointer">
                                    <input type="checkbox" checked={data[key]} onChange={e => setData(key, e.target.checked)}
                                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                                    <span className="text-sm text-gray-700">{label}</span>
                                </label>
                            ))}
                        </div>
                        <div className="flex justify-end gap-3 pt-2">
                            <Link href={route('leave-types.index')} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800">Cancel</Link>
                            <button type="submit" disabled={processing} className="px-5 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition">Save Changes</button>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
