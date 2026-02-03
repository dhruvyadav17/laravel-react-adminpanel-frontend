<?php
namespace App\Services\User;

use App\Models\User;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;

class UserCreatorService
{
    public function create(array $data, string $role): User
    {
        $password = Str::random(16);

        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($password),
            'force_password_reset' => true,
            'email_verified_at' => now(),
        ]);

        $user->assignRole($role);

        // 🔥 SEND PASSWORD RESET LINK
        Password::sendResetLink(['email' => $user->email]);

        return $user;
    }
}
