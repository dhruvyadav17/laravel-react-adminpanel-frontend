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

        if (! $user || ! Hash::check($data['password'], $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Invalid credentials'],
            ]);
        }

        // 🔒 inactive user
        if (! $user->is_active) {
            throw ValidationException::withMessages([
                'email' => ['Account is disabled'],
            ]);
        }

        // 🔐 email verification
        if (
            config('features.email_verification') &&
            ! $user->hasVerifiedEmail()
        ) {
            throw ValidationException::withMessages([
                'email' => ['Email not verified'],
            ]);
        }

        // 🔑 token
        $abilities = $user->getAllPermissions()
            ->pluck('name')
            ->toArray();

        $token = $user->createToken('api', $abilities)->plainTextToken;

        // 🕒 login meta
        $user->update([
            'last_login_at' => now(),
            'last_login_ip' => request()->ip(),
        ]);

        return [
            'token' => $token,
        ];
    }
}
