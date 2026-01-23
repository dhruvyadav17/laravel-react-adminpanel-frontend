<?php

namespace App\Http\Controllers\Api\Auth;

use App\Models\RefreshToken;
use App\Models\User;
use Illuminate\Http\Request;
use App\Traits\ApiResponse;
use App\Http\Controllers\Controller;

class RefreshTokenController extends Controller
{
    use ApiResponse;

    public function __invoke(Request $request)
    {
        $token = $request->input('refresh_token');

        $record = RefreshToken::where('token', $token)
            ->where('expires_at', '>', now())
            ->first();

        if (! $record) {
            return $this->error('Invalid refresh token', null, 401);
        }

        $user = User::find($record->user_id);

        $abilities = $user
            ->getAllPermissions()?->pluck('name')->toArray() ?? [];

        $accessToken = $user
            ->createToken('api', $abilities)
            ->plainTextToken;

        return $this->success('Token refreshed', [
            'token' => $accessToken,
        ]);
    }
}
