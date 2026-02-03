<?php

namespace App\Http\Controllers\Api\Admin;

use App\Models\User;
use App\Traits\ApiResponse;
use Illuminate\Support\Str;
use App\Services\User\UserService;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Hash;
use App\Services\User\UserCreatorService;
use App\Http\Requests\Admin\CreateAdminRequest;

class AdminUserController extends Controller
{
    use ApiResponse;

    public function store(
        CreateAdminRequest $request,
        UserCreatorService $creator
    ) {
        $user = $creator->create(
            $request->validated(),
            $request->role // admin / manager
        );

        return $this->success(
            'Admin created successfully',
            [
                'email'    => $user->email,
            ],
            [],
            201
        );
    }
}
