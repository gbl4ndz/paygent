import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { useState } from 'react';

const fmtDate = d => d ? new Date(d).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' }) : '—';
const fmtDateTime = d => d ? new Date(d).toLocaleString('en-PH', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' }) : '—';

const statusColors = {
    present: 'bg-green-100 text-green-700',
    absent: 'bg-red-100 text-red-700',
    late: 'bg-yellow-100 text-yellow-700',
    'half-day': 'bg-blue-100 text-blue-700',
    'on-leave': 'bg-purple-100 text-purple-700',
};

const approvalColors = {
    draft:    'bg-gray-100 text-gray-600',
    pending:  'bg-yellow-100 text-yellow-700',
    approved: 'bg-green-100 text-green-700',
    rejected: 'bg-red-100 text-red-700',
};

function RejectModal({ record, onClose }) {
    const { data, setData, post, processing } = useForm({ notes: '' });
    const submit = () => post(route('attendance.reject', record.id), { onSuccess: onClose });

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm">
                <div className="px-6 pt-6 pb-4 border-b border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-800">Reject Submission</h3>
                    <p className="text-sm text-gray-500 mt-1">
                        {record.employee?.first_name} {record.employee?.last_name} — {fmtDate(record.date)}
                    </p>
                </div>
                <div className="px-6 py-4">
                    <label className="block text-xs font-medium text-gray-500 mb-1">Reason (optional)</label>
                    <textarea rows={3} value={data.notes} onChange={e => setData('notes', e.target.value)}
                        className="w-full border-gray-300 rounded-lg text-sm focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Explain why this submission is rejected…" />
                </div>
                <div className="px-6 pb-6 flex justify-between">
                    <button onClick={onClose} className="text-sm text-gray-400 hover:text-gray-600">Cancel</button>
                    <button onClick={submit} disabled={processing}
                        className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 disabled:opacity-50">
                        Reject
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function Index({ records, pending, flash }) {
    const [rejectTarget, setRejectTarget] = useState(null);

    const destroy = (id) => {
        if (confirm('Delete this record?')) router.delete(route('attendance.destroy', id));
    };
    const approve = (id) => router.post(route('attendance.approve', id));

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold text-gray-800">Attendance</h2>}>
            <Head title="Attendance" />

            {rejectTarget && <RejectModal record={rejectTarget} onClose={() => setRejectTarget(null)} />}

            <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
                {flash?.success && (
                    <div className="px-4 py-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">{flash.success}</div>
                )}
                {flash?.error && (
                    <div className="px-4 py-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">{flash.error}</div>
                )}

                {/* Pending approvals */}
                {pending?.length > 0 && (
                    <div>
                        <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-yellow-400 inline-block" />
                            Pending Approval
                            <span className="ml-1 px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded-full text-xs">{pending.length}</span>
                        </h3>
                        <div className="bg-white shadow rounded-xl overflow-hidden">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-yellow-50">
                                    <tr>
                                        {['Employee', 'Date', 'Clock In', 'Clock Out', 'Notes', 'Submitted', ''].map(h => (
                                            <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {pending.map(r => (
                                        <tr key={r.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4">
                                                <div className="font-medium text-gray-900">{r.employee?.first_name} {r.employee?.last_name}</div>
                                                <div className="text-xs text-gray-400">{r.employee?.employee_number}</div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-700">{fmtDate(r.date)}</td>
                                            <td className="px-6 py-4 text-sm text-gray-600">{r.clock_in || '—'}</td>
                                            <td className="px-6 py-4 text-sm text-gray-600">{r.clock_out || '—'}</td>
                                            <td className="px-6 py-4 text-sm text-gray-400 max-w-xs truncate">{r.notes || '—'}</td>
                                            <td className="px-6 py-4 text-xs text-gray-400">{fmtDateTime(r.submitted_at)}</td>
                                            <td className="px-6 py-4 text-right space-x-2">
                                                <button onClick={() => approve(r.id)}
                                                    className="px-3 py-1.5 bg-green-600 text-white text-xs font-medium rounded-lg hover:bg-green-700">
                                                    Approve
                                                </button>
                                                <button onClick={() => setRejectTarget(r)}
                                                    className="px-3 py-1.5 bg-red-100 text-red-700 text-xs font-medium rounded-lg hover:bg-red-200">
                                                    Reject
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* All records */}
                <div>
                    <div className="flex justify-between items-center mb-3">
                        <p className="text-sm text-gray-500">{records.total} record{records.total !== 1 ? 's' : ''}</p>
                        <Link href={route('attendance.create')} className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition">
                            + Log Attendance
                        </Link>
                    </div>
                    <div className="bg-white shadow rounded-xl overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    {['Date', 'Employee', 'Clock In', 'Clock Out', 'Status', 'Approval', 'Notes', ''].map(h => (
                                        <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {records.data.length === 0 && (
                                    <tr><td colSpan={8} className="px-6 py-10 text-center text-gray-400 text-sm">No attendance records.</td></tr>
                                )}
                                {records.data.map(r => (
                                    <tr key={r.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 text-sm text-gray-700">{fmtDate(r.date)}</td>
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-gray-900">{r.employee?.first_name} {r.employee?.last_name}</div>
                                            <div className="text-xs text-gray-400">{r.employee?.employee_number}</div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{r.clock_in || '—'}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{r.clock_out || '—'}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[r.status] ?? 'bg-gray-100 text-gray-600'}`}>{r.status}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${approvalColors[r.approval_status] ?? 'bg-gray-100 text-gray-600'}`}>
                                                {r.approval_status ?? 'draft'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-400 max-w-xs truncate">{r.notes || '—'}</td>
                                        <td className="px-6 py-4 text-right space-x-3">
                                            <Link href={route('attendance.edit', r.id)} className="text-indigo-600 hover:text-indigo-800 text-sm">Edit</Link>
                                            <button onClick={() => destroy(r.id)} className="text-red-500 hover:text-red-700 text-sm">Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {records.last_page > 1 && (
                        <div className="mt-4 flex justify-center gap-2">
                            {records.links.map((link, i) => (
                                <button key={i} onClick={() => link.url && router.get(link.url)}
                                    disabled={!link.url}
                                    className={`px-3 py-1 text-sm rounded ${link.active ? 'bg-indigo-600 text-white' : 'bg-white text-gray-600 border hover:bg-gray-50'} disabled:opacity-40`}
                                    dangerouslySetInnerHTML={{ __html: link.label }} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
