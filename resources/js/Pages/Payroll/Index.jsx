import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';

const fmtDate = d => d ? new Date(d).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' }) : '—';

const statusColors = {
    draft: 'bg-gray-100 text-gray-600',
    processed: 'bg-blue-100 text-blue-700',
    paid: 'bg-green-100 text-green-700',
};

export default function Index({ payrolls, flash }) {
    const destroy = (id) => {
        if (confirm('Delete this payroll entry?')) router.delete(route('payroll.destroy', id));
    };

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold text-gray-800">Payroll</h2>}>
            <Head title="Payroll" />
            <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {flash?.success && (
                    <div className="mb-4 px-4 py-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">{flash.success}</div>
                )}
                <div className="flex justify-between items-center mb-6">
                    <p className="text-sm text-gray-500">{payrolls.total} entr{payrolls.total !== 1 ? 'ies' : 'y'}</p>
                    <Link href={route('payroll.create')} className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition">
                        + New Payroll Entry
                    </Link>
                </div>
                <div className="bg-white shadow rounded-xl overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                {['Employee', 'Period', 'Basic Salary', 'Allowances', 'Deductions', 'Net Pay', 'Status', ''].map(h => (
                                    <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {payrolls.data.length === 0 && (
                                <tr><td colSpan={8} className="px-6 py-10 text-center text-gray-400 text-sm">No payroll entries yet.</td></tr>
                            )}
                            {payrolls.data.map(p => (
                                <tr key={p.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-gray-900">{p.employee?.first_name} {p.employee?.last_name}</div>
                                        <div className="text-xs text-gray-400">{p.employee?.employee_number}</div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{fmtDate(p.period_start)} – {fmtDate(p.period_end)}</td>
                                    <td className="px-6 py-4 text-sm text-gray-700">₱{Number(p.basic_salary).toLocaleString()}</td>
                                    <td className="px-6 py-4 text-sm text-green-600">+₱{Number(p.allowances).toLocaleString()}</td>
                                    <td className="px-6 py-4 text-sm text-red-500">-₱{Number(p.deductions).toLocaleString()}</td>
                                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">₱{Number(p.net_pay).toLocaleString()}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[p.status]}`}>{p.status}</span>
                                    </td>
                                    <td className="px-6 py-4 text-right space-x-3">
                                        <Link href={route('payroll.edit', p.id)} className="text-indigo-600 hover:text-indigo-800 text-sm">Edit</Link>
                                        <button onClick={() => destroy(p.id)} className="text-red-500 hover:text-red-700 text-sm">Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {payrolls.last_page > 1 && (
                    <div className="mt-4 flex justify-center gap-2">
                        {payrolls.links.map((link, i) => (
                            <button key={i} onClick={() => link.url && router.get(link.url)}
                                disabled={!link.url}
                                className={`px-3 py-1 text-sm rounded ${link.active ? 'bg-indigo-600 text-white' : 'bg-white text-gray-600 border hover:bg-gray-50'} disabled:opacity-40`}
                                dangerouslySetInnerHTML={{ __html: link.label }} />
                        ))}
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
