<?php

namespace App\Http\Controllers\Api\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Services\Auth\LoginService;
use App\Traits\ApiResponse;

class LoginController extends Controller
{
    use ApiResponse;

    public function __invoke(LoginRequest $request, LoginService $service)
    {
        if (! config('features.login_rate_limit')) {
            return $this->error('Login temporarily disabled', null, 403);
        }

        return $this->success(
            'Login successful',
            $service->login($request->validated())
        );
    }
}
