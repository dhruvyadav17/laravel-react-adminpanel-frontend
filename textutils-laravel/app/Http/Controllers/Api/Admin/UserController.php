<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Api\BaseApiController;
use App\Http\Requests\Admin\StoreUserRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use App\Models\Permission; // ✅ FIX: REQUIRED IMPORT
use App\Services\User\UserService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class UserController extends BaseApiController
{
    public function __construct(
        protected UserService $service
    ) {}

    /* ================= LIST ================= */

    public function index(Request $request)
    {
        $result = $this->service->paginate($request);

        return $this->success(
            'Users fetched successfully',
            UserResource::collection($result['data']),
            $result['meta']
        );
    }

    /* ================= CREATE ================= */

    public function store(StoreUserRequest $request)
    {
        $user = $this->service->create(
            $request->validated()
        );

        Log::info('User created', [
            'user_id' => $user->id,
            'email'   => $user->email,
        ]);

        return $this->success(
            'User created successfully',
            new UserResource($user),
            [],
            201
        );
    }

    /* ================= ARCHIVE ================= */

    public function destroy(User $user)
    {
        $this->service->delete($user);

        return $this->success(
            'User archived successfully',
            null
        );
    }

    /* ================= RESTORE ================= */

    public function restore(User $user)
    {
        $this->service->restore($user);

        return $this->success(
            'User restored successfully',
            null
        );
    }

    /* ================= ROLES ================= */

    public function assignRole(Request $request, User $user)
    {
        $data = $request->validate([
            'roles'   => ['array'],
            'roles.*' => ['string', 'exists:roles,name'],
        ]);

        $this->service->assignRoles(
            $user,
            $data['roles'] ?? []
        );

        return $this->success(
            'Roles assigned successfully',
            [
                'roles' => $user->getRoleNames()->values(),
            ]
        );
    }

    /* ================= PERMISSIONS ================= */

    public function permissions(User $user)
    {
        return $this->success(
            'User permissions fetched',
            [
                'permissions' => Permission::query()
                    ->select('id', 'name')
                    ->orderBy('name')
                    ->get(),

                'assigned' => $user
                    ->getAllPermissions()
                    ->pluck('name')
                    ->values(),
            ]
        );
    }

    public function assignPermissions(Request $request, User $user)
    {
        $data = $request->validate([
            'permissions'   => ['array'],
            'permissions.*' => ['string', 'exists:permissions,name'],
        ]);

        $this->service->assignPermissions(
            $user,
            $data['permissions'] ?? []
        );

        return $this->success(
            'Permissions updated successfully',
            [
                'assigned' => $user
                    ->getAllPermissions()
                    ->pluck('name')
                    ->values(),
            ]
        );
    }
}
