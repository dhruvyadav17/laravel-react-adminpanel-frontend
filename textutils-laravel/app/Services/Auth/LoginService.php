<?php

namespace App\Services\Auth;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use App\Models\RefreshToken;
use Illuminate\Support\Str;
class LoginService
{
    public function login(array $data): array
    {
        $user = User::where('email', $data['email'])->first();

        if (! $user || ! Hash::check($data['password'], $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Invalid credentials']
            ]);
        }

        $abilities = $user->getAllPermissions()?->pluck('name')->toArray() ?? [];

        $accessToken = $user->createToken('api', $abilities)->plainTextToken;

        $remember = $data['remember'] ?? false;

        $refresh = RefreshToken::create([
            'user_id' => $user->id,
            'token' => hash('sha256', Str::random(60)),
            'expires_at' => now()->addDays($remember ? 30 : 7),
        ]);

        return [
            'token' => $accessToken,
            'refresh_token' => $refresh->token,
            'user' => $user,
            'roles' => $user->getRoleNames(),
            'permissions' => $abilities,
        ];
    }
}
