import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';

const statusColors = { active: 'bg-green-100 text-green-700', inactive: 'bg-yellow-100 text-yellow-700', terminated: 'bg-red-100 text-red-700' };
const typeColors = { 'full-time': 'bg-blue-100 text-blue-700', 'part-time': 'bg-purple-100 text-purple-700', contract: 'bg-orange-100 text-orange-700' };

export default function Index({ employees, flash }) {
    const destroy = (id) => {
        if (confirm('Delete this employee?')) router.delete(route('employees.destroy', id));
    };

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold text-gray-800">Employees</h2>}>
            <Head title="Employees" />
            <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {flash?.success && (
                    <div className="mb-4 px-4 py-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">{flash.success}</div>
                )}
                <div className="flex justify-between items-center mb-6">
                    <p className="text-sm text-gray-500">{employees.length} employee{employees.length !== 1 ? 's' : ''}</p>
                    <Link href={route('employees.create')} className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition">
                        + New Employee
                    </Link>
                </div>
                <div className="bg-white shadow rounded-xl overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                {['ID', 'Name', 'Position', 'Department', 'Type', 'Salary', 'Status', ''].map(h => (
                                    <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {employees.length === 0 && (
                                <tr><td colSpan={8} className="px-6 py-10 text-center text-gray-400 text-sm">No employees yet.</td></tr>
                            )}
                            {employees.map(e => (
                                <tr key={e.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 font-mono text-xs text-gray-500">{e.employee_number}</td>
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-gray-900">{e.first_name} {e.last_name}</div>
                                        <div className="text-xs text-gray-400">{e.email}</div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{e.position}</td>
                                    <td className="px-6 py-4 text-sm text-gray-500">{e.department?.name || '—'}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${typeColors[e.employment_type]}`}>
                                            {e.employment_type}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-700">₱{Number(e.basic_salary).toLocaleString()}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[e.status]}`}>
                                            {e.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right space-x-3">
                                        <Link href={route('employees.edit', e.id)} className="text-indigo-600 hover:text-indigo-800 text-sm">Edit</Link>
                                        <button onClick={() => destroy(e.id)} className="text-red-500 hover:text-red-700 text-sm">Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
