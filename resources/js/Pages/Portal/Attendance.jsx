import PortalLayout from '@/Layouts/PortalLayout';
import { Head, router, useForm } from '@inertiajs/react';
import { useMemo, useState } from 'react';

// ── Status badge ─────────────────────────────────────────────────────────────
const STATUS_CFG = {
    draft:            { label: 'Draft',        cls: 'bg-gray-100 text-gray-500' },
    submitted:        { label: 'Pending',      cls: 'bg-amber-100 text-amber-700' },
    manager_approved: { label: 'Mgr Approved', cls: 'bg-blue-100 text-blue-700' },
    approved:         { label: 'Approved',     cls: 'bg-emerald-500 text-white' },
    rejected:         { label: 'Rejected',     cls: 'bg-red-500 text-white' },
};

function StatusBadge({ status }) {
    const cfg = STATUS_CFG[status] ?? STATUS_CFG.draft;
    return (
        <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold whitespace-nowrap ${cfg.cls}`}>
            {cfg.label}
        </span>
    );
}

// ── Edit modal ───────────────────────────────────────────────────────────────
function EditModal({ record, onClose, onSaved }) {
    const [logs, setLogs] = useState(
        record.time_logs?.length
            ? record.time_logs.map(l => ({ ...l }))
            : [{ clock_in: '', clock_out: '', notes: '' }]
    );
    const [saving, setSaving] = useState(false);

    const update = (i, field, val) =>
        setLogs(prev => prev.map((l, idx) => idx === i ? { ...l, [field]: val } : l));
    const remove = i => setLogs(prev => prev.filter((_, idx) => idx !== i));
    const add    = () => setLogs(prev => [...prev, { clock_in: '', clock_out: '', notes: '' }]);

    const save = () => {
        setSaving(true);
        router.post(route('portal.attendance.save'),
            { date: record.raw_date, time_logs: logs, notes: '' },
            { preserveScroll: true, onSuccess: () => { setSaving(false); onSaved(); onClose(); }, onError: () => setSaving(false) }
        );
    };

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
                <div className="px-6 pt-5 pb-4 border-b border-gray-100 flex justify-between items-start">
                    <div>
                        <h3 className="font-semibold text-gray-800">Edit Time Log</h3>
                        <p className="text-sm text-gray-400 mt-0.5">{record.date_label} · {record.day_name}</p>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">×</button>
                </div>

                <div className="px-6 py-4 space-y-3 max-h-64 overflow-y-auto">
                    {logs.map((log, i) => (
                        <div key={i} className="grid grid-cols-[auto_1fr_1fr_auto] gap-2 items-center">
                            <span className="text-xs text-gray-400 w-5 text-center">{i + 1}</span>
                            <div>
                                <label className="block text-[10px] text-gray-400 mb-0.5">Clock In</label>
                                <input type="time" value={log.clock_in}
                                    onChange={e => update(i, 'clock_in', e.target.value)}
                                    className="w-full border-gray-300 rounded-lg text-sm focus:ring-brand-green focus:border-brand-green" />
                            </div>
                            <div>
                                <label className="block text-[10px] text-gray-400 mb-0.5">Clock Out</label>
                                <input type="time" value={log.clock_out || ''}
                                    onChange={e => update(i, 'clock_out', e.target.value)}
                                    className="w-full border-gray-300 rounded-lg text-sm focus:ring-brand-green focus:border-brand-green" />
                            </div>
                            <button onClick={() => remove(i)} className="text-red-400 hover:text-red-600 mt-4 text-sm">✕</button>
                        </div>
                    ))}
                    <button onClick={add}
                        className="text-xs text-brand-green hover:underline flex items-center gap-1 mt-1">
                        + Add entry
                    </button>
                </div>

                {(record.rejection_notes || record.manager_rejection_notes) && (
                    <div className="mx-6 mb-3 px-3 py-2 bg-red-50 border border-red-200 rounded-lg text-xs text-red-600">
                        {record.rejection_notes || record.manager_rejection_notes}
                    </div>
                )}

                <div className="px-6 pb-5 flex justify-between items-center border-t border-gray-100 pt-4">
                    <button onClick={onClose} className="text-sm text-gray-400 hover:text-gray-600">Cancel</button>
                    <button onClick={save} disabled={saving}
                        className="px-4 py-2 bg-brand-navy text-white text-sm rounded-lg hover:bg-brand-navy-700 disabled:opacity-50">
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
}

// ── Th with sort ─────────────────────────────────────────────────────────────
function Th({ label, sub, field, sort, onSort, className = '' }) {
    const active = sort?.field === field;
    return (
        <th className={`px-2 py-2 text-center text-[11px] font-semibold text-white whitespace-nowrap select-none cursor-pointer leading-tight ${className}`}
            onClick={() => onSort(field)}>
            <span className="block">{label}</span>
            {sub && <span className="block text-white/60 font-normal text-[9px]">{sub}</span>}
            <span className="ml-0.5 opacity-50 text-[9px]">{active ? (sort.dir === 'asc' ? '▲' : '▼') : '⇅'}</span>
        </th>
    );
}

// ── Numeric cell — shows — for zero ──────────────────────────────────────────
function Num({ val, decimals = 2, highlight = false }) {
    const n = Number(val ?? 0);
    if (n === 0) return <span className="text-gray-300">—</span>;
    return <span className={highlight ? 'text-brand-green font-semibold' : 'text-gray-700'}>{n.toFixed(decimals)}</span>;
}

// ── Main page ────────────────────────────────────────────────────────────────
export default function Attendance({ records: initialRecords, from, to, withinReview, reviewDeadline, today, periods, hasManager }) {
    const [records, setRecords]       = useState(initialRecords);
    const [fromDate, setFromDate]     = useState(from);
    const [toDate, setToDate]         = useState(to);
    const [search, setSearch]         = useState('');
    const [pageSize, setPageSize]     = useState(25);
    const [page, setPage]             = useState(1);
    const [sort, setSort]             = useState({ field: 'raw_date', dir: 'desc' });
    const [editing, setEditing]       = useState(null);
    const [submitting, setSubmitting] = useState(false);

    const navigate = () => {
        router.get(route('portal.attendance'), { from: fromDate, to: toDate }, {
            preserveState: false,
            onSuccess: () => setPage(1),
        });
    };

    const handleSort = field => setSort(s => ({ field, dir: s.field === field && s.dir === 'asc' ? 'desc' : 'asc' }));

    const filtered = useMemo(() => {
        let rows = [...records];
        if (search) {
            const q = search.toLowerCase();
            rows = rows.filter(r =>
                r.date_label.toLowerCase().includes(q) ||
                r.day_status.toLowerCase().includes(q) ||
                r.shift_label.toLowerCase().includes(q) ||
                r.approval_status.toLowerCase().includes(q)
            );
        }
        rows.sort((a, b) => {
            const av = a[sort.field] ?? '';
            const bv = b[sort.field] ?? '';
            const cmp = String(av).localeCompare(String(bv), undefined, { numeric: true });
            return sort.dir === 'asc' ? cmp : -cmp;
        });
        return rows;
    }, [records, search, sort]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
    const paginated  = filtered.slice((page - 1) * pageSize, page * pageSize);

    const draftRows = records.filter(r =>
        ['draft', 'rejected'].includes(r.approval_status) && r.time_logs?.length > 0
    );

    const submitAll = () => {
        if (!draftRows.length) return;
        if (!confirm(`Submit ${draftRows.length} day(s) for approval?`)) return;
        setSubmitting(true);
        router.post(route('portal.attendance.submit'), { dates: draftRows.map(r => r.raw_date) }, {
            preserveScroll: true,
            onFinish: () => setSubmitting(false),
        });
    };

    return (
        <PortalLayout header={<h2 className="text-xl font-semibold text-gray-800">My Attendance</h2>}>
            <Head title="My Attendance" />

            {editing && (
                <EditModal
                    record={editing}
                    onClose={() => setEditing(null)}
                    onSaved={() => router.reload({ only: ['records'] })}
                />
            )}

            <div className="bg-white rounded-2xl shadow overflow-hidden">
                {/* ── Top controls ── */}
                <div className="px-5 py-4 border-b border-gray-100 space-y-3">
                    <div className="flex flex-wrap items-end gap-3">
                        <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">From</label>
                            <input type="date" value={fromDate} onChange={e => setFromDate(e.target.value)}
                                className="border-gray-300 rounded-lg text-sm focus:ring-brand-green focus:border-brand-green" />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">To</label>
                            <input type="date" value={toDate} onChange={e => setToDate(e.target.value)}
                                className="border-gray-300 rounded-lg text-sm focus:ring-brand-green focus:border-brand-green" />
                        </div>
                        <button onClick={navigate}
                            className="px-4 py-2 bg-brand-green text-white text-sm rounded-lg hover:bg-brand-green-600 transition">
                            Search
                        </button>
                        <select onChange={e => {
                            if (!e.target.value) return;
                            const [f, t] = e.target.value.split('|');
                            setFromDate(f); setToDate(t);
                        }} className="border-gray-300 rounded-lg text-sm text-gray-500 focus:ring-brand-green focus:border-brand-green">
                            <option value="">— Quick select period —</option>
                            {periods.map(p => (
                                <option key={p.from} value={`${p.from}|${p.to}`}>{p.label}</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                Show
                                <select value={pageSize} onChange={e => { setPageSize(+e.target.value); setPage(1); }}
                                    className="border-gray-300 rounded text-sm focus:ring-brand-green focus:border-brand-green">
                                    {[10, 25, 50, 100].map(n => <option key={n}>{n}</option>)}
                                </select>
                                entries
                            </div>
                            {withinReview && draftRows.length > 0 && (
                                <button onClick={submitAll} disabled={submitting}
                                    className="px-4 py-1.5 bg-brand-navy text-white text-sm rounded-lg hover:bg-brand-navy-700 disabled:opacity-50">
                                    Submit {draftRows.length} for Approval
                                </button>
                            )}
                            {!withinReview && (
                                <span className="text-xs text-gray-400 italic">Review closed · deadline was {reviewDeadline}</span>
                            )}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                            Search:
                            <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
                                className="border-gray-300 rounded text-sm focus:ring-brand-green focus:border-brand-green w-36" />
                        </div>
                    </div>
                </div>

                {/* ── Table ── */}
                <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                        <thead>
                            <tr className="bg-brand-navy">
                                <Th label="Date"      field="raw_date"        sort={sort} onSort={handleSort} className="text-left pl-4 w-28" />
                                <Th label="Status"    field="day_status"      sort={sort} onSort={handleSort} className="w-20" />
                                <Th label="Shift"     field="shift_name"      sort={sort} onSort={handleSort} className="w-24" />
                                <Th label="Time In"   field="time_in"         sort={sort} onSort={handleSort} className="w-20" />
                                <Th label="Time Out"  field="time_out"        sort={sort} onSort={handleSort} className="w-20" />
                                <Th label="Hours"     field="hours_worked"    sort={sort} onSort={handleSort} className="w-14" />
                                <Th label="Late"      sub="hrs"  field="late"         sort={sort} onSort={handleSort} className="w-12" />
                                <Th label="UT"        sub="hrs"  field="undertime"    sort={sort} onSort={handleSort} className="w-12" />
                                <Th label="OT"        sub="logged" field="ot_logged"  sort={sort} onSort={handleSort} className="w-12" />
                                <Th label="OT"        sub="apprvd" field="ot_approved" sort={sort} onSort={handleSort} className="w-12" />
                                <Th label="ND"        field="nd"              sort={sort} onSort={handleSort} className="w-10" />
                                <Th label="ND OT"     field="nd_ot"           sort={sort} onSort={handleSort} className="w-12" />
                                <Th label="Approval"  field="approval_status" sort={sort} onSort={handleSort} className="w-24" />
                                <th className="px-2 py-2 text-center text-[11px] font-semibold text-white bg-brand-navy w-16">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {paginated.length === 0 && (
                                <tr>
                                    <td colSpan={14} className="px-4 py-10 text-center text-gray-400 text-sm">
                                        No attendance records found.
                                    </td>
                                </tr>
                            )}
                            {paginated.map(r => {
                                const locked  = ['submitted', 'manager_approved', 'approved'].includes(r.approval_status);
                                const canEdit = withinReview && !locked;
                                const isRest  = r.day_status === 'Rest Day';
                                return (
                                    <tr key={r.id ?? r.raw_date}
                                        className={`hover:bg-gray-50 transition-colors ${isRest ? 'bg-gray-50/60' : ''}`}>
                                        {/* Date */}
                                        <td className="pl-4 pr-2 py-2 whitespace-nowrap">
                                            <span className="font-semibold text-brand-navy">{r.date_label}</span>
                                            <span className="text-gray-400 ml-1">{r.day_name}</span>
                                        </td>
                                        {/* Day status */}
                                        <td className="px-2 py-2 text-center whitespace-nowrap">
                                            <span className={`text-[10px] font-medium ${isRest ? 'text-gray-400' : 'text-emerald-600'}`}>
                                                {isRest ? 'Rest' : 'Work'}
                                            </span>
                                        </td>
                                        {/* Shift */}
                                        <td className="px-2 py-2 text-center text-gray-500 whitespace-nowrap">
                                            {r.shift_name ?? '—'}
                                        </td>
                                        {/* Time In / Out */}
                                        <td className="px-2 py-2 text-center text-gray-700 whitespace-nowrap">{r.time_in}</td>
                                        <td className="px-2 py-2 text-center text-gray-700 whitespace-nowrap">{r.time_out}</td>
                                        {/* Numeric DTR */}
                                        <td className="px-2 py-2 text-center font-medium text-gray-800">
                                            {Number(r.hours_worked) > 0 ? Number(r.hours_worked).toFixed(2) : <span className="text-gray-300">—</span>}
                                        </td>
                                        <td className="px-2 py-2 text-center"><Num val={r.late} /></td>
                                        <td className="px-2 py-2 text-center"><Num val={r.undertime} /></td>
                                        <td className="px-2 py-2 text-center"><Num val={r.ot_logged} /></td>
                                        <td className="px-2 py-2 text-center"><Num val={r.ot_approved} highlight /></td>
                                        <td className="px-2 py-2 text-center"><Num val={r.nd} decimals={0} /></td>
                                        <td className="px-2 py-2 text-center"><Num val={r.nd_ot} /></td>
                                        {/* Status */}
                                        <td className="px-2 py-2 text-center">
                                            <StatusBadge status={r.approval_status} />
                                        </td>
                                        {/* Action */}
                                        <td className="px-2 py-2 text-center">
                                            {canEdit ? (
                                                <button onClick={() => setEditing(r)}
                                                    className="px-2.5 py-1 bg-brand-navy text-white text-[10px] rounded hover:bg-brand-navy-700 transition font-medium">
                                                    Edit
                                                </button>
                                            ) : r.approval_status === 'rejected' ? (
                                                <button onClick={() => setEditing(r)}
                                                    className="px-2.5 py-1 bg-rose-500 text-white text-[10px] rounded hover:bg-rose-600 transition font-medium">
                                                    Fix
                                                </button>
                                            ) : (
                                                <span className="text-gray-200">—</span>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* ── Footer / pagination ── */}
                <div className="px-5 py-3 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3 text-sm text-gray-500">
                    <span className="text-xs">
                        Showing {filtered.length === 0 ? 0 : (page - 1) * pageSize + 1}–{Math.min(page * pageSize, filtered.length)} of {filtered.length}
                    </span>
                    <div className="flex items-center gap-1">
                        <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                            className="px-3 py-1 border border-gray-200 rounded text-xs hover:bg-gray-50 disabled:opacity-40">
                            ‹ Prev
                        </button>
                        {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                            const p = i + 1;
                            return (
                                <button key={p} onClick={() => setPage(p)}
                                    className={`px-2.5 py-1 border rounded text-xs ${p === page ? 'bg-brand-navy text-white border-brand-navy' : 'border-gray-200 hover:bg-gray-50'}`}>
                                    {p}
                                </button>
                            );
                        })}
                        <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                            className="px-3 py-1 border border-gray-200 rounded text-xs hover:bg-gray-50 disabled:opacity-40">
                            Next ›
                        </button>
                    </div>
                </div>
            </div>
        </PortalLayout>
    );
}
