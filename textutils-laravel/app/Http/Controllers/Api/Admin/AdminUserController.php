<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\CreateAdminRequest;
use App\Services\User\UserService;
use App\Traits\ApiResponse;
use Illuminate\Support\Facades\Log;

class AdminUserController extends Controller
{
    use ApiResponse;

    public function __construct(
        protected UserService $service
    ) {}

    /**
     * Create Admin / Manager
     * ----------------------
     * - Password auto generated (service)
     * - Role assigned (service)
     * - Email auto verified (service)
     * - Password returned ONCE
     */
    public function store(CreateAdminRequest $request)
    {
        $result = $this->service->createAdmin(
            $request->validated()
        );

        Log::info('AdminUserController@store', [
            'user_id' => $result['user']->id,
            'role'    => $request->role,
        ]);

        return $this->success(
            'Admin created successfully',
            [
                'email'    => $result['user']->email,
                'password' => $result['password'], // 🔥 show once only
            ],
            [],
            201
        );
    }
}
