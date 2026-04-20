<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Company extends Model
{
    protected $fillable = ['name', 'slug', 'email', 'phone', 'address', 'industry', 'plan', 'is_active'];

    protected $casts = ['is_active' => 'boolean'];

    public function users() { return $this->hasMany(User::class); }
    public function employees() { return $this->hasMany(Employee::class); }
    public function departments() { return $this->hasMany(Department::class); }
    public function leaveTypes() { return $this->hasMany(LeaveType::class); }
}
