<?php

namespace App\Exceptions;

use Throwable;
use App\Traits\ApiResponse;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpKernel\Exception\HttpExceptionInterface;

class Handler extends ExceptionHandler
{
    use ApiResponse;

    /**
     * The list of the inputs that are never flashed to the session.
     */
    protected $dontFlash = [
        'current_password',
        'password',
        'password_confirmation',
    ];

    /**
     * Register the exception handling callbacks.
     */
    public function register(): void
    {
        /**
         * 🛑 AUTHORIZATION ERROR (403)
         * -------------------------------------------------
         * permission / policy / gate failures
         */
        $this->renderable(function ( AuthorizationException $e, $request ) {
            if ($request->is('api/*')) {
                return $this->error(
                    'Forbidden',
                    null,
                    403
                );
            }
        });

        /**
         * 🧨 HTTP EXCEPTIONS (custom abort())
         * -------------------------------------------------
         * abort(403), abort(404), abort(500) etc.
         */
        $this->renderable(function ( HttpExceptionInterface $e, $request ) {
            if ($request->is('api/*')) {
                return $this->error(
                    $e->getMessage() ?: 'Server error',
                    null,
                    $e->getStatusCode()
                );
            }
        });

        /**
         * 🔥 FALLBACK (500)
         * -------------------------------------------------
         * Any unhandled exception
         */
        $this->renderable(function ( Throwable $e, $request ) {
            if ($request->is('api/*')) {
                return $this->error(
                    'Internal server error',
                    null,
                    500
                );
            }
        });
    }

    /**
     * 🔐 UNAUTHENTICATED (401)
     * -------------------------------------------------
     * Sanctum / auth middleware
     */
    protected function unauthenticated( $request,  AuthenticationException $exception ) {
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
     * -------------------------------------------------
     * FormRequest / Validator failures
     */
    protected function invalidJson( $request, ValidationException $exception ) {
        return $this->error(
            'Validation failed',
            $exception->errors(),
            422
        );
    }
}
