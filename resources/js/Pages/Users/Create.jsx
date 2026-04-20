import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';

const inputClass = "w-full border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm";

export default function Create({ employees }) {
    const { data, setData, post, processing, errors } = useForm({
        name: '', email: '', password: '', password_confirmation: '',
        role: 'employee', employee_id: '',
    });

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold text-gray-800">New User</h2>}>
            <Head title="New User" />
            <div className="py-8 max-w-xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white shadow rounded-xl p-6">
                    <form onSubmit={e => { e.preventDefault(); post(route('users.store')); }} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                            <input type="text" value={data.name} onChange={e => setData('name', e.target.value)} className={inputClass} />
                            {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                            <input type="email" value={data.email} onChange={e => setData('email', e.target.value)} className={inputClass} />
                            {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Role *</label>
                            <select value={data.role} onChange={e => setData('role', e.target.value)} className={inputClass}>
                                <option value="admin">Admin</option>
                                <option value="hr">HR</option>
                                <option value="employee">Employee</option>
                            </select>
                        </div>
                        {data.role === 'employee' && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Link to Employee</label>
                                <select value={data.employee_id} onChange={e => setData('employee_id', e.target.value)} className={inputClass}>
                                    <option value="">— None —</option>
                                    {employees.map(e => <option key={e.id} value={e.id}>{e.first_name} {e.last_name} ({e.employee_number})</option>)}
                                </select>
                            </div>
                        )}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
                            <input type="password" value={data.password} onChange={e => setData('password', e.target.value)} className={inputClass} />
                            {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password *</label>
                            <input type="password" value={data.password_confirmation} onChange={e => setData('password_confirmation', e.target.value)} className={inputClass} />
                        </div>
                        <div className="flex justify-end gap-3 pt-2">
                            <Link href={route('users.index')} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800">Cancel</Link>
                            <button type="submit" disabled={processing} className="px-5 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition">Create User</button>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
