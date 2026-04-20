import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';

export default function Index({ leaveTypes }) {
    const { flash } = usePage().props;

    const destroy = (id) => {
        if (confirm('Delete this leave type?')) router.delete(route('leave-types.destroy', id));
    };

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold text-gray-800">Leave Types</h2>}>
            <Head title="Leave Types" />
            <div className="py-8 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                {flash?.success && <div className="mb-4 px-4 py-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">{flash.success}</div>}
                <div className="flex justify-between items-center mb-6">
                    <p className="text-sm text-gray-500">{leaveTypes.length} type{leaveTypes.length !== 1 ? 's' : ''}</p>
                    <Link href={route('leave-types.create')} className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition">+ New Leave Type</Link>
                </div>
                <div className="bg-white shadow rounded-xl overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>{['Name', 'Days/Year', 'Paid', 'Requires Approval', 'Requests', 'Status', ''].map(h => (
                                <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{h}</th>
                            ))}</tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {leaveTypes.length === 0 && <tr><td colSpan={7} className="px-6 py-10 text-center text-gray-400 text-sm">No leave types yet.</td></tr>}
                            {leaveTypes.map(lt => (
                                <tr key={lt.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium text-gray-900">{lt.name}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{lt.days_per_year}</td>
                                    <td className="px-6 py-4"><Badge v={lt.is_paid} yes="Paid" no="Unpaid" /></td>
                                    <td className="px-6 py-4"><Badge v={lt.requires_approval} yes="Yes" no="No" /></td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{lt.leave_requests_count}</td>
                                    <td className="px-6 py-4"><Badge v={lt.is_active} yes="Active" no="Inactive" /></td>
                                    <td className="px-6 py-4 text-right space-x-3">
                                        <Link href={route('leave-types.edit', lt.id)} className="text-indigo-600 hover:text-indigo-800 text-sm">Edit</Link>
                                        <button onClick={() => destroy(lt.id)} className="text-red-500 hover:text-red-700 text-sm">Delete</button>
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

const Badge = ({ v, yes, no }) => (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${v ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{v ? yes : no}</span>
);
