<?php

namespace App\Http\Controllers\Api\Admin;

use App\Models\User;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Hash;
use App\Http\Controllers\Controller;
use App\Traits\ApiResponse;
use App\Http\Requests\Admin\CreateAdminRequest;
use App\Services\User\UserService;

class AdminUserController extends Controller
{
    use ApiResponse;

    public function store(CreateAdminRequest $request)
    {
        $password = Str::random(12);

        $user = User::create([
            'name'     => $request->name,
            'email'    => $request->email,
            'password' => Hash::make($password),
        ]);

        // ✅ assign admin role
        $user->assignRole($request->role);

        // verify email auto
        $user->markEmailAsVerified();

        return $this->success(
            'Admin created successfully',
            [
                'email'    => $user->email,
                'password' => $password, // show once
            ],
            [],
            201
        );
    }
}
UserService