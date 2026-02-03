<?php

namespace App\Http\Controllers\Api\Auth;

use Carbon\Carbon;
use App\Models\User;
use App\Traits\ApiResponse;
use App\Http\Controllers\Controller;
use App\Services\User\UserCreatorService;
use App\Http\Requests\Auth\RegisterRequest;

class RegisterController extends Controller
{
    use ApiResponse;

public function __invoke(
    RegisterRequest $request,
    UserCreatorService $creator
) {
    $user = $creator->register(
        $request->validated()
    );

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
