<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Api\BaseApiController;
use App\Http\Requests\Admin\CreateAdminRequest;
use App\Services\User\UserService;
use Illuminate\Support\Facades\Log;

class AdminUserController extends BaseApiController
{
    public function __construct(
        protected UserService $service
    ) {}

    public function store(CreateAdminRequest $request)
    {
        $result = $this->service->createAdmin(
            $request->validated()
        );

        Log::info('Admin created', [
            'user_id' => $result['user']->id,
            'role'    => $request->role,
        ]);

        return $this->success(
            'Admin created successfully',
            [
                'email'    => $result['user']->email,
                'password' => $result['password'], // show once
            ],
            [],
            201
        );
    }
}
