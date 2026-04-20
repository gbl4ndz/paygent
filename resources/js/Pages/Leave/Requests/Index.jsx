import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';

const fmtDate = d => d ? new Date(d).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' }) : '—';

const statusColors = { pending: 'bg-yellow-100 text-yellow-700', approved: 'bg-green-100 text-green-700', rejected: 'bg-red-100 text-red-700', manager_approved: 'bg-blue-100 text-blue-700' };

function RejectModal({ request, onClose }) {
    const { data, setData, post, processing } = useForm({ notes: '' });
    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
                <h3 className="font-semibold text-gray-800 mb-3">Reject Leave Request</h3>
                <textarea rows={3} value={data.notes} onChange={e => setData('notes', e.target.value)}
                    placeholder="Reason for rejection (optional)" className="w-full border-gray-300 rounded-lg text-sm mb-4" />
                <div className="flex justify-end gap-3">
                    <button onClick={onClose} className="px-4 py-2 text-sm text-gray-600">Cancel</button>
                    <button disabled={processing} onClick={() => post(route('leave-requests.reject', request.id), { onSuccess: onClose })}
                        className="px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 disabled:opacity-50">Reject</button>
                </div>
            </div>
        </div>
    );
}

export default function Index({ requests }) {
    const { flash } = usePage().props;
    const [rejecting, setRejecting] = useState(null);

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold text-gray-800">Leave Requests</h2>}>
            <Head title="Leave Requests" />
            {rejecting && <RejectModal request={rejecting} onClose={() => setRejecting(null)} />}
            <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {flash?.success && <div className="mb-4 px-4 py-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">{flash.success}</div>}
                <div className="bg-white shadow rounded-xl overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>{['Employee', 'Leave Type', 'Period', 'Days', 'Reason', 'Status', ''].map(h => (
                                <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{h}</th>
                            ))}</tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {requests.data.length === 0 && <tr><td colSpan={7} className="px-6 py-10 text-center text-gray-400 text-sm">No leave requests.</td></tr>}
                            {requests.data.map(r => (
                                <tr key={r.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-gray-900">{r.employee?.first_name} {r.employee?.last_name}</div>
                                        <div className="text-xs text-gray-400">{r.employee?.employee_number}</div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{r.leave_type?.name}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{fmtDate(r.start_date)} – {fmtDate(r.end_date)}</td>
                                    <td className="px-6 py-4 text-sm text-gray-700">{r.total_days}d</td>
                                    <td className="px-6 py-4 text-sm text-gray-400 max-w-xs truncate">{r.reason || '—'}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[r.status]}`}>{r.status}</span>
                                    </td>
                                    <td className="px-6 py-4 text-right space-x-2">
                                        {r.status === 'pending' && <>
                                            <button onClick={() => router.post(route('leave-requests.approve', r.id))}
                                                className="px-2 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700">Approve</button>
                                            <button onClick={() => setRejecting(r)}
                                                className="px-2 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600">Reject</button>
                                        </>}
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
