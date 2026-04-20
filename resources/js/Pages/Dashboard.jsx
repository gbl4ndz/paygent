import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';

const fmtDate = d => d ? new Date(d).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' }) : '—';

// ── Icons ──────────────────────────────────────────────────────────────────
const UsersIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/>
    </svg>
);
const ClockIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="9"/><path strokeLinecap="round" d="M12 7v5l3 3"/>
    </svg>
);
const CalIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <rect x="3" y="4" width="18" height="18" rx="2"/><path strokeLinecap="round" d="M16 2v4M8 2v4M3 10h18M9 16l2 2 4-4"/>
    </svg>
);
const PayIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <rect x="2" y="7" width="20" height="14" rx="2"/><path strokeLinecap="round" d="M16 3H8a2 2 0 00-2 2v2h12V5a2 2 0 00-2-2zM12 14a2 2 0 100-4 2 2 0 000 4z"/>
    </svg>
);
const ShiftIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" d="M8 7V3m8 4V3M3 10h18M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
    </svg>
);
const LeaveIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
    </svg>
);
const ReportIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
    </svg>
);
const UserMgmtIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14c-5 0-8 2-8 3v1h16v-1c0-1-3-3-8-3z"/>
    </svg>
);
const ChevronRight = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/>
    </svg>
);

function StatCard({ icon, label, value, sub, color, href }) {
    const colors = {
        navy:  { bg: 'bg-brand-navy/10',  icon: 'text-brand-navy',  val: 'text-brand-navy'  },
        green: { bg: 'bg-brand-green/10', icon: 'text-brand-green', val: 'text-brand-green' },
        amber: { bg: 'bg-amber-50',       icon: 'text-amber-500',   val: 'text-amber-600'   },
        rose:  { bg: 'bg-rose-50',        icon: 'text-rose-500',    val: 'text-rose-600'    },
    };
    const c = colors[color] ?? colors.navy;
    const Tag = href ? Link : 'div';
    return (
        <Tag href={href}
            className={`bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-start gap-4 ${href ? 'hover:shadow-md hover:border-brand-green/30 transition-all group cursor-pointer' : ''}`}>
            <span className={`p-3 rounded-xl ${c.bg} ${c.icon} shrink-0`}>{icon}</span>
            <div className="min-w-0">
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider truncate">{label}</p>
                <p className={`text-3xl font-bold mt-0.5 ${c.val}`}>{value}</p>
                {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
            </div>
            {href && <span className="ml-auto text-gray-300 group-hover:text-brand-green transition-colors mt-1 shrink-0"><ChevronRight /></span>}
        </Tag>
    );
}

function QuickAction({ href, icon, label, description }) {
    return (
        <Link href={href}
            className="group flex items-center gap-3 bg-white border border-gray-100 rounded-xl p-4 shadow-sm hover:shadow-md hover:border-brand-green/40 transition-all">
            <span className="p-2.5 bg-brand-navy/5 rounded-lg text-brand-navy group-hover:bg-brand-green/10 group-hover:text-brand-green transition-colors shrink-0">
                {icon}
            </span>
            <div className="min-w-0">
                <p className="text-sm font-semibold text-brand-navy truncate">{label}</p>
                {description && <p className="text-xs text-gray-400 truncate">{description}</p>}
            </div>
            <span className="ml-auto text-gray-300 group-hover:text-brand-green transition-colors shrink-0"><ChevronRight /></span>
        </Link>
    );
}

function StatusBadge({ status }) {
    const map = {
        submitted:        'bg-amber-100 text-amber-700',
        manager_approved: 'bg-blue-100 text-blue-700',
        pending:          'bg-amber-100 text-amber-700',
    };
    const label = { submitted: 'Submitted', manager_approved: 'Mgr Approved', pending: 'Pending' };
    return (
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide ${map[status] ?? 'bg-gray-100 text-gray-600'}`}>
            {label[status] ?? status}
        </span>
    );
}

export default function Dashboard({ stats = {}, recentAttendance = [], recentLeave = [] }) {
    const { auth } = usePage().props;
    const firstName = auth?.user?.name?.split(' ')[0] ?? 'Admin';
    const now = new Date().toLocaleDateString('en-PH', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold text-gray-800">Dashboard</h2>}>
            <Head title="HR Dashboard" />

            {/* Hero */}
            <div className="mb-6 rounded-2xl overflow-hidden shadow-sm"
                style={{ background: 'linear-gradient(120deg, #1B3461 0%, #243E73 60%, #1a5c4a 100%)' }}>
                <div className="px-6 py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                        <h2 className="text-xl font-bold text-white">Good {greeting()}, {firstName} 👋</h2>
                        <p className="text-sm text-white/60 mt-0.5">{now}</p>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                        <Link href={route('employees.create')}
                            className="px-4 py-2 bg-brand-green text-white text-sm font-semibold rounded-lg hover:bg-brand-green-600 transition-colors">
                            + Add Employee
                        </Link>
                        <Link href={route('payroll.index')}
                            className="px-4 py-2 bg-white/10 text-white text-sm font-semibold rounded-lg hover:bg-white/20 transition-colors border border-white/20">
                            Run Payroll
                        </Link>
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <StatCard icon={<UsersIcon />}  label="Total Employees"  value={stats.totalEmployees ?? 0}   sub={`${stats.activeEmployees ?? 0} active`} color="navy" />
                <StatCard icon={<UsersIcon />}  label="Active Employees" value={stats.activeEmployees ?? 0}  color="green" />
                <StatCard icon={<ClockIcon />}  label="Pending Attendance" value={stats.pendingAttendance ?? 0} color="amber" href={route('attendance.index')} />
                <StatCard icon={<CalIcon />}    label="Pending Leave"    value={stats.pendingLeave ?? 0}      color="rose"  href={route('leave-requests.index')} />
            </div>

            {/* Quick Actions */}
            <div className="mb-6">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Quick Actions</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    <QuickAction href={route('employees.index')}       icon={<UsersIcon />}   label="Employees"      description="Manage employee records" />
                    <QuickAction href={route('attendance.index')}      icon={<ClockIcon />}   label="Attendance"     description="Review & approve logs" />
                    <QuickAction href={route('leave-requests.index')}  icon={<LeaveIcon />}   label="Leave Requests" description="Approve leave requests" />
                    <QuickAction href={route('payroll.index')}         icon={<PayIcon />}     label="Payroll"        description="Process payroll runs" />
                    <QuickAction href={route('shift-schedules.index')} icon={<ShiftIcon />}   label="Shift Schedules" description="Manage work shifts" />
                    <QuickAction href={route('leave-types.index')}     icon={<CalIcon />}     label="Leave Types"    description="Configure leave policies" />
                    <QuickAction href={route('reports.index')}         icon={<ReportIcon />}  label="Reports"        description="View payroll reports" />
                    <QuickAction href={route('users.index')}           icon={<UserMgmtIcon />} label="User Accounts" description="Manage system users" />
                </div>
            </div>

            {/* Pending tables */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Pending Attendance */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
                        <h4 className="text-sm font-semibold text-brand-navy">Pending Attendance</h4>
                        <Link href={route('attendance.index')} className="text-xs text-brand-green hover:underline font-medium">View all</Link>
                    </div>
                    {recentAttendance.length === 0 ? (
                        <p className="px-5 py-6 text-sm text-gray-400 text-center">No pending attendance reviews.</p>
                    ) : (
                        <div className="divide-y divide-gray-50">
                            {recentAttendance.map(a => (
                                <div key={a.id} className="flex items-center justify-between px-5 py-3">
                                    <div>
                                        <p className="text-sm font-medium text-gray-800">{a.employee}</p>
                                        <p className="text-xs text-gray-400">{fmtDate(a.date)}</p>
                                    </div>
                                    <StatusBadge status={a.approval_status} />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Pending Leave */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
                        <h4 className="text-sm font-semibold text-brand-navy">Pending Leave Requests</h4>
                        <Link href={route('leave-requests.index')} className="text-xs text-brand-green hover:underline font-medium">View all</Link>
                    </div>
                    {recentLeave.length === 0 ? (
                        <p className="px-5 py-6 text-sm text-gray-400 text-center">No pending leave requests.</p>
                    ) : (
                        <div className="divide-y divide-gray-50">
                            {recentLeave.map(l => (
                                <div key={l.id} className="flex items-center justify-between px-5 py-3">
                                    <div>
                                        <p className="text-sm font-medium text-gray-800">{l.employee}</p>
                                        <p className="text-xs text-gray-400">{l.type} · {fmtDate(l.start_date)} – {fmtDate(l.end_date)}</p>
                                    </div>
                                    <StatusBadge status={l.status} />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

function greeting() {
    const h = new Date().getHours();
    if (h < 12) return 'morning';
    if (h < 18) return 'afternoon';
    return 'evening';
}
