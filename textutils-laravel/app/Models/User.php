<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\SoftDeletes;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;

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

    /* ==========================================================
     | IMPERSONATION RULES
     ========================================================== */

    /**
     * Can start impersonation?
     * - Only admin / super-admin
     * - Must be verified
     * - Must be active
     */
    public function canImpersonate(): bool
    {
        return $this->isAdmin()
            && $this->hasVerifiedEmail()
            && $this->is_active;
    }

    /**
     * Can be impersonated?
     * - Never super-admin
     * - Never self
     */
    public function canBeImpersonated(): bool
    {
        return ! $this->hasRole('super-admin');
    }
}
