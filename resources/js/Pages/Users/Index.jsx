import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';

const roleColors = { admin: 'bg-red-100 text-red-700', hr: 'bg-blue-100 text-blue-700', employee: 'bg-green-100 text-green-700' };

export default function Index({ users }) {
    const { flash } = usePage().props;

    const destroy = (id) => {
        if (confirm('Delete this user?')) router.delete(route('users.destroy', id));
    };

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold text-gray-800">Users</h2>}>
            <Head title="Users" />
            <div className="py-8 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                {flash?.success && <div className="mb-4 px-4 py-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">{flash.success}</div>}
                {flash?.error && <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">{flash.error}</div>}
                <div className="flex justify-between items-center mb-6">
                    <p className="text-sm text-gray-500">{users.length} user{users.length !== 1 ? 's' : ''}</p>
                    <Link href={route('users.create')} className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition">+ New User</Link>
                </div>
                <div className="bg-white shadow rounded-xl overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>{['Name', 'Email', 'Role', 'Linked Employee', ''].map(h => (
                                <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{h}</th>
                            ))}</tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {users.map(u => (
                                <tr key={u.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium text-gray-900">{u.name}</td>
                                    <td className="px-6 py-4 text-sm text-gray-500">{u.email}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${roleColors[u.role]}`}>{u.role}</span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {u.employee ? `${u.employee.first_name} ${u.employee.last_name} (${u.employee.employee_number})` : '—'}
                                    </td>
                                    <td className="px-6 py-4 text-right space-x-3">
                                        <Link href={route('users.edit', u.id)} className="text-indigo-600 hover:text-indigo-800 text-sm">Edit</Link>
                                        <button onClick={() => destroy(u.id)} className="text-red-500 hover:text-red-700 text-sm">Delete</button>
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
