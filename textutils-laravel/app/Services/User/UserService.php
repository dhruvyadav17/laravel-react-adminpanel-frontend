<?php
namespace App\Services\User;

use App\Models\User;

class UserService
{
    public function create(array $data): User
    {
        return User::create([
            ...$data,
            'password' => bcrypt($data['password'])
        ]);
    }

    public function update(User $user, array $data): User
    {
        $user->update($data);
        return $user;
    }
}
