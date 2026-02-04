<?php

namespace App\Http\Controllers\Api\Auth;

use App\Http\Controllers\Api\BaseApiController;
use App\Http\Requests\Auth\RefreshTokenRequest;
use App\Services\Auth\RefreshTokenService;

class RefreshTokenController extends BaseApiController
{
    public function __invoke(
        RefreshTokenRequest $request,
        RefreshTokenService $service
    ) {
        return $this->success(
            'Token refreshed successfully',
            $service->refresh($request->validated())
        );
    }
}
