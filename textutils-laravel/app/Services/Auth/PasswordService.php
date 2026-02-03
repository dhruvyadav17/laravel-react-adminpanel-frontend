<?php

namespace App\Services\Auth;

use App\Models\User;
use App\Models\PasswordHistory;
use Illuminate\Support\Facades\Hash;

class PasswordService
{
    public function updatePassword(User $user, string $newPassword): void
    {
        // 🔐 Enforce reuse rule
        app(PasswordPolicyService::class)
            ->ensureNotReused($user, $newPassword);

        // 🔁 Save old password hash
        PasswordHistory::create([
            'user_id'    => $user->id,
            'password'   => $user->password,
            'created_at' => now(),
        ]);

        // 🔄 Update password
        $user->update([
            'password'             => Hash::make($newPassword),
            'password_changed_at'  => now(),
            'force_password_reset' => false,
        ]);
    }
}
