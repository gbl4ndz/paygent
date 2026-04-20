import ManagerLayout from '@/Layouts/ManagerLayout';

const fmtDate = d => d ? new Date(d).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' }) : '—';
import { Head, Link, usePage } from '@inertiajs/react';

// ── Icons ──────────────────────────────────────────────────────────────────
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
const UsersIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/>
    </svg>
);
const ChevronRight = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/>
    </svg>
);
const PersonIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14c-5 0-8 2-8 3v1h16v-1c0-1-3-3-8-3z"/>
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
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">{label}</p>
                <p className={`text-3xl font-bold mt-0.5 ${c.val}`}>{value}</p>
                {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
            </div>
            {href && <span className="ml-auto text-gray-300 group-hover:text-brand-green transition-colors mt-1 shrink-0"><ChevronRight /></span>}
        </Tag>
    );
}

function greeting() {
    const h = new Date().getHours();
    if (h < 12) return 'morning';
    if (h < 18) return 'afternoon';
    return 'evening';
}

export default function Dashboard({ pendingAttendance, pendingLeave, teamCount, team = [], recentAttendance = [], recentLeave = [] }) {
    const { auth } = usePage().props;
    const firstName = auth?.user?.employee?.first_name ?? auth?.user?.name?.split(' ')[0] ?? 'Manager';
    const now = new Date().toLocaleDateString('en-PH', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    return (
        <ManagerLayout header={<h2 className="text-xl font-semibold text-gray-800">Manager Dashboard</h2>}>
            <Head title="Manager Dashboard" />

            {/* Hero */}
            <div className="mb-6 rounded-2xl overflow-hidden shadow-sm"
                style={{ background: 'linear-gradient(120deg, #1B3461 0%, #243E73 60%, #1a5c4a 100%)' }}>
                <div className="px-6 py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                        <h2 className="text-xl font-bold text-white">Good {greeting()}, {firstName} 👋</h2>
                        <p className="text-sm text-white/60 mt-0.5">{now}</p>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                        <Link href={route('manager.attendance')}
                            className="px-4 py-2 bg-brand-green text-white text-sm font-semibold rounded-lg hover:bg-brand-green-600 transition-colors">
                            Review Attendance
                        </Link>
                        <Link href={route('manager.leave.index')}
                            className="px-4 py-2 bg-white/10 text-white text-sm font-semibold rounded-lg hover:bg-white/20 transition-colors border border-white/20">
                            Review Leave
                        </Link>
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <StatCard icon={<UsersIcon />} label="Team Members"       value={teamCount ?? 0}         color="navy"  />
                <StatCard icon={<ClockIcon />} label="Pending Attendance" value={pendingAttendance ?? 0} color="amber" href={route('manager.attendance')} />
                <StatCard icon={<CalIcon />}   label="Pending Leave"      value={pendingLeave ?? 0}      color="rose"  href={route('manager.leave.index')} />
            </div>

            {/* Pending reviews + Team */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
                {/* Pending Attendance */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
                        <h4 className="text-sm font-semibold text-brand-navy">Pending Attendance</h4>
                        <Link href={route('manager.attendance')} className="text-xs text-brand-green hover:underline font-medium">View all</Link>
                    </div>
                    {recentAttendance.length === 0 ? (
                        <p className="px-5 py-6 text-sm text-gray-400 text-center">No pending reviews.</p>
                    ) : (
                        <div className="divide-y divide-gray-50">
                            {recentAttendance.map(a => (
                                <Link key={a.id} href={route('manager.attendance')}
                                    className="flex items-center justify-between px-5 py-3 hover:bg-gray-50 transition-colors">
                                    <div>
                                        <p className="text-sm font-medium text-gray-800">{a.employee}</p>
                                        <p className="text-xs text-gray-400">{fmtDate(a.date)}</p>
                                    </div>
                                    <ChevronRight />
                                </Link>
                            ))}
                        </div>
                    )}
                </div>

                {/* Pending Leave */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
                        <h4 className="text-sm font-semibold text-brand-navy">Pending Leave</h4>
                        <Link href={route('manager.leave.index')} className="text-xs text-brand-green hover:underline font-medium">View all</Link>
                    </div>
                    {recentLeave.length === 0 ? (
                        <p className="px-5 py-6 text-sm text-gray-400 text-center">No pending leave requests.</p>
                    ) : (
                        <div className="divide-y divide-gray-50">
                            {recentLeave.map(l => (
                                <Link key={l.id} href={route('manager.leave.index')}
                                    className="flex items-center justify-between px-5 py-3 hover:bg-gray-50 transition-colors">
                                    <div>
                                        <p className="text-sm font-medium text-gray-800">{l.employee}</p>
                                        <p className="text-xs text-gray-400">{l.type} · {l.dates}</p>
                                    </div>
                                    <ChevronRight />
                                </Link>
                            ))}
                        </div>
                    )}
                </div>

                {/* Team Members */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="px-5 py-4 border-b border-gray-50">
                        <h4 className="text-sm font-semibold text-brand-navy">My Team</h4>
                    </div>
                    {team.length === 0 ? (
                        <p className="px-5 py-6 text-sm text-gray-400 text-center">No team members assigned.</p>
                    ) : (
                        <div className="divide-y divide-gray-50">
                            {team.map(m => (
                                <div key={m.id} className="flex items-center gap-3 px-5 py-3">
                                    <span className="w-8 h-8 rounded-full bg-brand-navy/10 text-brand-navy flex items-center justify-center text-xs font-bold shrink-0">
                                        {m.name.split(' ').map(w => w[0]).slice(0, 2).join('')}
                                    </span>
                                    <div className="min-w-0">
                                        <p className="text-sm font-medium text-gray-800 truncate">{m.name}</p>
                                        <p className="text-xs text-gray-400 truncate">{m.position} · {m.shift}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </ManagerLayout>
    );
}
