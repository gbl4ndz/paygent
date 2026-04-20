import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

const StatCard = ({ label, value, sub, color = 'indigo' }) => {
    const colors = {
        indigo: 'bg-indigo-50 text-indigo-700',
        green: 'bg-green-50 text-green-700',
        yellow: 'bg-yellow-50 text-yellow-700',
        red: 'bg-red-50 text-red-700',
        blue: 'bg-blue-50 text-blue-700',
    };
    return (
        <div className={`rounded-xl p-5 ${colors[color]}`}>
            <p className="text-xs font-medium uppercase tracking-wider opacity-70">{label}</p>
            <p className="text-3xl font-bold mt-1">{value}</p>
            {sub && <p className="text-xs mt-1 opacity-60">{sub}</p>}
        </div>
    );
};

export default function Index({ summary, payroll_by_month, employees_by_department }) {
    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold text-gray-800">Reports</h2>}>
            <Head title="Reports" />
            <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

                <section>
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Overview</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                        <StatCard label="Total Employees" value={summary.total_employees} color="indigo" />
                        <StatCard label="Active Employees" value={summary.active_employees} color="green" />
                        <StatCard label="Departments" value={summary.total_departments} color="blue" />
                        <StatCard label="Pending Payrolls" value={summary.pending_payroll} color="yellow" />
                        <StatCard label="Total Paid Payroll" value={`₱${Number(summary.total_payroll).toLocaleString()}`} color="green" sub="All time" />
                        <StatCard label="Present Today" value={summary.present_today} color="green" />
                        <StatCard label="Absent Today" value={summary.absent_today} color="red" />
                    </div>
                </section>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <section className="bg-white shadow rounded-xl p-6">
                        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Payroll by Month</h3>
                        {payroll_by_month.length === 0 && <p className="text-sm text-gray-400">No paid payroll data yet.</p>}
                        <div className="space-y-3">
                            {payroll_by_month.map(row => {
                                const max = Math.max(...payroll_by_month.map(r => Number(r.total)));
                                const pct = max > 0 ? (Number(row.total) / max) * 100 : 0;
                                return (
                                    <div key={row.month}>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="text-gray-600">{row.month}</span>
                                            <span className="font-medium text-gray-900">₱{Number(row.total).toLocaleString()}</span>
                                        </div>
                                        <div className="h-2 bg-gray-100 rounded-full">
                                            <div className="h-2 bg-indigo-500 rounded-full" style={{ width: `${pct}%` }} />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </section>

                    <section className="bg-white shadow rounded-xl p-6">
                        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Employees by Department</h3>
                        {employees_by_department.length === 0 && <p className="text-sm text-gray-400">No departments yet.</p>}
                        <div className="space-y-3">
                            {employees_by_department.map(dept => {
                                const total = employees_by_department.reduce((s, d) => s + d.employees_count, 0);
                                const pct = total > 0 ? (dept.employees_count / total) * 100 : 0;
                                return (
                                    <div key={dept.id}>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="text-gray-600">{dept.name}</span>
                                            <span className="font-medium text-gray-900">{dept.employees_count} employees</span>
                                        </div>
                                        <div className="h-2 bg-gray-100 rounded-full">
                                            <div className="h-2 bg-blue-500 rounded-full" style={{ width: `${pct}%` }} />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </section>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
