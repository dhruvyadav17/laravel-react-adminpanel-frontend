<?php

namespace App\Http\Controllers\Api\Admin;

use App\Models\User;
use App\Models\Permission;
use Illuminate\Http\Request;
use App\Services\User\UserService;
use App\Http\Resources\UserResource;
use App\Services\User\UserCreatorService;
use App\Http\Requests\Admin\StoreUserRequest;
use App\Http\Controllers\Api\BaseApiController;

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

    public function store(
        StoreUserRequest $request,
        UserCreatorService $creator
    ) {
        $creator->createByAdmin(
            $request->validated(),
            $request->input('role') // null allowed
        );

        return $this->success(
            'User created. Password setup email sent.',
            [
                'role' => $request->input('role'),
            ]
        );
    }

    /* ================= ARCHIVE ================= */

    public function destroy(User $user)
    {
        $this->service->delete($user);

        return $this->success('User archived successfully');
    }

    public function restore(User $user)
    {
        $this->service->restore($user);

        return $this->success('User restored successfully');
    }

    /* ================= STATUS TOGGLE 🆕 ================= */

    public function toggleStatus(User $user)
    {
        $user->update([
            'is_active' => ! $user->is_active,
        ]);

        return $this->success(
            'User status updated successfully',
            ['is_active' => $user->is_active]
        );
    }

    /* ================= FORCE PASSWORD RESET 🆕 ================= */

    public function forcePasswordReset(User $user)
    {
        $this->service->forcePasswordReset($user);

        return $this->success(
            'Force password reset updated',
            ['force_password_reset' => $user->force_password_reset]
        );
    }

    /* ================= ROLES ================= */

    public function assignRole(Request $request, User $user)
    {
        $data = $request->validate([
            'roles'   => ['array'],
            'roles.*' => ['string', 'exists:roles,name'],
        ]);

        $this->service->assignRoles($user, $data['roles'] ?? []);

        return $this->success('Roles assigned successfully', [
            'roles' => $user->getRoleNames()->values(),
        ]);
    }

    /* ================= PERMISSIONS ================= */

    public function permissions(User $user)
    {
        return $this->success('User permissions', [
            'permissions' => Permission::select('id', 'name')->orderBy('name')->get(),
            'assigned'    => $user->getAllPermissions()->pluck('name')->values(),
        ]);
    }

    public function assignPermissions(Request $request, User $user)
    {
        $data = $request->validate([
            'permissions'   => ['array'],
            'permissions.*' => ['string', 'exists:permissions,name'],
        ]);

        $this->service->assignPermissions($user, $data['permissions'] ?? []);

        return $this->success('Permissions updated successfully', [
            'assigned' => $user->getAllPermissions()->pluck('name')->values(),
        ]);
    }
}
