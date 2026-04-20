import PortalLayout from '@/Layouts/PortalLayout';
import { Head } from '@inertiajs/react';
import { useState } from 'react';

const STATUS = {
    paid:      { label: 'Paid',      cls: 'bg-emerald-100 text-emerald-700' },
    processed: { label: 'Processed', cls: 'bg-blue-100 text-blue-700' },
    draft:     { label: 'Draft',     cls: 'bg-gray-100 text-gray-500' },
};

const peso = n => `₱${Number(n ?? 0).toLocaleString('en-PH', { minimumFractionDigits: 2 })}`;

function PayslipModal({ payslip, employee, onClose }) {
    const phDed = payslip.ph_deductions ?? {};

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="px-6 pt-6 pb-4 border-b border-gray-100 flex justify-between items-start"
                    style={{ background: 'linear-gradient(90deg, #1B3461 0%, #243E73 100%)' }}>
                    <div>
                        <p className="text-white/60 text-xs font-medium uppercase tracking-wider">Payslip</p>
                        <h3 className="text-white font-bold text-lg mt-0.5">
                            {payslip.period_start} – {payslip.period_end}
                        </h3>
                        <p className="text-white/70 text-sm mt-1">{employee.full_name} · {employee.employee_number}</p>
                        <p className="text-white/50 text-xs">{employee.position}</p>
                    </div>
                    <button onClick={onClose} className="text-white/60 hover:text-white text-2xl leading-none mt-1">×</button>
                </div>

                <div className="px-6 py-5 space-y-4">
                    {/* Earnings */}
                    <div>
                        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Earnings</p>
                        <div className="space-y-1.5">
                            <Row label="Basic Salary"  value={peso(payslip.basic_salary)} />
                            <Row label="Allowances"    value={peso(payslip.allowances)} positive />
                        </div>
                        <div className="mt-2 pt-2 border-t border-gray-100 flex justify-between text-sm font-semibold text-gray-800">
                            <span>Gross Pay</span>
                            <span>{peso(Number(payslip.basic_salary) + Number(payslip.allowances))}</span>
                        </div>
                    </div>

                    {/* Deductions */}
                    <div>
                        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Deductions</p>
                        <div className="space-y-1.5">
                            {phDed.sss       !== undefined && <Row label="SSS"        value={peso(phDed.sss)}       negative />}
                            {phDed.philhealth !== undefined && <Row label="PhilHealth" value={peso(phDed.philhealth)} negative />}
                            {phDed.pagibig   !== undefined && <Row label="Pag-IBIG"   value={peso(phDed.pagibig)}   negative />}
                            {phDed.tax       !== undefined && <Row label="Withholding Tax" value={peso(phDed.tax)}  negative />}
                            {/* Any remaining deductions not itemized */}
                            {(() => {
                                const itemized = (phDed.sss ?? 0) + (phDed.philhealth ?? 0) + (phDed.pagibig ?? 0) + (phDed.tax ?? 0);
                                const other = Number(payslip.deductions) - itemized;
                                return other > 0.01 ? <Row label="Other Deductions" value={peso(other)} negative /> : null;
                            })()}
                        </div>
                        <div className="mt-2 pt-2 border-t border-gray-100 flex justify-between text-sm font-semibold text-rose-600">
                            <span>Total Deductions</span>
                            <span>({peso(payslip.deductions)})</span>
                        </div>
                    </div>

                    {/* Net Pay */}
                    <div className="rounded-xl p-4 text-center"
                        style={{ background: 'linear-gradient(90deg, #1B3461 0%, #243E73 100%)' }}>
                        <p className="text-white/60 text-xs uppercase tracking-wider mb-1">Net Pay</p>
                        <p className="text-white font-bold text-2xl">{peso(payslip.net_pay)}</p>
                        {payslip.processed_at && (
                            <p className="text-white/50 text-xs mt-1">Processed {payslip.processed_at}</p>
                        )}
                    </div>
                </div>

                <div className="px-6 pb-5">
                    <button onClick={onClose}
                        className="w-full py-2 border border-gray-200 rounded-lg text-sm text-gray-500 hover:bg-gray-50 transition">
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}

function Row({ label, value, positive, negative }) {
    return (
        <div className="flex justify-between text-sm">
            <span className="text-gray-500">{label}</span>
            <span className={positive ? 'text-emerald-600' : negative ? 'text-rose-600' : 'text-gray-800'}>{value}</span>
        </div>
    );
}

export default function Payslips({ payslips, employee }) {
    const [viewing, setViewing] = useState(null);

    return (
        <PortalLayout header={<h2 className="text-xl font-semibold text-gray-800">My Payslips</h2>}>
            <Head title="My Payslips" />

            {viewing && (
                <PayslipModal payslip={viewing} employee={employee} onClose={() => setViewing(null)} />
            )}

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-50">
                    <h4 className="text-sm font-semibold text-brand-navy">Payslip History</h4>
                </div>

                {payslips.length === 0 ? (
                    <p className="px-5 py-10 text-center text-sm text-gray-400">No payslips yet.</p>
                ) : (
                    <div className="divide-y divide-gray-50">
                        {payslips.map(p => {
                            const st = STATUS[p.status] ?? STATUS.draft;
                            return (
                                <div key={p.id}
                                    className="flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors cursor-pointer"
                                    onClick={() => setViewing(p)}>
                                    <div>
                                        <p className="text-sm font-semibold text-brand-navy">
                                            {p.period_start} – {p.period_end}
                                        </p>
                                        <p className="text-xs text-gray-400 mt-0.5">
                                            Processed {p.processed_at ?? '—'}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide ${st.cls}`}>
                                            {st.label}
                                        </span>
                                        <div className="text-right">
                                            <p className="text-sm font-bold text-brand-navy">{peso(p.net_pay)}</p>
                                            <p className="text-[10px] text-gray-400">Net Pay</p>
                                        </div>
                                        <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/>
                                        </svg>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </PortalLayout>
    );
}
