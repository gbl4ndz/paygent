import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    return (
        <div className="min-h-screen flex">
            {/* Left panel — brand */}
            <div className="hidden lg:flex lg:w-5/12 xl:w-1/2 flex-col justify-between bg-brand-navy px-12 py-16">
                <div className="flex items-center gap-4">
                    <ApplicationLogo className="h-12 w-auto" />
                    <div>
                        <div className="font-bold text-2xl leading-none tracking-tight">
                            <span className="text-white">Pay</span>
                            <span className="text-brand-green">gent</span>
                        </div>
                        <div className="text-[9px] tracking-widest text-brand-teal uppercase font-medium mt-0.5">
                            Your Partner in Payroll & People.
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <h1 className="text-4xl font-bold text-white leading-snug">
                        Smart Payroll &<br />
                        <span className="text-brand-green">HR Management</span><br />
                        for Filipino Teams.
                    </h1>
                    <p className="text-brand-teal text-sm leading-relaxed max-w-sm">
                        Automate payroll deductions, track attendance, manage leaves, and stay compliant — all in one platform built for the Philippines.
                    </p>
                </div>

                <div className="flex items-center gap-8">
                    {[['SSS', 'Compliant'], ['PhilHealth', 'Integrated'], ['Pag-IBIG', 'Automated'], ['TRAIN Law', 'Tax Ready']].map(([title, sub]) => (
                        <div key={title}>
                            <div className="text-xs font-semibold text-white">{title}</div>
                            <div className="text-[10px] text-brand-teal">{sub}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Right panel — form */}
            <div className="flex-1 flex flex-col items-center justify-center bg-slate-50 px-6 py-12">
                {/* Mobile logo */}
                <div className="lg:hidden flex items-center gap-3 mb-8">
                    <ApplicationLogo className="h-10 w-auto" />
                    <div>
                        <div className="font-bold text-xl leading-none">
                            <span className="text-brand-navy">Pay</span>
                            <span className="text-brand-green">gent</span>
                        </div>
                        <div className="text-[8px] tracking-widest text-gray-400 uppercase mt-0.5">
                            Your Partner in Payroll & People.
                        </div>
                    </div>
                </div>

                <div className="w-full max-w-md">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-8 py-10">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}
