import PortalLayout from '@/Layouts/PortalLayout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';

const fmtDate = d => d ? new Date(d).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' }) : '—';

// ── Icons ──────────────────────────────────────────────────────────────────
const ClockIcon = ({ className = 'w-6 h-6' }) => (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="9"/><path strokeLinecap="round" d="M12 7v5l3 3"/>
    </svg>
);
const CalCheckIcon = ({ className = 'w-6 h-6' }) => (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <rect x="3" y="4" width="18" height="18" rx="2"/><path strokeLinecap="round" d="M16 2v4M8 2v4M3 10h18M9 16l2 2 4-4"/>
    </svg>
);
const LeaveIcon = ({ className = 'w-6 h-6' }) => (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
    </svg>
);
const PayslipIcon = ({ className = 'w-6 h-6' }) => (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" d="M9 12h6m-3-3v6M3 7l1-1h16l1 1v13l-1 1H4l-1-1V7z"/>
        <path strokeLinecap="round" d="M8 3h8v4H8z"/>
    </svg>
);
const FileLeaveIcon = ({ className = 'w-6 h-6' }) => (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" d="M12 4v16m8-8H4"/>
    </svg>
);
const LogInIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"/>
    </svg>
);
const LogOutIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
    </svg>
);

function greeting() {
    const h = new Date().getHours();
    if (h < 12) return 'morning';
    if (h < 18) return 'afternoon';
    return 'evening';
}

const fmtTime = t => {
    if (!t) return null;
    const [h, m] = t.split(':').map(Number);
    return `${h % 12 || 12}:${String(m).padStart(2, '0')} ${h >= 12 ? 'PM' : 'AM'}`;
};

function ClockWidget({ timeLogs }) {
    const lastLog     = timeLogs[timeLogs.length - 1];
    const isClockedIn = lastLog && !lastLog.clock_out;

    const clockIn  = useForm({});
    const clockOut = useForm({});

    const handleClockIn = () => clockIn.post(route('portal.attendance.clock-in'),  { preserveScroll: true });
    const handleClockOut = () => clockOut.post(route('portal.attendance.clock-out'), { preserveScroll: true });

    const { errors } = usePage().props;
    const flash = usePage().props.flash ?? {};

    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {/* Status header */}
            <div className={`px-5 py-3 flex items-center gap-2.5 ${isClockedIn ? 'bg-brand-green/10' : 'bg-gray-50'}`}>
                <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${isClockedIn ? 'bg-brand-green animate-pulse' : timeLogs.length > 0 ? 'bg-gray-400' : 'bg-red-400'}`} />
                <span className="text-sm font-semibold text-gray-700">
                    {isClockedIn
                        ? `Clocked in since ${fmtTime(lastLog.clock_in)}`
                        : timeLogs.length > 0
                            ? `Shift ended · Last out ${fmtTime(timeLogs[timeLogs.length - 1]?.clock_out)}`
                            : 'Not clocked in today'}
                </span>
            </div>

            <div className="px-5 py-4">
                {/* Error / flash */}
                {(errors.clock || flash.success) && (
                    <div className={`mb-3 px-3 py-2 rounded-lg text-sm ${errors.clock ? 'bg-red-50 text-red-600' : 'bg-brand-green/10 text-brand-green'}`}>
                        {errors.clock ?? flash.success}
                    </div>
                )}

                {/* Button */}
                <div className="flex gap-3 mb-4">
                    {!isClockedIn ? (
                        <button onClick={handleClockIn} disabled={clockIn.processing}
                            className="flex-1 flex items-center justify-center gap-2 px-5 py-3 bg-brand-green text-white font-semibold rounded-xl shadow-sm hover:bg-emerald-500 active:scale-95 transition-all disabled:opacity-60">
                            <LogInIcon />
                            {clockIn.processing ? 'Clocking in…' : 'Clock In'}
                        </button>
                    ) : (
                        <button onClick={handleClockOut} disabled={clockOut.processing}
                            className="flex-1 flex items-center justify-center gap-2 px-5 py-3 bg-rose-500 text-white font-semibold rounded-xl shadow-sm hover:bg-rose-600 active:scale-95 transition-all disabled:opacity-60">
                            <LogOutIcon />
                            {clockOut.processing ? 'Clocking out…' : 'Clock Out'}
                        </button>
                    )}
                    <Link href={route('portal.attendance')}
                        className="px-4 py-3 bg-gray-50 text-gray-600 font-medium text-sm rounded-xl hover:bg-gray-100 transition-colors flex items-center gap-1.5">
                        <CalCheckIcon className="w-4 h-4" /> Logs
                    </Link>
                </div>

                {/* Today's punches */}
                {timeLogs.length > 0 && (
                    <div>
                        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Today's Punches</p>
                        <div className="space-y-1.5">
                            {timeLogs.map((log, i) => (
                                <div key={i} className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2 text-xs">
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <span className="w-5 h-5 rounded-full bg-brand-navy/10 text-brand-navy flex items-center justify-center font-bold text-[10px]">
                                            {i + 1}
                                        </span>
                                        <span>In: <span className="font-semibold text-gray-800">{fmtTime(log.clock_in)}</span></span>
                                    </div>
                                    {log.clock_out ? (
                                        <span className="text-gray-500">Out: <span className="font-semibold text-gray-800">{fmtTime(log.clock_out)}</span></span>
                                    ) : (
                                        <span className="text-brand-green font-semibold">Active</span>
                                    )}
                                </div>
                            ))}
                        </div>
                        {timeLogs.length > 0 && timeLogs[timeLogs.length - 1]?.clock_out && (
                            <p className="text-[10px] text-gray-400 mt-2 text-right">
                                Calculated: {fmtTime(timeLogs[0].clock_in)} → {fmtTime(timeLogs[timeLogs.length - 1].clock_out)}
                            </p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

function QuickAction({ href, icon, label, badge }) {
    return (
        <Link href={href}
            className="group relative flex flex-col items-center justify-center gap-2.5 bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-brand-green/40 transition-all text-center">
            {badge > 0 && (
                <span className="absolute top-2.5 right-2.5 min-w-[18px] h-[18px] px-1 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {badge}
                </span>
            )}
            <span className="p-2.5 bg-brand-navy/5 rounded-xl text-brand-navy group-hover:bg-brand-green/10 group-hover:text-brand-green transition-colors">
                {icon}
            </span>
            <span className="text-xs font-semibold text-brand-navy leading-tight">{label}</span>
        </Link>
    );
}

export default function Dashboard({ employee, todayAttendance, leaveBalances, recentPayrolls, pendingLeave }) {
    const now      = new Date().toLocaleDateString('en-PH', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    const timeLogs = todayAttendance?.time_logs ?? [];

    return (
        <PortalLayout>
            <Head title="My Dashboard" />

            {/* Hero */}
            <div className="mb-6 rounded-2xl overflow-hidden shadow-sm"
                style={{ background: 'linear-gradient(120deg, #1B3461 0%, #243E73 55%, #1a5c4a 100%)' }}>
                <div className="px-6 py-6">
                    <h2 className="text-xl font-bold text-white">Good {greeting()}, {employee.first_name}! 👋</h2>
                    <p className="text-sm text-white/60 mt-0.5">{now}</p>
                </div>
            </div>

            {/* Clock widget + Quick Actions side by side on large screens */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-6">
                {/* Clock widget — takes 2 cols */}
                <div className="lg:col-span-2">
                    <ClockWidget timeLogs={timeLogs} />
                </div>

                {/* Quick actions — takes 3 cols */}
                <div className="lg:col-span-3">
                    <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-3">Quick Actions</p>
                    <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-3 gap-3">
                        <QuickAction href={route('portal.attendance')}   icon={<CalCheckIcon />}  label="Attendance" />
                        <QuickAction href={route('portal.leave.create')} icon={<FileLeaveIcon />} label="File Leave" />
                        <QuickAction href={route('portal.leave.index')}  icon={<LeaveIcon />}     label="My Leaves" badge={pendingLeave ?? 0} />
                        <QuickAction href={route('portal.payslips')}     icon={<PayslipIcon />}   label="Payslips" />
                    </div>
                </div>
            </div>

            {/* Leave balances + Recent payslips */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Leave balances */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
                        <h4 className="text-sm font-semibold text-brand-navy">Leave Balances · {new Date().getFullYear()}</h4>
                        <Link href={route('portal.leave.index')} className="text-xs text-brand-green hover:underline font-medium">View all</Link>
                    </div>
                    <div className="p-5">
                        {leaveBalances.length === 0 ? (
                            <p className="text-sm text-gray-400 text-center py-2">No leave balances yet.</p>
                        ) : (
                            <div className="space-y-4">
                                {leaveBalances.map(lb => {
                                    const rem = lb.allocated_days - lb.used_days;
                                    const pct = lb.allocated_days > 0 ? (rem / lb.allocated_days) * 100 : 0;
                                    const color = pct > 50 ? 'bg-brand-green' : pct > 20 ? 'bg-amber-400' : 'bg-rose-400';
                                    return (
                                        <div key={lb.id}>
                                            <div className="flex justify-between text-xs mb-1.5">
                                                <span className="font-medium text-gray-700">{lb.leave_type?.name}</span>
                                                <span className="text-gray-500">{rem} <span className="text-gray-300">/</span> {lb.allocated_days} days</span>
                                            </div>
                                            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                                <div className={`h-1.5 ${color} rounded-full transition-all`} style={{ width: `${Math.max(0, pct)}%` }} />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>

                {/* Recent payslips */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
                        <h4 className="text-sm font-semibold text-brand-navy">Recent Payslips</h4>
                        <Link href={route('portal.payslips')} className="text-xs text-brand-green hover:underline font-medium">View all</Link>
                    </div>
                    <div className="divide-y divide-gray-50">
                        {recentPayrolls.length === 0 ? (
                            <p className="px-5 py-6 text-sm text-gray-400 text-center">No payslips yet.</p>
                        ) : (
                            recentPayrolls.map(p => (
                                <div key={p.id} className="flex items-center justify-between px-5 py-3.5">
                                    <div>
                                        <p className="text-sm font-medium text-gray-800">{fmtDate(p.period_start)} – {fmtDate(p.period_end)}</p>
                                        <p className="text-xs text-gray-400 capitalize mt-0.5">{p.status}</p>
                                    </div>
                                    <p className="text-sm font-bold text-brand-navy">₱{Number(p.net_pay).toLocaleString()}</p>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </PortalLayout>
    );
}
