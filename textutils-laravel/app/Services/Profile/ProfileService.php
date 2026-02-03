<?php

namespace App\Services\Profile;

use App\Models\User;
use App\Services\Auth\PasswordService;

class ProfileService
{
    public function changePassword(
        User $user,
        string $newPassword
    ): void {
        app(PasswordService::class)
            ->updatePassword($user, $newPassword);
    }
}
