<?php

namespace App\Http\Controllers\Api\Auth;

use App\Models\RefreshToken;
use Illuminate\Http\Request;
use App\Traits\ApiResponse;
use App\Http\Controllers\Controller;

class RefreshTokenController extends Controller
{
    use ApiResponse;

    public function __invoke(Request $request)
    {
        if (! config('features.refresh_token')) {
            return $this->error(
                'Refresh token feature disabled',
                null,
                403
            );
        }

        $request->validate([
            'refresh_token' => ['required', 'string'],
        ]);

        $record = RefreshToken::active()
            ->where('token', $request->refresh_token)
            ->first();

        if (! $record) {
            return $this->error('Invalid or expired refresh token', null, 401);
        }

        $user = $record->user;

        // 🔒 Rotate token (single-use)
        $record->update([
            'revoked_at' => now(),
        ]);

        $abilities = $user
            ->getAllPermissions()
            ->pluck('name')
            ->toArray();

        $accessToken = $user
            ->createToken('api', $abilities)
            ->plainTextToken;

        return $this->success('Token refreshed successfully', [
            'token' => $accessToken,
        ]);
    }
}
