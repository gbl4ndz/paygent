<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('Users/Index', [
            'users' => User::with('employee')
                ->where('company_id', auth()->user()->company_id)
                ->latest()->get(),
        ]);
    }

    public function create()
    {
        return Inertia::render('Users/Create', [
            'employees' => Employee::whereDoesntHave('user')
                ->get(['id', 'first_name', 'last_name', 'employee_number']),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name'        => 'required|string|max:255',
            'email'       => 'required|email|unique:users',
            'password'    => 'required|min:8|confirmed',
            'role'        => 'required|in:admin,hr,employee',
            'employee_id' => 'nullable|exists:employees,id',
        ]);

        User::create([
            'company_id'  => auth()->user()->company_id,
            'name'        => $request->name,
            'email'       => $request->email,
            'password'    => Hash::make($request->password),
            'role'        => $request->role,
            'employee_id' => $request->employee_id,
        ]);

        return redirect()->route('users.index')->with('success', 'User created.');
    }

    public function edit(User $user)
    {
        abort_unless($user->company_id === auth()->user()->company_id, 403);
        return Inertia::render('Users/Edit', [
            'user'      => $user,
            'employees' => Employee::where(fn ($q) => $q->whereDoesntHave('user')->orWhere('id', $user->employee_id))
                ->get(['id', 'first_name', 'last_name', 'employee_number']),
        ]);
    }

    public function update(Request $request, User $user)
    {
        abort_unless($user->company_id === auth()->user()->company_id, 403);
        $request->validate([
            'name'        => 'required|string|max:255',
            'email'       => 'required|email|unique:users,email,' . $user->id,
            'role'        => 'required|in:admin,hr,employee',
            'employee_id' => 'nullable|exists:employees,id',
            'password'    => 'nullable|min:8|confirmed',
        ]);

        $data = $request->only('name', 'email', 'role', 'employee_id');
        if ($request->filled('password')) {
            $data['password'] = Hash::make($request->password);
        }
        $user->update($data);
        return redirect()->route('users.index')->with('success', 'User updated.');
    }

    public function destroy(User $user)
    {
        abort_unless($user->company_id === auth()->user()->company_id, 403);
        abort_if($user->id === auth()->id(), 403, 'Cannot delete your own account.');
        $user->delete();
        return redirect()->route('users.index')->with('success', 'User deleted.');
    }
}
