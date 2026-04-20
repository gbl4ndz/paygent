<?php

use App\Http\Controllers\AttendanceController;
use App\Http\Controllers\DepartmentController;
use App\Http\Controllers\HRDashboardController;
use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\LeaveRequestController;
use App\Http\Controllers\LeaveTypeController;
use App\Http\Controllers\PayrollController;
use App\Http\Controllers\PayrollSettingController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\ShiftScheduleController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\Portal;
use App\Http\Controllers\Manager;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin'      => Route::has('login'),
        'canRegister'   => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion'    => PHP_VERSION,
    ]);
});

// HR / Admin routes
Route::middleware(['auth', 'verified'])->group(function () {

    Route::get('/dashboard', function () {
        if (auth()->user()->isEmployee()) return redirect()->route('portal.dashboard');
        if (auth()->user()->isManager())  return redirect()->route('manager.dashboard');
        return app(HRDashboardController::class)->index();
    })->name('dashboard');

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::middleware('role:admin,hr')->group(function () {
        Route::resource('departments', DepartmentController::class)->except('show');
        Route::resource('employees', EmployeeController::class)->except('show');
        Route::get('attendance/employee/{employee}', [AttendanceController::class, 'employeeSummary'])->name('attendance.employee');
        Route::put('attendance/{attendance}/logs', [AttendanceController::class, 'updateLogs'])->name('attendance.logs.update');
        Route::resource('attendance', AttendanceController::class)->except('show');
        Route::post('attendance/{attendance}/approve', [AttendanceController::class, 'approve'])->name('attendance.approve');
        Route::post('attendance/{attendance}/reject', [AttendanceController::class, 'reject'])->name('attendance.reject');
        Route::resource('payroll', PayrollController::class)->except('show');
        Route::post('payroll/compute-deductions', [PayrollController::class, 'computeDeductions'])->name('payroll.compute-deductions');
        Route::get('/reports', [ReportController::class, 'index'])->name('reports.index');

        // Leave management
        Route::resource('leave-types', LeaveTypeController::class)->except('show');
        Route::resource('leave-requests', LeaveRequestController::class)->only(['index', 'show', 'destroy']);
        Route::post('leave-requests/{leaveRequest}/approve', [LeaveRequestController::class, 'approve'])->name('leave-requests.approve');
        Route::post('leave-requests/{leaveRequest}/reject', [LeaveRequestController::class, 'reject'])->name('leave-requests.reject');

        // Shift schedules & payroll settings
        Route::resource('shift-schedules', ShiftScheduleController::class)->except('show');
        Route::get('payroll-settings', [PayrollSettingController::class, 'edit'])->name('payroll-settings.edit');
        Route::put('payroll-settings', [PayrollSettingController::class, 'update'])->name('payroll-settings.update');

        // User management
        Route::resource('users', UserController::class)->except('show');
    });
});

// Manager portal
Route::middleware(['auth', 'role:manager'])->prefix('manager')->name('manager.')->group(function () {
    Route::get('/', [Manager\DashboardController::class, 'index'])->name('dashboard');
    Route::get('/attendance', [Manager\AttendanceController::class, 'index'])->name('attendance');
    Route::get('/attendance/employee/{employee}', [Manager\AttendanceController::class, 'employeeSummary'])->name('attendance.employee');
    Route::put('/attendance/{attendance}/logs', [Manager\AttendanceController::class, 'updateLogs'])->name('attendance.logs.update');
    Route::post('/attendance/{attendance}/approve', [Manager\AttendanceController::class, 'approve'])->name('attendance.approve');
    Route::post('/attendance/{attendance}/reject', [Manager\AttendanceController::class, 'reject'])->name('attendance.reject');
    Route::get('/leave', [Manager\LeaveController::class, 'index'])->name('leave.index');
    Route::post('/leave/{leaveRequest}/approve', [Manager\LeaveController::class, 'approve'])->name('leave.approve');
    Route::post('/leave/{leaveRequest}/reject', [Manager\LeaveController::class, 'reject'])->name('leave.reject');
});

// Employee self-service portal
Route::middleware(['auth', 'role:employee'])->prefix('portal')->name('portal.')->group(function () {
    Route::get('/', [Portal\DashboardController::class, 'index'])->name('dashboard');
    Route::get('/attendance', [Portal\AttendanceController::class, 'index'])->name('attendance');
    Route::post('/attendance/clock-in',  [Portal\AttendanceController::class, 'clockIn'])->name('attendance.clock-in');
    Route::post('/attendance/clock-out', [Portal\AttendanceController::class, 'clockOut'])->name('attendance.clock-out');
    Route::post('/attendance/save', [Portal\AttendanceController::class, 'save'])->name('attendance.save');
    Route::post('/attendance/submit', [Portal\AttendanceController::class, 'submit'])->name('attendance.submit');
    Route::get('/payslips', [Portal\PayslipController::class, 'index'])->name('payslips');
    Route::get('/profile', [Portal\ProfileController::class, 'edit'])->name('profile');
    Route::put('/profile', [Portal\ProfileController::class, 'update'])->name('profile.update');
    Route::resource('/leave', Portal\LeaveController::class)->only(['index', 'create', 'store', 'destroy'])->names([
        'index'   => 'leave.index',
        'create'  => 'leave.create',
        'store'   => 'leave.store',
        'destroy' => 'leave.destroy',
    ]);
});

require __DIR__.'/auth.php';
