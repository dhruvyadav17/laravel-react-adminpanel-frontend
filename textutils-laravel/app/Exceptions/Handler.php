<?php

namespace App\Exceptions;

use Throwable;
use App\Traits\ApiResponse;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Illuminate\Validation\ValidationException;

class Handler extends ExceptionHandler
{
    use ApiResponse;

    protected $dontFlash = [
        'current_password',
        'password',
        'password_confirmation',
    ];

public function register(): void
{
    $this->renderable(function (
        \Illuminate\Auth\Access\AuthorizationException $e,
        $request
    ) {
        if ($request->is('api/*')) {
            return $this->error(
                $e->getMessage() ?: 'You are not authorized',
                null,
                403
            );
        }
    });
}


    /**
     * 🔐 UNAUTHENTICATED (401)
     * Sanctum / Auth middleware
     */
protected function unauthenticated(
    $request,
    AuthenticationException $exception
) {
    if ($request->is('api/*')) {
        return $this->error(
            'Please login to continue',
            null,
            401
        );
    }

    return redirect()->guest(route('login'));
}

    /**
     * ❌ VALIDATION ERROR (422)
     */
    protected function invalidJson(
        $request,
        ValidationException $exception
    ) {
        return $this->error(
            'Validation error',
            $exception->errors(),
            422
        );
    }
}
