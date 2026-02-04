<?php

namespace App\Http\Controllers\Api\Auth;

use App\Models\User;
use App\Http\Controllers\Controller;
use App\Traits\ApiResponse;
use App\Http\Requests\Auth\RegisterRequest;
use Carbon\Carbon;

class RegisterController extends Controller
{
    use ApiResponse;

    public function __invoke(RegisterRequest $request)
    {
        $user = User::create([
            ...$request->validated(),
            'password'              => bcrypt($request->password),
            'is_active'             => true,
            'force_password_reset'  => false,
            'password_expires_at'   => config('features.password_expiry')
                ? Carbon::now()->addDays(90)
                : null,
            'email_verified_at'     => config('features.email_verification')
                ? null
                : now(),
        ]);

        // 🔒 DEFAULT ROLE
        $user->assignRole('user');

        // 📧 EMAIL VERIFICATION
        if (config('features.email_verification')) {
            $user->sendEmailVerificationNotification();
        }

        // 🧾 AUDIT LOG (future safe)
        activity('auth')
            ->performedOn($user)
            ->withProperties([
                'ip' => request()->ip(),
                'agent' => request()->userAgent(),
            ])
            ->log('User registered');

        return $this->success(
            config('features.email_verification')
                ? 'Registered successfully. Please verify your email.'
                : 'Registered successfully',
            null,
            [],
            201
        );
    }
}
