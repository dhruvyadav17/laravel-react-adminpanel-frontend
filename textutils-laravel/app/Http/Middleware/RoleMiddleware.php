<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use App\Traits\ApiResponse;

class RoleMiddleware
{
    use ApiResponse;
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle($request, \Closure $next, ...$roles)
    {
        if (! $request->user()?->hasAnyRole($roles)) {
            return $this->error(
                'Forbidden',
                null,
                403
            );
        }

        return $next($request);
    }
}
