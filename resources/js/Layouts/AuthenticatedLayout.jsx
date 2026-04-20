import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';

function NavItem({ href, active, children }) {
    return (
        <Link
            href={href}
            className={`inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md transition-colors duration-150 ${
                active
                    ? 'bg-brand-green/15 text-brand-green font-semibold'
                    : 'text-brand-navy/70 hover:text-brand-navy hover:bg-brand-navy/5'
            }`}
        >
            {children}
        </Link>
    );
}

export default function AuthenticatedLayout({ header, children }) {
    const { auth, flash } = usePage().props;
    const user = auth.user;
    const [mobileOpen, setMobileOpen] = useState(false);

    const navLinks = [
        { label: 'Dashboard',   href: route('dashboard'),              match: 'dashboard' },
        { label: 'Employees',   href: route('employees.index'),        match: 'employees.*' },
        { label: 'Departments', href: route('departments.index'),      match: 'departments.*' },
        { label: 'Attendance',  href: route('attendance.index'),       match: 'attendance.*' },
        { label: 'Payroll',     href: route('payroll.index'),          match: 'payroll.*' },
        { label: 'Leave',       href: route('leave-requests.index'),   match: 'leave-requests.*' },
        { label: 'Reports',     href: route('reports.index'),          match: 'reports.*' },
        { label: 'Shifts',      href: route('shift-schedules.index'),  match: 'shift-schedules.*' },
        { label: 'Users',       href: route('users.index'),            match: 'users.*' },
    ];

    return (
        <div className="min-h-screen bg-slate-100">
            <nav className="bg-white border-b border-gray-200 shadow-sm">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 items-center justify-between">
                        {/* Logo */}
                        <div className="flex items-center gap-8">
                            <Link href={route('dashboard')} className="flex items-center gap-3 shrink-0">
                                <ApplicationLogo className="h-9 w-auto" />
                                <div>
                                    <div className="font-bold text-lg leading-none tracking-tight">
                                        <span className="text-brand-navy">Pay</span>
                                        <span className="text-brand-green">gent</span>
                                    </div>
                                </div>
                            </Link>

                            {/* Desktop nav */}
                            <div className="hidden md:flex items-center gap-1">
                                {navLinks.map(({ label, href, match }) => (
                                    <NavItem key={label} href={href} active={route().current(match)}>{label}</NavItem>
                                ))}
                            </div>
                        </div>

                        {/* User menu */}
                        <div className="hidden sm:flex items-center">
                            <Dropdown>
                                <Dropdown.Trigger>
                                    <button className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-brand-navy/70 hover:text-brand-navy hover:bg-brand-navy/5 transition">
                                        <span className="flex items-center justify-center w-7 h-7 rounded-full bg-brand-green/20 text-brand-green font-semibold text-xs">
                                            {user.name?.charAt(0).toUpperCase()}
                                        </span>
                                        <span>{user.name}</span>
                                        <svg className="h-4 w-4 opacity-60" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"/>
                                        </svg>
                                    </button>
                                </Dropdown.Trigger>
                                <Dropdown.Content>
                                    <Dropdown.Link href={route('profile.edit')}>Profile</Dropdown.Link>
                                    <Dropdown.Link href={route('logout')} method="post" as="button">Log Out</Dropdown.Link>
                                </Dropdown.Content>
                            </Dropdown>
                        </div>

                        {/* Mobile burger */}
                        <button
                            className="sm:hidden p-2 text-brand-navy/60 hover:text-brand-navy rounded-md"
                            onClick={() => setMobileOpen(v => !v)}
                        >
                            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                {mobileOpen
                                    ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                                    : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/>
                                }
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Mobile menu */}
                {mobileOpen && (
                    <div className="sm:hidden border-t border-gray-100 px-4 py-3 space-y-1">
                        {navLinks.map(({ label, href, match }) => (
                            <Link key={label} href={href}
                                className={`block px-3 py-2 rounded-md text-sm font-medium ${route().current(match) ? 'bg-brand-green/15 text-brand-green' : 'text-brand-navy/70 hover:text-brand-navy hover:bg-brand-navy/5'}`}>
                                {label}
                            </Link>
                        ))}
                        <div className="pt-3 border-t border-gray-100 flex justify-between text-sm">
                            <span className="text-gray-500">{user.name}</span>
                            <Link href={route('logout')} method="post" as="button" className="text-gray-400 hover:text-gray-700">Log Out</Link>
                        </div>
                    </div>
                )}
            </nav>

            {header && (
                <header className="bg-white border-b border-gray-200">
                    <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">{header}</div>
                </header>
            )}

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {flash?.success && <div className="mb-4 px-4 py-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">{flash.success}</div>}
                {flash?.error   && <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">{flash.error}</div>}
                {children}
            </main>
        </div>
    );
}
