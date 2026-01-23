<?php

namespace App\Http\Controllers\Api\Auth;

use App\Models\User;
use App\Http\Controllers\Controller;
use App\Traits\ApiResponse;
use App\Http\Requests\Auth\RegisterRequest;

class RegisterController extends Controller
{
    use ApiResponse;

    public function __invoke(RegisterRequest $request)
    {
        $user = User::create([
            ...$request->validated(),
            'password' => bcrypt($request->password),
        ]);

        // ✅ USER ONLY
        $user->assignRole('user');

        // ✅ Email verification (STEP-3)
        $user->sendEmailVerificationNotification();

        return $this->success(
            'Registered successfully. Please verify your email.',
            null,
            [],
            201
        );
    }
}
