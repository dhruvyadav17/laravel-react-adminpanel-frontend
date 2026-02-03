<?php

namespace App\Http\Controllers\Api\Password;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Password;
use App\Http\Controllers\Controller;
use App\Traits\ApiResponse;
use App\Services\Auth\PasswordService;
use DomainException;

class ResetPasswordController extends Controller
{
    use ApiResponse;

    /**
     * POST /api/reset-password
     */
    public function __invoke(
        Request $request,
        PasswordService $passwordService
    ) {
        // ✅ Basic request validation
        $data = $request->validate([
            'email'    => 'required|email',
            'token'    => 'required',
            'password' => 'required|min:8|confirmed',
        ]);

        try {
            // 🔐 Laravel password broker (token validation etc.)
            $status = Password::reset(
                $data,
                function ($user, $password) use ($passwordService) {

                    // 🔥 ALL business logic moved to service
                    $passwordService->updatePassword(
                        $user,
                        $password
                    );
                }
            );
        }
        // 🧠 BUSINESS RULE VIOLATION (password reuse, expiry, etc.)
        catch (DomainException $e) {
            return $this->error(
                $e->getMessage(),
                [],
                422
            );
        }

        // ✅ SUCCESS
        if ($status === Password::PASSWORD_RESET) {
            return $this->success(
                'Password reset successful'
            );
        }

        // ❌ TOKEN / EMAIL ERROR
        return $this->error(
            'Password reset failed',
            ['email' => __($status)],
            422
        );
    }
}
