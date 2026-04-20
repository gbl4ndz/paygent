import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useEffect } from 'react';

const inputClass = "w-full border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm";

export default function Create({ employees }) {
    const { data, setData, post, processing, errors } = useForm({
        employee_id: '', period_start: '', period_end: '',
        basic_salary: '', allowances: '0', deductions: '0', status: 'draft', notes: '',
    });

    const netPay = (Number(data.basic_salary) || 0) + (Number(data.allowances) || 0) - (Number(data.deductions) || 0);

    const handleEmployeeChange = (id) => {
        setData('employee_id', id);
        const emp = employees.find(e => String(e.id) === String(id));
        if (emp) setData(d => ({ ...d, employee_id: id, basic_salary: emp.basic_salary }));
    };

    const submit = (e) => { e.preventDefault(); post(route('payroll.store')); };

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold text-gray-800">New Payroll Entry</h2>}>
            <Head title="New Payroll Entry" />
            <div className="py-8 max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white shadow rounded-xl p-6">
                    <form onSubmit={submit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Employee *</label>
                            <select value={data.employee_id} onChange={e => handleEmployeeChange(e.target.value)} className={inputClass}>
                                <option value="">Select employee…</option>
                                {employees.map(e => (
                                    <option key={e.id} value={e.id}>{e.first_name} {e.last_name} ({e.employee_number})</option>
                                ))}
                            </select>
                            {errors.employee_id && <p className="mt-1 text-xs text-red-500">{errors.employee_id}</p>}
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Period Start *</label>
                                <input type="date" value={data.period_start} onChange={e => setData('period_start', e.target.value)} className={inputClass} />
                                {errors.period_start && <p className="mt-1 text-xs text-red-500">{errors.period_start}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Period End *</label>
                                <input type="date" value={data.period_end} onChange={e => setData('period_end', e.target.value)} className={inputClass} />
                                {errors.period_end && <p className="mt-1 text-xs text-red-500">{errors.period_end}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Basic Salary *</label>
                                <input type="number" min="0" step="0.01" value={data.basic_salary} onChange={e => setData('basic_salary', e.target.value)} className={inputClass} />
                                {errors.basic_salary && <p className="mt-1 text-xs text-red-500">{errors.basic_salary}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Status *</label>
                                <select value={data.status} onChange={e => setData('status', e.target.value)} className={inputClass}>
                                    <option value="draft">Draft</option>
                                    <option value="processed">Processed</option>
                                    <option value="paid">Paid</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Allowances</label>
                                <input type="number" min="0" step="0.01" value={data.allowances} onChange={e => setData('allowances', e.target.value)} className={inputClass} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Deductions</label>
                                <input type="number" min="0" step="0.01" value={data.deductions} onChange={e => setData('deductions', e.target.value)} className={inputClass} />
                            </div>
                        </div>
                        <div className="bg-indigo-50 rounded-lg px-4 py-3 flex justify-between items-center">
                            <span className="text-sm font-medium text-gray-700">Net Pay</span>
                            <span className="text-lg font-bold text-indigo-700">₱{netPay.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                            <textarea rows={2} value={data.notes} onChange={e => setData('notes', e.target.value)} className={inputClass} />
                        </div>
                        <div className="flex justify-end gap-3 pt-2">
                            <Link href={route('payroll.index')} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800">Cancel</Link>
                            <button type="submit" disabled={processing}
                                className="px-5 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition">
                                Create Entry
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
