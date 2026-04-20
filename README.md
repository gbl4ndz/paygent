# Paygent

A Philippine HR and payroll management system built with Laravel 12, Inertia.js, and React.

## Features

- **Multi-role access** — HR Admin, Manager, and Employee portal
- **Employee management** — profiles, departments, shift schedules
- **Attendance tracking** — time logs with manager approval workflow
- **Leave management** — leave types, balances, requests, and approvals
- **Philippine payroll** — automatic SSS, PhilHealth, Pag-IBIG, and withholding tax computation
- **Payslips** — employee self-service payslip view
- **Reports** — payroll and attendance reporting

## Tech Stack

- **Backend:** PHP 8.2+, Laravel 12, Laravel Sanctum
- **Frontend:** React 18, Inertia.js 2, Tailwind CSS 3, Headless UI
- **Build:** Vite 7

## Requirements

- PHP >= 8.2
- Composer
- Node.js >= 18
- A database (MySQL, PostgreSQL, or SQLite)

## Getting Started

```bash
git clone https://github.com/gbl4ndz/paygent.git
cd paygent
composer run setup
```

This runs `composer install`, generates the app key, runs migrations, installs npm packages, and builds assets.

Configure your database in `.env` before running migrations.

## Development

```bash
composer run dev
```

Starts Laravel, queue worker, log viewer (Pail), and Vite dev server concurrently.

## Testing

```bash
composer run test
```

## Roles

| Role | Access |
|------|--------|
| `hr_admin` | Full system access — employees, payroll, reports, settings |
| `manager` | Attendance and leave approvals for their team |
| `employee` | Self-service portal — attendance, leave requests, payslips |

## Philippine Payroll Deductions

Computed automatically based on 2024 contribution tables:

- **SSS** — 4.5% of Monthly Salary Credit (₱4,000–₱30,000 bracket)
- **PhilHealth** — 5% of basic salary, employee share 2.5% (₱500–₱2,500 cap)
- **Pag-IBIG** — 2% of salary (max ₱200 employee share)
- **Withholding Tax** — TRAIN Law brackets on taxable income

## License

MIT
