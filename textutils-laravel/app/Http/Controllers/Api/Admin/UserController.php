<?php

namespace App\Http\Controllers\Api\Admin;

use App\Models\User;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use App\Services\User\UserService;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreUserRequest;
use App\Http\Requests\Admin\UpdateUserRequest;

class UserController extends Controller
{
    use ApiResponse;

    // ✅ LIST USERS
    public function index()
    {
        return $this->success(
            'Users list',
            User::with('roles')->latest()->get()
        );
    }

    // ✅ ADD USER
    public function store(StoreUserRequest $request, UserService $service)
    {
        return $this->success(
            'User created',
            $service->create($request->validated()),
            201
        );
    }

    public function update(UpdateUserRequest $request, User $user, UserService $service)
    {
        return $this->success(
            'User updated',
            $service->update($user, $request->validated())
        );
    }

    // ✅ SOFT DELETE USER
    public function destroy(User $user)
    {
        $user->delete();

        return $this->success(
            'User deleted successfully'
        );
    }

    public function assignRole(Request $request, User $user)
    {
        $data = $request->validate([
            'roles'   => 'array',
            'roles.*' => 'exists:roles,name',
        ]);

        $roles = $data['roles'] ?? [];

        /**
         * 🔒 RULE:
         * super-admin role ko assign / remove nahi kar sakte
         */
        if (
            in_array('super-admin', $roles) ||
            $user->hasRole('super-admin')
        ) {
            return $this->error(
                'Super admin role cannot be assigned or removed',
                null,
                403
            );
        }

        // ✅ baaki roles freely sync honge
        $user->syncRoles($roles);

        return $this->success(
            'Roles updated successfully',
            $user->load('roles')
        );
    }


    public function roles(User $user)
    {
        return $this->success(
            'User roles fetched',
            $user->roles->pluck('name')
        );
    }
}
