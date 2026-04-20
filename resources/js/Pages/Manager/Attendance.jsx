import ManagerLayout from '@/Layouts/ManagerLayout';
import { Head, router, useForm } from '@inertiajs/react';
import { useState } from 'react';

const fmtDate = d => d ? new Date(d).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' }) : '—';
const fmtDateTime = d => d ? new Date(d).toLocaleString('en-PH', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' }) : '—';

function RejectModal({ record, onClose }) {
    const { data, setData, post, processing } = useForm({ notes: '' });
    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm">
                <div className="px-6 pt-6 pb-4 border-b border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-800">Reject Submission</h3>
                    <p className="text-sm text-gray-500 mt-1">{record.employee?.first_name} {record.employee?.last_name} — {fmtDate(record.date)}</p>
                </div>
                <div className="px-6 py-4">
                    <textarea rows={3} value={data.notes} onChange={e => setData('notes', e.target.value)}
                        placeholder="Reason for rejection (optional)"
                        className="w-full border-gray-300 rounded-lg text-sm focus:ring-brand-green focus:border-brand-green" />
                </div>
                <div className="px-6 pb-6 flex justify-between">
                    <button onClick={onClose} className="text-sm text-gray-400 hover:text-gray-600">Cancel</button>
                    <button disabled={processing}
                        onClick={() => post(route('manager.attendance.reject', record.id), { onSuccess: onClose })}
                        className="px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 disabled:opacity-50">
                        Reject
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function Attendance({ pending, recent }) {
    const [rejectTarget, setRejectTarget] = useState(null);
    const approve = id => router.post(route('manager.attendance.approve', id));

    return (
        <ManagerLayout header={<h2 className="text-xl font-semibold text-gray-800">Team Attendance Approvals</h2>}>
            <Head title="Team Attendance" />
            {rejectTarget && <RejectModal record={rejectTarget} onClose={() => setRejectTarget(null)} />}

            <div className="space-y-8">
                {/* Pending */}
                <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-yellow-400 inline-block" />
                        Awaiting Your Approval
                        <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded-full text-xs">{pending.length}</span>
                    </h3>
                    {pending.length === 0 ? (
                        <p className="text-sm text-gray-400 bg-white rounded-xl p-6 text-center shadow">No pending submissions.</p>
                    ) : (
                        <div className="bg-white rounded-xl shadow overflow-hidden">
                            <table className="min-w-full divide-y divide-gray-100">
                                <thead className="bg-yellow-50">
                                    <tr>
                                        {['Employee','Date','Time Entries','Submitted',''].map(h => (
                                            <th key={h} className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase">{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {pending.map(r => (
                                        <tr key={r.id} className="hover:bg-gray-50">
                                            <td className="px-5 py-3">
                                                <div className="font-medium text-sm text-gray-900">{r.employee?.first_name} {r.employee?.last_name}</div>
                                                <div className="text-xs text-gray-400">{r.employee?.employee_number}</div>
                                            </td>
                                            <td className="px-5 py-3 text-sm text-gray-700">{fmtDate(r.date)}</td>
                                            <td className="px-5 py-3">
                                                {r.time_logs?.length > 0 ? r.time_logs.map((l, i) => (
                                                    <div key={i} className="text-xs text-gray-600">{l.clock_in} → {l.clock_out || '—'}</div>
                                                )) : <span className="text-xs text-gray-400">—</span>}
                                            </td>
                                            <td className="px-5 py-3 text-xs text-gray-400">{fmtDateTime(r.submitted_at)}</td>
                                            <td className="px-5 py-3 text-right space-x-2">
                                                <button onClick={() => approve(r.id)}
                                                    className="px-3 py-1.5 bg-brand-green text-white text-xs rounded-lg hover:bg-brand-green-600">
                                                    Approve
                                                </button>
                                                <button onClick={() => setRejectTarget(r)}
                                                    className="px-3 py-1.5 bg-red-100 text-red-700 text-xs rounded-lg hover:bg-red-200">
                                                    Reject
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Recent */}
                {recent.length > 0 && (
                    <div>
                        <h3 className="text-sm font-semibold text-gray-700 mb-3">Recently Reviewed</h3>
                        <div className="bg-white rounded-xl shadow overflow-hidden">
                            <table className="min-w-full divide-y divide-gray-100">
                                <thead className="bg-gray-50">
                                    <tr>
                                        {['Employee','Date','Status','Time Entries'].map(h => (
                                            <th key={h} className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase">{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {recent.map(r => (
                                        <tr key={r.id} className="hover:bg-gray-50">
                                            <td className="px-5 py-3">
                                                <div className="text-sm font-medium text-gray-900">{r.employee?.first_name} {r.employee?.last_name}</div>
                                            </td>
                                            <td className="px-5 py-3 text-sm text-gray-700">{fmtDate(r.date)}</td>
                                            <td className="px-5 py-3">
                                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                                    r.approval_status === 'approved' ? 'bg-green-100 text-green-700' :
                                                    r.approval_status === 'manager_approved' ? 'bg-blue-100 text-blue-700' :
                                                    'bg-red-100 text-red-700'
                                                }`}>{r.approval_status?.replace('_', ' ')}</span>
                                            </td>
                                            <td className="px-5 py-3">
                                                {r.time_logs?.map((l, i) => (
                                                    <div key={i} className="text-xs text-gray-500">{l.clock_in} → {l.clock_out || '—'}</div>
                                                ))}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </ManagerLayout>
    );
}
