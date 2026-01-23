<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ImpersonationController extends Controller
{
    use ApiResponse;

    /**
     * START IMPERSONATION
     * ---------------------------------------------
     * Admin / Super Admin → Login as another user
     */
    public function start(Request $request, User $user)
    {
        $admin = $request->user();

        /* ================= SECURITY ================= */

        if (! $admin->canImpersonate()) {
            return $this->error(
                'You are not allowed to impersonate users',
                [],
                403
            );
        }

        if ($admin->id === $user->id) {
            return $this->error(
                'You cannot impersonate yourself',
                [],
                422
            );
        }

        if (! $user->canBeImpersonated()) {
            return $this->error(
                'This user cannot be impersonated',
                [],
                403
            );
        }

        /* ================= IMPERSONATION ================= */

        DB::transaction(function () use ($admin, $user, &$token) {
            // Revoke admin token
            $admin->currentAccessToken()?->delete();

            // Create impersonation token
            $token = $user->createToken(
                'impersonation',
                array_merge(
                    $user->getAllPermissions()
                        ->pluck('name')
                        ->toArray(),
                    [
                        'impersonating',
                        'impersonated_by:' . $admin->id,
                    ]
                )
            );
        });

        return $this->success(
            'Impersonation started',
            [
                'token' => $token->plainTextToken,
                'impersonated_user' => $user->only([
                    'id',
                    'name',
                    'email',
                ]),
                'impersonated_by' => $admin->only([
                    'id',
                    'name',
                    'email',
                ]),
            ]
        );
    }

    /**
     * EXIT IMPERSONATION
     * ---------------------------------------------
     * Return back to original admin
     */
    public function stop(Request $request)
    {
        $token = $request->user()?->currentAccessToken();

        if (! $token) {
            return $this->error(
                'Invalid token',
                [],
                401
            );
        }

        $abilities = $token->abilities ?? [];

        $impersonatedBy = collect($abilities)
            ->first(fn ($a) => str_starts_with($a, 'impersonated_by:'));

        if (! $impersonatedBy) {
            return $this->error(
                'You are not impersonating',
                [],
                422
            );
        }

        $adminId = (int) str_replace(
            'impersonated_by:',
            '',
            $impersonatedBy
        );

        $admin = User::find($adminId);

        if (! $admin) {
            return $this->error(
                'Original admin not found',
                [],
                404
            );
        }

        // Delete impersonation token
        $token->delete();

        // Create fresh admin token
        $newToken = $admin->createToken(
            'api',
            $admin->getAllPermissions()
                ->pluck('name')
                ->toArray()
        );

        return $this->success(
            'Impersonation exited',
            [
                'token' => $newToken->plainTextToken,
                'user'  => $admin->only([
                    'id',
                    'name',
                    'email',
                ]),
            ]
        );
    }
}
