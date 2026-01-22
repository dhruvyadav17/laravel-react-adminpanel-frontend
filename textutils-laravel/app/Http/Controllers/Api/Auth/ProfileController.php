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

            // 🔑 SINGLE SOURCE OF TRUTH FOR RBAC
            'permissions' => $user
                ->getAllPermissions()
                ->pluck('name')
                ->values(), // ensure clean array
        ]);
    }
}
