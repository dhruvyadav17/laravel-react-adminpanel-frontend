<?php

namespace App\Exceptions;

use Throwable;
use App\Traits\ApiResponse;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
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

    /**
     * 🔥 CENTRAL API EXCEPTION HANDLER
     */
    public function render($request, Throwable $e)
    {
        // 🔐 UNAUTHENTICATED (401)
        if ($e instanceof AuthenticationException) {
            return $this->error(
                'Please login to continue',
                null,
                401
            );
        }

        // ⛔ UNAUTHORIZED / SPATIE (403)
        if ($e instanceof AuthorizationException) {
            return $this->error(
                $e->getMessage() ?: 'You are not authorized',
                null,
                403
            );
        }

        // ❌ VALIDATION (422)
        if ($e instanceof ValidationException) {
            return $this->error(
                'Validation error',
                $e->errors(),
                422
            );
        }

        // 🔍 MODEL NOT FOUND (404)
        if ($e instanceof ModelNotFoundException) {
            return $this->error(
                'Resource not found',
                null,
                404
            );
        }

        return parent::render($request, $e);
    }
}
