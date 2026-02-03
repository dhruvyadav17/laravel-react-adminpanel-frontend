<?php
namespace App\Services\User;

use App\Models\User;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;

class UserCreatorService
{
    /**
     * Self registration (frontend user)
     */
    public function register(array $data): User
    {
        return $this->create(
            data: $data,
            role: 'user',
            mode: 'self'
        );
    }

    /**
     * Admin creates user/admin
     */
    public function createByAdmin(array $data, ?string $role = null): User
    {
        return $this->create(
            data: $data,
            role: $role ?: 'user', // ✅ DEFAULT ROLE
            mode: 'admin'
        );
    }

    /**
     * Core creator (PRIVATE)
     */
    public function create(
        array $data,
        string $role,
        string $mode // self | admin
    ): User {
        return DB::transaction(function () use ($data, $role, $mode) {

            $password = $mode === 'self'
                ? Hash::make($data['password'])
                : Hash::make(Str::random(16));

            $user = User::create([
                'name' => $data['name'],
                'email' => $data['email'],
                'password' => $password,

                'is_active' => true,
                'force_password_reset' => $mode === 'admin',

                'password_expires_at' =>
                    config('features.password_expiry') && $mode === 'self'
                        ? Carbon::now()->addDays(90)
                        : null,

                'email_verified_at' =>
                    config('features.email_verification') && $mode === 'self'
                        ? null
                        : now(),
            ]);

            $user->assignRole($role);

            // if ($mode === 'admin') {
            //     Password::sendResetLink([
            //         'email' => $user->email,
            //     ]);
            // }

            // if (
            //     $mode === 'self' &&
            //     config('features.email_verification')
            // ) {
            //     $user->sendEmailVerificationNotification();
            // }

            return $user;
        });
    }
}
