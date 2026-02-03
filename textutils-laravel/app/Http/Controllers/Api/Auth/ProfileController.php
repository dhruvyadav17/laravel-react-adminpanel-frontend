<?php

namespace App\Http\Controllers\Api\Auth;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Traits\ApiResponse;
use App\Http\Resources\UserResource;

class ProfileController extends Controller
{
    use ApiResponse;


    public function __invoke(Request $request)
    {
        $user = $request->user()->load('roles');

        return $this->success('Profile fetched', [
            'user' => UserResource::make($user),

            'permissions' => $user
                ->getAllPermissions()
                ->pluck('name')
                ->values(),

            'email_verified' => ! is_null(
                $user->email_verified_at
            ),

            // 🔥 ADD THIS LINE
            'force_password_reset' => (bool) $user->force_password_reset,
        ]);
    }
}
