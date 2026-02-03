<?php
// app/Services/Auth/PasswordPolicyService.php
namespace App\Services\Auth;

use App\Models\User;
use Illuminate\Support\Facades\Hash;

class PasswordPolicyService
{
    public function ensureNotReused(
        User $user,
        string $newPassword
    ): void {
        $limit = config('security.password.history_limit', 5);

        $recentPasswords = $user->passwordHistories()
            ->latest('created_at')
            ->limit($limit)
            ->pluck('password');

        foreach ($recentPasswords as $oldHash) {
            if (Hash::check($newPassword, $oldHash)) {
                throw new \DomainException(
                    "You cannot reuse your last {$limit} passwords."
                );
            }
        }
    }
}
