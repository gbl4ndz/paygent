import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';

const DAY_LABELS = { 1:'Mon', 2:'Tue', 3:'Wed', 4:'Thu', 5:'Fri', 6:'Sat', 7:'Sun' };

export default function Index({ schedules, flash }) {
    const destroy = id => {
        if (confirm('Delete this shift schedule?')) router.delete(route('shift-schedules.destroy', id));
    };
    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold text-gray-800">Shift Schedules</h2>}>
            <Head title="Shift Schedules" />
            <div className="py-8 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                {flash?.success && <div className="mb-4 px-4 py-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">{flash.success}</div>}
                <div className="flex justify-end mb-4">
                    <Link href={route('shift-schedules.create')}
                        className="px-4 py-2 bg-brand-navy text-white text-sm font-medium rounded-lg hover:bg-brand-navy-700">
                        + New Schedule
                    </Link>
                </div>
                <div className="bg-white rounded-xl shadow overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-100">
                        <thead className="bg-gray-50">
                            <tr>
                                {['Name','Hours','Work Days','Employees','Default',''].map(h => (
                                    <th key={h} className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {schedules.length === 0 && (
                                <tr><td colSpan={6} className="px-5 py-10 text-center text-gray-400 text-sm">No shift schedules yet.</td></tr>
                            )}
                            {schedules.map(s => (
                                <tr key={s.id} className="hover:bg-gray-50">
                                    <td className="px-5 py-4 font-medium text-gray-900 text-sm">{s.name}</td>
                                    <td className="px-5 py-4 text-sm text-gray-600">{s.clock_in_time} – {s.clock_out_time}</td>
                                    <td className="px-5 py-4 text-sm text-gray-600">
                                        {s.work_days.map(d => DAY_LABELS[d]).join(', ')}
                                    </td>
                                    <td className="px-5 py-4 text-sm text-gray-600">{s.employees_count}</td>
                                    <td className="px-5 py-4">
                                        {s.is_default && <span className="px-2 py-0.5 bg-brand-green/15 text-brand-green rounded-full text-xs font-medium">Default</span>}
                                    </td>
                                    <td className="px-5 py-4 text-right space-x-3">
                                        <Link href={route('shift-schedules.edit', s.id)} className="text-brand-navy text-sm hover:underline">Edit</Link>
                                        <button onClick={() => destroy(s.id)} className="text-red-500 text-sm hover:text-red-700">Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
