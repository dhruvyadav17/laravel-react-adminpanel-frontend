<?php

namespace App\Services\Auth;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class LoginService
{
    public function login(array $data): array
    {
        $user = User::where('email', $data['email'])->first();

        /* ❌ INVALID CREDENTIALS */
        if (! $user || ! Hash::check($data['password'], $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Invalid credentials'],
            ]);
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

        /* 🔑 TOKEN */
        $abilities = $user
            ->getAllPermissions()
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

        /* ✅ IMPORTANT: expose force_password_reset */
        return [
            'token' => $token,
            'force_password_reset' => (bool) $user->force_password_reset,
        ];
    }
}
