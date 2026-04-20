import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';

const statusBadge = (active) => (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
        {active ? 'Active' : 'Inactive'}
    </span>
);

export default function Index({ departments, flash }) {
    const destroy = (id) => {
        if (confirm('Delete this department?')) {
            router.delete(route('departments.destroy', id));
        }
    };

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold text-gray-800">Departments</h2>}>
            <Head title="Departments" />
            <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {flash?.success && (
                    <div className="mb-4 px-4 py-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">{flash.success}</div>
                )}
                <div className="flex justify-between items-center mb-6">
                    <p className="text-sm text-gray-500">{departments.length} department{departments.length !== 1 ? 's' : ''}</p>
                    <Link href={route('departments.create')} className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition">
                        + New Department
                    </Link>
                </div>
                <div className="bg-white shadow rounded-xl overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                {['Code', 'Name', 'Description', 'Employees', 'Status', ''].map((h) => (
                                    <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {departments.length === 0 && (
                                <tr><td colSpan={6} className="px-6 py-10 text-center text-gray-400 text-sm">No departments yet.</td></tr>
                            )}
                            {departments.map((d) => (
                                <tr key={d.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 font-mono text-sm text-gray-600">{d.code}</td>
                                    <td className="px-6 py-4 font-medium text-gray-900">{d.name}</td>
                                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">{d.description || '—'}</td>
                                    <td className="px-6 py-4 text-sm text-gray-700">{d.employees_count}</td>
                                    <td className="px-6 py-4">{statusBadge(d.is_active)}</td>
                                    <td className="px-6 py-4 text-right space-x-3">
                                        <Link href={route('departments.edit', d.id)} className="text-indigo-600 hover:text-indigo-800 text-sm">Edit</Link>
                                        <button onClick={() => destroy(d.id)} className="text-red-500 hover:text-red-700 text-sm">Delete</button>
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
