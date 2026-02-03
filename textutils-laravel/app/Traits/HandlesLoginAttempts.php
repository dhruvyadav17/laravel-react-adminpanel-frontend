<?php

namespace App\Traits;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

trait HandlesLoginAttempts
{
    protected function ensureAccountIsNotLocked(User $user): void
    {
        if (
            $user->locked_until &&
            now()->lessThan($user->locked_until)
        ) {
            throw ValidationException::withMessages([
                'email' => [
                    'Account is temporarily locked. Try again later.',
                ],
            ])->status(423);
        }
    }

    protected function recordFailedLogin(User $user, Request $request): void
    {
        $maxAttempts = config('security.login.max_attempts');
        $lockMinutes = config('security.login.lock_minutes');

        $user->increment('failed_login_attempts');

        if ($user->failed_login_attempts >= $maxAttempts) {
            $user->update([
                'locked_until' => now()->addMinutes($lockMinutes),
            ]);
        }

        if (config('security.login.track_ip')) {
            $user->loginAttempts()->create([
                'ip_address' => $request->ip(),
                'user_agent' => $request->userAgent(),
                'attempted_at' => now(),
            ]);
        }
    }

    protected function resetLoginAttempts(User $user): void
    {
        if ($user->failed_login_attempts > 0 || $user->locked_until) {
            $user->update([
                'failed_login_attempts' => 0,
                'locked_until' => null,
            ]);
        }
    }
}
