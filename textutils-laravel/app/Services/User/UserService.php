<?php
namespace App\Services\User;

use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UserService
{
    public function create(array $data)
    {
        return DB::transaction(function () use ($data) {

            // 🔥 REMOVE NON-COLUMNS (DOUBLE SAFETY)
            //unset($data['roles'], $data['password_confirmation']);

            // ✅ Create user
            $user = User::create([
                'name' => $data['name'],
                'email' => $data['email'],
                'password' => Hash::make($data['password']),
            ]);

            // ✅ Assign roles via Spatie
            // if (!empty($data['roles'] ?? [])) {
            //     $user->syncRoles($data['roles']);
            // }

            return $user;
        });
    }

    public function update(User $user, array $data): User
    {
        $user->update($data);
        return $user;
    }
}
