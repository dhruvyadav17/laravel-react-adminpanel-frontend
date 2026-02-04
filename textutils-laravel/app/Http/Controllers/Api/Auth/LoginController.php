<?php

namespace App\Http\Controllers\Api\Auth;

use App\Services\Auth\LoginService;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Controllers\Api\BaseApiController;

class LoginController extends BaseApiController
{
    public function __invoke(
        LoginRequest $request,
        LoginService $service
    ) {
        return $this->success(
            'Login successful',
            $service->login($request->validated())
        );
    }
}
