<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name', 'email', 'password', 'company_id', 'employee_id', 'role',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function isAdmin(): bool    { return $this->role === 'admin'; }
    public function isHR(): bool       { return in_array($this->role, ['admin', 'hr']); }
    public function isManager(): bool  { return $this->role === 'manager'; }
    public function isEmployee(): bool { return $this->role === 'employee'; }

    // HR and Managers can both approve requests, differentiated by hierarchy
    public function canApproveAsManager(): bool { return in_array($this->role, ['manager', 'admin', 'hr']); }

    public function company()  { return $this->belongsTo(Company::class); }
    public function employee() { return $this->belongsTo(Employee::class); }
}
