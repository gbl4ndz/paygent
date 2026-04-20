import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';

function NavItem({ href, active, children }) {
    return (
        <Link
            href={href}
            className={`inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                active
                    ? 'bg-brand-green/15 text-brand-green font-semibold'
                    : 'text-brand-navy/70 hover:text-brand-navy hover:bg-brand-navy/5'
            }`}
        >
            {children}
        </Link>
    );
}

export default function PortalLayout({ header, children }) {
    const { auth, flash } = usePage().props;
    const [mobileOpen, setMobileOpen] = useState(false);

    const navLinks = [
        { label: 'Home',       href: route('portal.dashboard'),   match: 'portal.dashboard' },
        { label: 'Attendance', href: route('portal.attendance'),  match: 'portal.attendance' },
        { label: 'Leave',      href: route('portal.leave.index'), match: 'portal.leave.*' },
        { label: 'Payslips',   href: route('portal.payslips'),    match: 'portal.payslips' },
        { label: 'My Profile', href: route('portal.profile'),     match: 'portal.profile' },
    ];

    return (
        <div className="min-h-screen bg-slate-100">
            <nav className="bg-white border-b border-gray-200 shadow-sm">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 items-center justify-between">
                        <div className="flex items-center gap-8">
                            <Link href={route('portal.dashboard')} className="flex items-center gap-3 shrink-0">
                                <ApplicationLogo className="h-9 w-auto" />
                                <div>
                                    <div className="font-bold text-lg leading-none tracking-tight">
                                        <span className="text-brand-navy">Pay</span>
                                        <span className="text-brand-green">gent</span>
                                    </div>
                                </div>
                            </Link>

                            <div className="hidden sm:flex items-center gap-1">
                                {navLinks.map(({ label, href, match }) => (
                                    <NavItem key={label} href={href} active={route().current(match)}>{label}</NavItem>
                                ))}
                            </div>
                        </div>

                        <div className="hidden sm:flex items-center gap-3">
                            <span className="flex items-center justify-center w-7 h-7 rounded-full bg-brand-green/20 text-brand-green font-semibold text-xs">
                                {auth.user?.name?.charAt(0).toUpperCase()}
                            </span>
                            <span className="text-sm text-brand-navy/70">{auth.user?.name}</span>
                            <Link href={route('logout')} method="post" as="button"
                                className="text-xs text-brand-navy/50 hover:text-brand-navy px-2 py-1 rounded hover:bg-brand-navy/5 transition">
                                Logout
                            </Link>
                        </div>

                        <button className="sm:hidden p-2 text-brand-navy/60 hover:text-brand-navy rounded-md"
                            onClick={() => setMobileOpen(v => !v)}>
                            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                {mobileOpen
                                    ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                                    : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/>
                                }
                            </svg>
                        </button>
                    </div>
                </div>

                {mobileOpen && (
                    <div className="sm:hidden border-t border-gray-100 px-4 py-3 space-y-1">
                        {navLinks.map(({ label, href, match }) => (
                            <Link key={label} href={href}
                                className={`block px-3 py-2 rounded-md text-sm font-medium ${route().current(match) ? 'bg-brand-green/15 text-brand-green' : 'text-brand-navy/70 hover:text-brand-navy hover:bg-brand-navy/5'}`}>
                                {label}
                            </Link>
                        ))}
                        <div className="pt-3 border-t border-gray-100 flex justify-between text-sm">
                            <span className="text-gray-500">{auth.user?.name}</span>
                            <Link href={route('logout')} method="post" as="button" className="text-gray-400 hover:text-gray-700">Logout</Link>
                        </div>
                    </div>
                )}
            </nav>

            {header && (
                <div className="bg-white border-b border-gray-200">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">{header}</div>
                </div>
            )}

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {flash?.success && (
                    <div className="mb-4 px-4 py-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">{flash.success}</div>
                )}
                {flash?.error && (
                    <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">{flash.error}</div>
                )}
                {children}
            </main>
        </div>
    );
}
