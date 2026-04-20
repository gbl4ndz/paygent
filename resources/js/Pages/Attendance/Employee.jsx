import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { useState } from 'react';

const fmtDate = d => d ? new Date(d).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' }) : '—';

const statusColors = {
    present:   'bg-green-100 text-green-700',
    late:      'bg-yellow-100 text-yellow-700',
    absent:    'bg-red-100 text-red-700',
    'half-day':'bg-blue-100 text-blue-700',
    'on-leave':'bg-purple-100 text-purple-700',
};

const approvalColors = {
    draft:            'bg-gray-100 text-gray-500',
    submitted:        'bg-yellow-100 text-yellow-700',
    manager_approved: 'bg-blue-100 text-blue-700',
    approved:         'bg-green-100 text-green-700',
    rejected:         'bg-red-100 text-red-700',
};

function EditModal({ record, backRoute, onClose }) {
    const { data, setData, put, processing, errors } = useForm({
        status: record.status,
        notes:  record.notes ?? '',
        logs:   record.time_logs?.length
            ? record.time_logs.map(l => ({ clock_in: l.clock_in ?? '', clock_out: l.clock_out ?? '' }))
            : [{ clock_in: '', clock_out: '' }],
    });

    const addLog    = () => setData('logs', [...data.logs, { clock_in: '', clock_out: '' }]);
    const removeLog = i  => setData('logs', data.logs.filter((_, idx) => idx !== i));
    const setLog    = (i, field, val) => {
        const logs = data.logs.map((l, idx) => idx === i ? { ...l, [field]: val } : l);
        setData('logs', logs);
    };

    const submit = () => put(route(backRoute + '.logs.update', record.id), { onSuccess: onClose });

    const totalMin = (() => {
        if (!data.logs.length) return 0;
        const first = data.logs[0]?.clock_in;
        const last  = data.logs[data.logs.length - 1]?.clock_out;
        if (!first || !last) return 0;
        const [ih, im] = first.split(':').map(Number);
        const [oh, om] = last.split(':').map(Number);
        return Math.max(0, (oh * 60 + om) - (ih * 60 + im));
    })();

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
                <div className="px-6 pt-6 pb-4 border-b border-gray-100">
                    <h3 className="text-base font-semibold text-gray-800">Edit Attendance</h3>
                    <p className="text-sm text-gray-400 mt-0.5">{fmtDate(record.date)}</p>
                </div>

                <div className="px-6 py-4 space-y-4 max-h-[65vh] overflow-y-auto">
                    {/* Status */}
                    <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Status</label>
                        <select value={data.status} onChange={e => setData('status', e.target.value)}
                            className="w-full border-gray-300 rounded-lg text-sm focus:ring-brand-green focus:border-brand-green">
                            <option value="present">Present</option>
                            <option value="late">Late</option>
                            <option value="absent">Absent</option>
                            <option value="half-day">Half-day</option>
                            <option value="on-leave">On Leave</option>
                        </select>
                    </div>

                    {/* Time logs */}
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <label className="text-xs font-medium text-gray-500">Time Logs</label>
                            {totalMin > 0 && (
                                <span className="text-xs text-gray-400">
                                    {Math.floor(totalMin / 60)}h {totalMin % 60}m total
                                </span>
                            )}
                        </div>
                        <div className="space-y-2">
                            {data.logs.map((log, i) => (
                                <div key={i} className="flex items-center gap-2">
                                    <input type="time" value={log.clock_in}
                                        onChange={e => setLog(i, 'clock_in', e.target.value)}
                                        className="flex-1 border-gray-300 rounded-lg text-sm focus:ring-brand-green focus:border-brand-green" />
                                    <span className="text-gray-400 text-xs">→</span>
                                    <input type="time" value={log.clock_out}
                                        onChange={e => setLog(i, 'clock_out', e.target.value)}
                                        className="flex-1 border-gray-300 rounded-lg text-sm focus:ring-brand-green focus:border-brand-green" />
                                    {data.logs.length > 1 && (
                                        <button onClick={() => removeLog(i)}
                                            className="p-1 text-red-400 hover:text-red-600 rounded">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                                            </svg>
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                        {(errors['logs.0.clock_in'] || errors['logs']) && (
                            <p className="mt-1 text-xs text-red-500">{errors['logs.0.clock_in'] || errors['logs']}</p>
                        )}
                        <button onClick={addLog}
                            className="mt-2 text-xs text-brand-green hover:underline font-medium">
                            + Add log entry
                        </button>
                    </div>

                    {/* Notes */}
                    <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Notes</label>
                        <textarea rows={2} value={data.notes} onChange={e => setData('notes', e.target.value)}
                            className="w-full border-gray-300 rounded-lg text-sm focus:ring-brand-green focus:border-brand-green"
                            placeholder="Optional notes…" />
                    </div>
                </div>

                <div className="px-6 pb-6 flex justify-between items-center">
                    <button onClick={onClose} className="text-sm text-gray-400 hover:text-gray-600">Cancel</button>
                    <button onClick={submit} disabled={processing}
                        className="px-4 py-2 bg-brand-navy text-white text-sm font-medium rounded-lg hover:bg-brand-navy/90 disabled:opacity-50">
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function EmployeeSummary({ employee, records }) {
    const [editing, setEditing] = useState(null);

    const stats = records.data.reduce((acc, r) => {
        acc[r.status] = (acc[r.status] || 0) + 1;
        return acc;
    }, {});

    return (
        <AuthenticatedLayout header={
            <div className="flex items-center gap-3">
                <Link href={route('attendance.index')} className="text-gray-400 hover:text-gray-600">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
                    </svg>
                </Link>
                <div>
                    <h2 className="text-xl font-semibold text-gray-800">
                        {employee.first_name} {employee.last_name}
                    </h2>
                    <p className="text-sm text-gray-400">{employee.employee_number} · {employee.position}</p>
                </div>
            </div>
        }>
            <Head title={`Attendance — ${employee.first_name} ${employee.last_name}`} />

            {editing && (
                <EditModal
                    record={editing}
                    backRoute="attendance"
                    onClose={() => setEditing(null)}
                />
            )}

            {/* Stats strip */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
                {[
                    { label: 'Total',    value: records.total,           color: 'text-brand-navy' },
                    { label: 'Present',  value: stats.present  || 0,     color: 'text-green-600' },
                    { label: 'Late',     value: stats.late     || 0,     color: 'text-yellow-600' },
                    { label: 'Absent',   value: stats.absent   || 0,     color: 'text-red-500' },
                    { label: 'On Leave', value: stats['on-leave'] || 0,  color: 'text-purple-600' },
                ].map(s => (
                    <div key={s.label} className="bg-white rounded-xl border border-gray-100 shadow-sm px-4 py-3 text-center">
                        <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{s.label}</p>
                    </div>
                ))}
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <table className="w-full divide-y divide-gray-100">
                    <thead className="bg-gray-50">
                        <tr>
                            {['Date', 'Day', 'Status', 'Approval', 'Time Logs', 'Hours', 'Notes', ''].map(h => (
                                <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {records.data.length === 0 && (
                            <tr><td colSpan={8} className="px-6 py-10 text-center text-gray-400 text-sm">No attendance records.</td></tr>
                        )}
                        {records.data.map(r => {
                            const logs = r.time_logs ?? [];
                            const first = logs[0]?.clock_in;
                            const last  = logs[logs.length - 1]?.clock_out;
                            const mins  = (first && last)
                                ? (() => { const [ih,im]=first.split(':').map(Number); const [oh,om]=last.split(':').map(Number); return Math.max(0,(oh*60+om)-(ih*60+im)); })()
                                : 0;

                            return (
                                <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-4 py-3 text-sm font-medium text-gray-800 whitespace-nowrap">{fmtDate(r.date)}</td>
                                    <td className="px-4 py-3 text-xs text-gray-400 whitespace-nowrap">
                                        {r.date ? new Date(r.date).toLocaleDateString('en-PH', { weekday: 'short' }) : '—'}
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[r.status] ?? 'bg-gray-100 text-gray-600'}`}>
                                            {r.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${approvalColors[r.approval_status] ?? 'bg-gray-100 text-gray-500'}`}>
                                            {(r.approval_status ?? 'draft').replace('_', ' ')}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        {logs.length > 0 ? (
                                            <div className="space-y-0.5">
                                                {logs.map((l, i) => (
                                                    <div key={i} className="text-xs text-gray-600 whitespace-nowrap">
                                                        {l.clock_in} → {l.clock_out || <span className="text-gray-400">—</span>}
                                                    </div>
                                                ))}
                                            </div>
                                        ) : <span className="text-xs text-gray-400">—</span>}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">
                                        {mins > 0 ? `${Math.floor(mins/60)}h ${mins%60}m` : '—'}
                                    </td>
                                    <td className="px-4 py-3 text-xs text-gray-400 max-w-[150px] truncate">
                                        {r.notes || '—'}
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <button onClick={() => setEditing(r)}
                                            className="text-xs text-indigo-600 hover:text-indigo-800 font-medium">
                                            Edit
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>

                {records.last_page > 1 && (
                    <div className="px-4 py-3 border-t border-gray-100 flex justify-center gap-2">
                        {records.links.map((link, i) => (
                            <button key={i} onClick={() => link.url && router.get(link.url)}
                                disabled={!link.url}
                                className={`px-3 py-1 text-sm rounded ${link.active ? 'bg-brand-navy text-white' : 'bg-white text-gray-600 border hover:bg-gray-50'} disabled:opacity-40`}
                                dangerouslySetInnerHTML={{ __html: link.label }} />
                        ))}
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
