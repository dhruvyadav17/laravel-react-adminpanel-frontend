<?php

namespace App\Http\Controllers\Api\Auth;

use App\Http\Controllers\Api\BaseApiController;
use Illuminate\Http\Request;
use App\Http\Resources\UserResource;

class ProfileController extends BaseApiController
{
    public function __invoke(Request $request)
    {
        $user = $request->user()->load('roles');

        return $this->success('Profile fetched', [
            'user' => UserResource::make($user),
            'permissions' => $user
                ->getAllPermissions()
                ->pluck('name')
                ->values(),
        ]);
    }
}
