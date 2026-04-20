import PortalLayout from '@/Layouts/PortalLayout';
import { Head, Link, router } from '@inertiajs/react';

const fmtDate = d => d ? new Date(d).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' }) : '—';

const statusColors = { pending: 'bg-yellow-100 text-yellow-700', approved: 'bg-green-100 text-green-700', rejected: 'bg-red-100 text-red-700', manager_approved: 'bg-blue-100 text-blue-700' };

export default function Index({ requests, balances }) {
    return (
        <PortalLayout header={<h2 className="text-xl font-semibold text-gray-800">My Leave</h2>}>
            <Head title="My Leave" />

            {/* Balances */}
            {balances.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
                    {balances.map(lb => (
                        <div key={lb.id} className="bg-white rounded-xl shadow p-4 text-center">
                            <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">{lb.leave_type?.name}</p>
                            <p className="text-2xl font-bold text-indigo-700">{Number(lb.allocated_days) - Number(lb.used_days)}</p>
                            <p className="text-xs text-gray-400">of {lb.allocated_days} days remaining</p>
                        </div>
                    ))}
                </div>
            )}

            <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-medium text-gray-600">My Requests</h3>
                <Link href={route('portal.leave.create')} className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition">+ Apply for Leave</Link>
            </div>

            <div className="bg-white rounded-xl shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>{['Type', 'Period', 'Days', 'Reason', 'Status', ''].map(h => (
                            <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{h}</th>
                        ))}</tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {requests.data.length === 0 && <tr><td colSpan={6} className="px-6 py-10 text-center text-gray-400 text-sm">No leave requests yet.</td></tr>}
                        {requests.data.map(r => (
                            <tr key={r.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 text-sm font-medium text-gray-800">{r.leave_type?.name}</td>
                                <td className="px-6 py-4 text-sm text-gray-600">{fmtDate(r.start_date)} – {fmtDate(r.end_date)}</td>
                                <td className="px-6 py-4 text-sm text-gray-700">{r.total_days}d</td>
                                <td className="px-6 py-4 text-sm text-gray-400 max-w-xs truncate">{r.reason || '—'}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[r.status]}`}>{r.status}</span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    {r.status === 'pending' && (
                                        <button onClick={() => { if (confirm('Cancel this request?')) router.delete(route('portal.leave.destroy', r.id)); }}
                                            className="text-red-500 hover:text-red-700 text-xs">Cancel</button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </PortalLayout>
    );
}
