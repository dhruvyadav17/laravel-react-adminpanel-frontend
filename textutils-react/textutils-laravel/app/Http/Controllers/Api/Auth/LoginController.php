<?php

namespace App\Http\Controllers\Api\Auth;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Http\Controllers\Controller;
use App\Traits\ApiResponse;

class LoginController extends Controller
{
    use ApiResponse;

    public function __invoke(Request $request)
    {
        $data = $request->validate([
            'email'    => 'required|email',
            'password' => 'required'
        ]);

        $user = User::where('email', $data['email'])->first();

        if (!$user || !Hash::check($data['password'], $user->password)) {
            return $this->error(
                'Invalid credentials',
                ['email' => ['Email or password incorrect']],
                401
            );
        }

        // 🔴 IMPORTANT FIX #1: Old tokens revoke (optional but recommended)
        $user->tokens()->delete();

        // 🔴 IMPORTANT FIX #2: Create Sanctum token
        $token = $user->createToken('sanctum-token')->plainTextToken;

        // 🔴 IMPORTANT FIX #3: Send permissions (Spatie)
        $permissions = $user->getAllPermissions()->pluck('name');

        return $this->success(
            'Login successful',
            [
                'token'       => $token,
                'user'        => $user,
                'permissions' => $permissions,
            ]
        );
    }
}
