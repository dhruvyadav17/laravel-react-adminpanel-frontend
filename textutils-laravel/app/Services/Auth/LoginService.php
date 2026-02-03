<?php

namespace App\Services\Auth;

use App\Models\User;
use App\Traits\HandlesLoginAttempts;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use App\Services\Audit\AuditService;
use App\Services\Role\RolePermissionResolver;

class LoginService
{
    use HandlesLoginAttempts;

    public function login(array $data): array
    {
        $user = User::where('email', $data['email'])->first();

        /* ❌ USER NOT FOUND */
        if (! $user) {
            throw ValidationException::withMessages([
                'email' => ['Invalid credentials'],
            ]);
        }

        /* 🔒 CHECK ACCOUNT LOCK */
        $this->ensureAccountIsNotLocked($user);

        /* ❌ INVALID PASSWORD */
        if (! Hash::check($data['password'], $user->password)) {
            $this->recordFailedLogin($user, request());

            throw ValidationException::withMessages([
                'email' => ['Invalid credentials'],
            ])->errorBag('login')->status(422);
        }

        /* ❌ ACCOUNT DISABLED */
        if (! $user->is_active) {
            throw ValidationException::withMessages([
                'email' => ['Account is disabled'],
            ]);
        }

        /* ❌ EMAIL NOT VERIFIED */
        if (
            config('features.email_verification') &&
            ! $user->hasVerifiedEmail()
        ) {
            throw ValidationException::withMessages([
                'email' => ['Email not verified'],
            ]);
        }

        /* ✅ RESET FAILED ATTEMPTS */
        $this->resetLoginAttempts($user);

        /* 🔑 RESOLVED PERMISSIONS (ROLE HIERARCHY AWARE) */
        $abilities = RolePermissionResolver::for($user)
            ->pluck('name')
            ->toArray();

        $token = $user
            ->createToken('api', $abilities)
            ->plainTextToken;

        /* 🕒 LOGIN META */
        $user->update([
            'last_login_at' => now(),
            'last_login_ip' => request()->ip(),
        ]);

        /* 🧾 AUDIT LOG */
        AuditService::log(
            'login',
            $user,
            ['success' => true]
        );

        return [
            'token' => $token,
            'force_password_reset' => (bool) $user->force_password_reset,
        ];
    }
}
