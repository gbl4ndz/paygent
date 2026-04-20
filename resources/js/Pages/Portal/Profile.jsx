import PortalLayout from '@/Layouts/PortalLayout';
import { Head, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';

const TABS = [
    { key: 'personal',    label: 'Personal Info' },
    { key: 'address',     label: 'Address' },
    { key: 'contact',     label: 'Contact' },
    { key: 'government',  label: 'Gov\'t Numbers' },
    { key: 'dependents',  label: 'Dependents' },
    { key: 'bank',        label: 'Bank Details' },
    { key: 'emergency',   label: 'Emergency Contact' },
];

// ── Reusable field wrappers ───────────────────────────────────────────────────
function Field({ label, error, required, children }) {
    return (
        <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
                {label}{required && <span className="text-red-400 ml-0.5">*</span>}
            </label>
            {children}
            {error && <p className="text-xs text-red-500 mt-0.5">{error}</p>}
        </div>
    );
}

function Input({ value, onChange, type = 'text', placeholder, disabled, className = '' }) {
    return (
        <input type={type} value={value ?? ''} onChange={e => onChange?.(e.target.value)}
            placeholder={placeholder} disabled={disabled}
            className={`w-full border-gray-300 rounded-lg text-sm focus:ring-brand-green focus:border-brand-green disabled:bg-gray-50 disabled:text-gray-400 ${className}`} />
    );
}

function Textarea({ value, onChange, placeholder, rows = 2 }) {
    return (
        <textarea rows={rows} value={value ?? ''} onChange={e => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full border-gray-300 rounded-lg text-sm focus:ring-brand-green focus:border-brand-green" />
    );
}

function Select({ value, onChange, options }) {
    return (
        <select value={value ?? ''} onChange={e => onChange(e.target.value)}
            className="w-full border-gray-300 rounded-lg text-sm focus:ring-brand-green focus:border-brand-green">
            <option value="">— Select —</option>
            {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
    );
}

function SectionTitle({ children }) {
    return <h4 className="text-xs font-semibold text-brand-navy uppercase tracking-wider mb-3 mt-1">{children}</h4>;
}

// ── Address block ─────────────────────────────────────────────────────────────
function AddressBlock({ prefix, data, setData, errors, title }) {
    const f = k => `${prefix}_${k}`;
    return (
        <div>
            <SectionTitle>{title}</SectionTitle>
            <div className="space-y-3">
                <Field label="Street / Barangay" error={errors[f('address')]}>
                    <Textarea value={data[f('address')]} onChange={v => setData(f('address'), v)} rows={2} placeholder="Unit / Blk / Lot, Street, Barangay" />
                </Field>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <Field label="City / Municipality" error={errors[f('city')]}>
                        <Input value={data[f('city')]} onChange={v => setData(f('city'), v)} />
                    </Field>
                    <Field label="Province" error={errors[f('province')]}>
                        <Input value={data[f('province')]} onChange={v => setData(f('province'), v)} />
                    </Field>
                    <Field label="ZIP Code" error={errors[f('zip_code')]}>
                        <Input value={data[f('zip_code')]} onChange={v => setData(f('zip_code'), v)} />
                    </Field>
                </div>
            </div>
        </div>
    );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function Profile({ employee }) {
    const [tab, setTab] = useState('personal');
    const { flash } = usePage().props;

    const parseDate = d => d ? String(d).split('T')[0] : '';

    const { data, setData, put, processing, errors } = useForm({
        // Personal
        middle_name:  employee.middle_name  ?? '',
        gender:       employee.gender       ?? '',
        civil_status: employee.civil_status ?? '',
        birthdate:    parseDate(employee.birthdate),
        nationality:  employee.nationality  ?? '',

        // Address
        permanent_address:  employee.permanent_address  ?? '',
        permanent_city:     employee.permanent_city     ?? '',
        permanent_province: employee.permanent_province ?? '',
        permanent_zip_code: employee.permanent_zip_code ?? '',
        present_address:    employee.present_address    ?? '',
        present_city:       employee.present_city       ?? '',
        present_province:   employee.present_province   ?? '',
        present_zip_code:   employee.present_zip_code   ?? '',

        // Contact
        phone:             employee.phone             ?? '',
        alternative_phone: employee.alternative_phone ?? '',
        personal_email:    employee.personal_email    ?? '',

        // Government
        sss_number:        employee.sss_number        ?? '',
        philhealth_number: employee.philhealth_number ?? '',
        pagibig_number:    employee.pagibig_number    ?? '',
        tin_number:        employee.tin_number        ?? '',

        // Dependents
        dependents: employee.dependents ?? [],

        // Bank
        bank_name:           employee.bank_name           ?? '',
        bank_account_number: employee.bank_account_number ?? '',
        bank_account_name:   employee.bank_account_name   ?? '',

        // Emergency
        emergency_contact_name:         employee.emergency_contact_name         ?? '',
        emergency_contact_relationship: employee.emergency_contact_relationship ?? '',
        emergency_contact_phone:        employee.emergency_contact_phone        ?? '',
        emergency_contact_address:      employee.emergency_contact_address      ?? '',
    });

    const set = field => val => setData(field, val);

    // Dependent helpers
    const addDependent    = () => setData('dependents', [...data.dependents, { name: '', relationship: '', birthdate: '' }]);
    const removeDependent = i  => setData('dependents', data.dependents.filter((_, idx) => idx !== i));
    const updateDependent = (i, field, val) =>
        setData('dependents', data.dependents.map((d, idx) => idx === i ? { ...d, [field]: val } : d));

    // "Same as permanent" copy
    const copyPermanent = () => setData(d => ({
        ...d,
        present_address:  d.permanent_address,
        present_city:     d.permanent_city,
        present_province: d.permanent_province,
        present_zip_code: d.permanent_zip_code,
    }));

    const submit = e => { e.preventDefault(); put(route('portal.profile.update')); };

    const tabErrors = {
        personal:   ['middle_name','gender','civil_status','birthdate','nationality'],
        address:    ['permanent_address','permanent_city','permanent_province','permanent_zip_code','present_address','present_city','present_province','present_zip_code'],
        contact:    ['phone','alternative_phone','personal_email'],
        government: ['sss_number','philhealth_number','pagibig_number','tin_number'],
        dependents: Object.keys(errors).filter(k => k.startsWith('dependents')),
        bank:       ['bank_name','bank_account_number','bank_account_name'],
        emergency:  ['emergency_contact_name','emergency_contact_relationship','emergency_contact_phone','emergency_contact_address'],
    };
    const hasError = keys => keys.some(k => errors[k]);

    return (
        <PortalLayout header={<h2 className="text-xl font-semibold text-gray-800">My Profile</h2>}>
            <Head title="My Profile" />

            {/* Banner */}
            <div className="mb-6 rounded-2xl overflow-hidden shadow-sm"
                style={{ background: 'linear-gradient(120deg, #1B3461 0%, #243E73 60%, #1a5c4a 100%)' }}>
                <div className="px-6 py-5 flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-xl shrink-0">
                        {employee.first_name?.[0]}{employee.last_name?.[0]}
                    </div>
                    <div>
                        <h3 className="text-white font-bold text-lg">
                            {employee.first_name} {employee.middle_name ? employee.middle_name + ' ' : ''}{employee.last_name}
                        </h3>
                        <p className="text-white/60 text-sm">{employee.position} · {employee.employee_number}</p>
                        <p className="text-white/40 text-xs capitalize mt-0.5">{employee.employment_type?.replace('-', ' ')}</p>
                    </div>
                </div>
            </div>

            {flash?.success && (
                <div className="mb-4 px-4 py-3 bg-emerald-50 border border-emerald-200 rounded-xl text-sm text-emerald-700 font-medium">
                    ✓ {flash.success}
                </div>
            )}

            <form onSubmit={submit}>
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    {/* Tabs */}
                    <div className="flex border-b border-gray-100 overflow-x-auto scrollbar-hide">
                        {TABS.map(t => (
                            <button key={t.key} type="button" onClick={() => setTab(t.key)}
                                className={`relative px-4 py-3.5 text-xs font-semibold whitespace-nowrap transition-colors border-b-2 ${
                                    tab === t.key
                                        ? 'border-brand-green text-brand-green'
                                        : 'border-transparent text-gray-500 hover:text-gray-700'
                                }`}>
                                {t.label}
                                {hasError(tabErrors[t.key] ?? []) && (
                                    <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-red-400" />
                                )}
                            </button>
                        ))}
                    </div>

                    <div className="p-6">
                        {/* ── Personal Info ─────────────────────────── */}
                        {tab === 'personal' && (
                            <div className="space-y-4">
                                <p className="text-xs text-gray-400 bg-gray-50 rounded-lg px-3 py-2">
                                    Fields marked <span className="text-red-400 font-semibold">*</span> are managed by HR. Contact HR for name corrections.
                                </p>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <Field label="First Name" required><Input value={employee.first_name} disabled /></Field>
                                    <Field label="Middle Name" error={errors.middle_name}>
                                        <Input value={data.middle_name} onChange={set('middle_name')} placeholder="Optional" />
                                    </Field>
                                    <Field label="Last Name" required><Input value={employee.last_name} disabled /></Field>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <Field label="Gender" error={errors.gender}>
                                        <Select value={data.gender} onChange={set('gender')} options={[
                                            { value: 'male',   label: 'Male' },
                                            { value: 'female', label: 'Female' },
                                            { value: 'other',  label: 'Other / Prefer not to say' },
                                        ]} />
                                    </Field>
                                    <Field label="Civil Status" error={errors.civil_status}>
                                        <Select value={data.civil_status} onChange={set('civil_status')} options={[
                                            { value: 'single',    label: 'Single' },
                                            { value: 'married',   label: 'Married' },
                                            { value: 'widowed',   label: 'Widowed' },
                                            { value: 'separated', label: 'Separated' },
                                        ]} />
                                    </Field>
                                    <Field label="Date of Birth" error={errors.birthdate}>
                                        <Input type="date" value={data.birthdate} onChange={set('birthdate')} />
                                    </Field>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <Field label="Nationality" error={errors.nationality}>
                                        <Input value={data.nationality} onChange={set('nationality')} placeholder="e.g. Filipino" />
                                    </Field>
                                </div>
                            </div>
                        )}

                        {/* ── Address ───────────────────────────────── */}
                        {tab === 'address' && (
                            <div className="space-y-6">
                                <AddressBlock prefix="permanent" data={data} setData={setData} errors={errors} title="Permanent Address" />
                                <hr className="border-gray-100" />
                                <div>
                                    <div className="flex items-center justify-between mb-3">
                                        <SectionTitle>Present Address</SectionTitle>
                                        <button type="button" onClick={copyPermanent}
                                            className="text-xs text-brand-green hover:underline font-medium">
                                            Same as Permanent
                                        </button>
                                    </div>
                                    <div className="space-y-3">
                                        <Field label="Street / Barangay" error={errors.present_address}>
                                            <Textarea value={data.present_address} onChange={v => setData('present_address', v)} rows={2} placeholder="Unit / Blk / Lot, Street, Barangay" />
                                        </Field>
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                            <Field label="City / Municipality" error={errors.present_city}>
                                                <Input value={data.present_city} onChange={set('present_city')} />
                                            </Field>
                                            <Field label="Province" error={errors.present_province}>
                                                <Input value={data.present_province} onChange={set('present_province')} />
                                            </Field>
                                            <Field label="ZIP Code" error={errors.present_zip_code}>
                                                <Input value={data.present_zip_code} onChange={set('present_zip_code')} />
                                            </Field>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ── Contact ───────────────────────────────── */}
                        {tab === 'contact' && (
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <Field label="Work Email" required><Input value={employee.email} disabled /></Field>
                                    <Field label="Personal Email" error={errors.personal_email}>
                                        <Input type="email" value={data.personal_email} onChange={set('personal_email')} placeholder="personal@email.com" />
                                    </Field>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <Field label="Mobile Number" error={errors.phone}>
                                        <Input value={data.phone} onChange={set('phone')} placeholder="09XXXXXXXXX" />
                                    </Field>
                                    <Field label="Alternative / Landline" error={errors.alternative_phone}>
                                        <Input value={data.alternative_phone} onChange={set('alternative_phone')} placeholder="Secondary contact number" />
                                    </Field>
                                </div>
                            </div>
                        )}

                        {/* ── Government Numbers ────────────────────── */}
                        {tab === 'government' && (
                            <div className="space-y-4">
                                <p className="text-xs text-gray-400 bg-gray-50 rounded-lg px-3 py-2">
                                    Government ID numbers are used for statutory deductions and compliance reporting.
                                </p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <Field label="SSS Number" error={errors.sss_number}>
                                        <Input value={data.sss_number} onChange={set('sss_number')} placeholder="XX-XXXXXXX-X" />
                                    </Field>
                                    <Field label="PhilHealth Number" error={errors.philhealth_number}>
                                        <Input value={data.philhealth_number} onChange={set('philhealth_number')} placeholder="XXXX-XXXXXXXX-X" />
                                    </Field>
                                    <Field label="Pag-IBIG (HDMF) Number" error={errors.pagibig_number}>
                                        <Input value={data.pagibig_number} onChange={set('pagibig_number')} placeholder="XXXX-XXXX-XXXX" />
                                    </Field>
                                    <Field label="TIN (Tax ID Number)" error={errors.tin_number}>
                                        <Input value={data.tin_number} onChange={set('tin_number')} placeholder="XXX-XXX-XXX-XXX" />
                                    </Field>
                                </div>
                            </div>
                        )}

                        {/* ── Dependents ────────────────────────────── */}
                        {tab === 'dependents' && (
                            <div className="space-y-3">
                                {data.dependents.length === 0 && (
                                    <p className="text-sm text-gray-400 text-center py-4">No dependents added yet.</p>
                                )}
                                {data.dependents.map((dep, i) => (
                                    <div key={i} className="border border-gray-100 rounded-xl p-4 bg-gray-50/50 relative">
                                        <div className="flex items-center justify-between mb-3">
                                            <span className="text-xs font-semibold text-brand-navy">Dependent {i + 1}</span>
                                            <button type="button" onClick={() => removeDependent(i)}
                                                className="text-xs text-red-400 hover:text-red-600 font-medium">
                                                Remove
                                            </button>
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                            <Field label="Full Name" error={errors[`dependents.${i}.name`]}>
                                                <Input value={dep.name} onChange={v => updateDependent(i, 'name', v)} placeholder="Full name" />
                                            </Field>
                                            <Field label="Relationship" error={errors[`dependents.${i}.relationship`]}>
                                                <Input value={dep.relationship} onChange={v => updateDependent(i, 'relationship', v)} placeholder="e.g. Child, Spouse" />
                                            </Field>
                                            <Field label="Date of Birth" error={errors[`dependents.${i}.birthdate`]}>
                                                <Input type="date" value={dep.birthdate ?? ''} onChange={v => updateDependent(i, 'birthdate', v)} />
                                            </Field>
                                        </div>
                                    </div>
                                ))}
                                <button type="button" onClick={addDependent}
                                    className="w-full py-2.5 border-2 border-dashed border-gray-200 rounded-xl text-sm text-gray-400 hover:border-brand-green hover:text-brand-green transition-colors font-medium">
                                    + Add Dependent
                                </button>
                            </div>
                        )}

                        {/* ── Bank Details ──────────────────────────── */}
                        {tab === 'bank' && (
                            <div className="space-y-4">
                                <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-700">
                                    Bank details are used for payroll disbursement. Ensure accuracy before saving.
                                </div>
                                <Field label="Bank Name" error={errors.bank_name}>
                                    <Input value={data.bank_name} onChange={set('bank_name')} placeholder="e.g. BDO, BPI, Metrobank, GCash" />
                                </Field>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <Field label="Account Number" error={errors.bank_account_number}>
                                        <Input value={data.bank_account_number} onChange={set('bank_account_number')} placeholder="Account number" />
                                    </Field>
                                    <Field label="Account Name" error={errors.bank_account_name}>
                                        <Input value={data.bank_account_name} onChange={set('bank_account_name')} placeholder="Name as it appears on account" />
                                    </Field>
                                </div>
                            </div>
                        )}

                        {/* ── Emergency Contact ─────────────────────── */}
                        {tab === 'emergency' && (
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <Field label="Contact Name" error={errors.emergency_contact_name}>
                                        <Input value={data.emergency_contact_name} onChange={set('emergency_contact_name')} placeholder="Full name" />
                                    </Field>
                                    <Field label="Relationship" error={errors.emergency_contact_relationship}>
                                        <Input value={data.emergency_contact_relationship} onChange={set('emergency_contact_relationship')} placeholder="e.g. Spouse, Parent, Sibling" />
                                    </Field>
                                </div>
                                <Field label="Phone Number" error={errors.emergency_contact_phone}>
                                    <Input value={data.emergency_contact_phone} onChange={set('emergency_contact_phone')} placeholder="09XXXXXXXXX" />
                                </Field>
                                <Field label="Address" error={errors.emergency_contact_address}>
                                    <Textarea value={data.emergency_contact_address} onChange={v => setData('emergency_contact_address', v)} placeholder="Home address" />
                                </Field>
                            </div>
                        )}
                    </div>

                    {/* Save button */}
                    <div className="px-6 pb-6 flex justify-end border-t border-gray-50 pt-4">
                        <button type="submit" disabled={processing}
                            className="px-6 py-2.5 bg-brand-green text-white text-sm font-semibold rounded-xl hover:bg-emerald-500 disabled:opacity-60 transition-colors">
                            {processing ? 'Saving…' : 'Save Changes'}
                        </button>
                    </div>
                </div>
            </form>
        </PortalLayout>
    );
}
