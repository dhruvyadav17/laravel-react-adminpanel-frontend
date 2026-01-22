<?php

namespace App\Http\Controllers\Api\Admin;

use App\Models\User;
use App\Models\Permission;
use Illuminate\Http\Request;
use App\Services\User\UserService;
use App\Http\Resources\UserResource;
use App\Http\Requests\Admin\StoreUserRequest;
use App\Http\Controllers\Api\BaseApiController;

class UserController extends BaseApiController
{
    public function __construct(
        protected UserService $service
    ) {}

    public function index(Request $request)
    {
        $result = $this->service->paginate($request);

        return $this->success(
            'Users fetched successfully',
            UserResource::collection($result['data']),
            $result['meta']
        );
    }

    public function store(StoreUserRequest $request)
    {
        $user = $this->service->create($request->validated());

        return $this->success(
            'User created successfully',
            new UserResource($user)
        );
    }

    public function destroy(User $user)
    {
        $this->service->delete($user);

        return $this->success('User archived successfully');
    }

    public function restore(User $user)
    {
        //var_dump('restoring user'); exit;
        $this->service->restore($user);

        return $this->success(
            'User restored successfully',
            null // 🔥 EXPLICIT NULL
        );
    }

    /* ================= ROLES ================= */

    public function assignRole(Request $request, User $user)
    {
        $data = $request->validate([
            'roles' => ['array'],
            'roles.*' => ['string', 'exists:roles,name'],
        ]);

        // 🔥 SYNC ROLES
        $user->syncRoles($data['roles'] ?? []);

        // 🔥 reload relations
        $user->load('roles');

        return $this->success(
            'Roles assigned successfully',
            [
                'roles' => $user->getRoleNames(),
            ]
        );
    }

    /* ================= PERMISSIONS ================= */

    public function permissions(User $user)
    {
        return $this->success('User permissions', [
            'permissions' => Permission::select('id', 'name')->get(),
            'assigned' => $user->getAllPermissions()->pluck('name'),
        ]);
    }

    public function assignPermissions(Request $request, User $user)
    {
        $data = $request->validate([
            'permissions' => ['array'],
            'permissions.*' => ['string', 'exists:permissions,name'],
        ]);

        $user->syncPermissions($data['permissions'] ?? []);

        return $this->success(
            'Permissions updated successfully',
            [
                'assigned' => $user->getAllPermissions()->pluck('name'),
            ]
        );
    }



}
