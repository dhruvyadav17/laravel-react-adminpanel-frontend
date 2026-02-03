<?php

namespace App\Models;

use App\Models\LoginAttempt;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable implements MustVerifyEmail
{
    use HasApiTokens,
        HasFactory,
        Notifiable,
        SoftDeletes,
        HasRoles;

    protected $guarded = [];

    protected $guard_name = 'api';

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    /* ==========================================================
     | ROLE HELPERS
     ========================================================== */

    public function isSuperAdmin(): bool
    {
        return $this->hasRole('super-admin');
    }

    public function isAdmin(): bool
    {
        return $this->isSuperAdmin()
            || $this->hasAnyRole(
                config('roles.admin_roles', [])
            );
    }

    public function passwordHistories()
    {
        return $this->hasMany(
            \App\Models\PasswordHistory::class
        );
    }

    public function loginAttempts()
    {
        return $this->hasMany(
            LoginAttempt::class
        );
    }

}
