import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';

const Field = ({ label, error, children }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        {children}
        {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
);

const inputClass = "w-full border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm";

export default function Edit({ employee, departments }) {
    const { data, setData, patch, processing, errors } = useForm({
        department_id: employee.department_id || '',
        employee_number: employee.employee_number,
        first_name: employee.first_name,
        last_name: employee.last_name,
        email: employee.email,
        phone: employee.phone || '',
        position: employee.position,
        employment_type: employee.employment_type,
        basic_salary: employee.basic_salary,
        hired_at: (employee.hired_at || '').split('T')[0],
        status: employee.status,
    });

    const submit = (e) => { e.preventDefault(); patch(route('employees.update', employee.id)); };

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold text-gray-800">Edit Employee</h2>}>
            <Head title="Edit Employee" />
            <div className="py-8 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white shadow rounded-xl p-6">
                    <form onSubmit={submit} className="space-y-5">
                        <div className="grid grid-cols-2 gap-4">
                            <Field label="First Name *" error={errors.first_name}>
                                <input type="text" value={data.first_name} onChange={e => setData('first_name', e.target.value)} className={inputClass} />
                            </Field>
                            <Field label="Last Name *" error={errors.last_name}>
                                <input type="text" value={data.last_name} onChange={e => setData('last_name', e.target.value)} className={inputClass} />
                            </Field>
                            <Field label="Employee Number *" error={errors.employee_number}>
                                <input type="text" value={data.employee_number} onChange={e => setData('employee_number', e.target.value)} className={inputClass} />
                            </Field>
                            <Field label="Department" error={errors.department_id}>
                                <select value={data.department_id} onChange={e => setData('department_id', e.target.value)} className={inputClass}>
                                    <option value="">— None —</option>
                                    {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                                </select>
                            </Field>
                            <Field label="Email *" error={errors.email}>
                                <input type="email" value={data.email} onChange={e => setData('email', e.target.value)} className={inputClass} />
                            </Field>
                            <Field label="Phone" error={errors.phone}>
                                <input type="text" value={data.phone} onChange={e => setData('phone', e.target.value)} className={inputClass} />
                            </Field>
                            <Field label="Position *" error={errors.position}>
                                <input type="text" value={data.position} onChange={e => setData('position', e.target.value)} className={inputClass} />
                            </Field>
                            <Field label="Employment Type *" error={errors.employment_type}>
                                <select value={data.employment_type} onChange={e => setData('employment_type', e.target.value)} className={inputClass}>
                                    <option value="full-time">Full-time</option>
                                    <option value="part-time">Part-time</option>
                                    <option value="contract">Contract</option>
                                </select>
                            </Field>
                            <Field label="Basic Salary *" error={errors.basic_salary}>
                                <input type="number" min="0" step="0.01" value={data.basic_salary} onChange={e => setData('basic_salary', e.target.value)} className={inputClass} />
                            </Field>
                            <Field label="Hire Date *" error={errors.hired_at}>
                                <input type="date" value={data.hired_at} onChange={e => setData('hired_at', e.target.value)} className={inputClass} />
                            </Field>
                            <Field label="Status *" error={errors.status}>
                                <select value={data.status} onChange={e => setData('status', e.target.value)} className={inputClass}>
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                    <option value="terminated">Terminated</option>
                                </select>
                            </Field>
                        </div>
                        <div className="flex justify-end gap-3 pt-2">
                            <Link href={route('employees.index')} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800">Cancel</Link>
                            <button type="submit" disabled={processing}
                                className="px-5 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition">
                                Save Changes
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
