<?php

namespace App\Http\Controllers\Api\Admin;

use App\Models\User;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use App\Services\User\UserService;
use App\Http\Controllers\Controller;
use Spatie\Permission\Models\Permission;
use App\Http\Requests\Admin\StoreUserRequest;
use App\Http\Requests\Admin\UpdateUserRequest;

class UserController extends Controller
{
    use ApiResponse;

    // ✅ LIST USERS
    public function index(Request $request)
    {
        $query = User::withTrashed()->with('roles');

        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'like', "%{$request->search}%")
                ->orWhere('email', 'like', "%{$request->search}%");
            });
        }

        $users = $query->latest()->paginate(10);

        return $this->success(
            'Users list',
            $users->items(),
            200,
            [
                'current_page' => $users->currentPage(),
                'last_page'    => $users->lastPage(),
                'total'        => $users->total(),
            ]
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
        $user->delete(); // soft delete

        return $this->success(
            'User archived successfully'
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
        // if (
        //     in_array('super-admin', $roles) ||
        //     $user->hasRole('super-admin')
        // ) {
        //     return $this->error(
        //         'Super admin role cannot be assigned or removed',
        //         null,
        //         403
        //     );
        // }

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

    public function permissions($id)
    {
        $user = User::findOrFail($id);

        return $this->success(
            'User permissions fetched',
            [
                'user_id' => $user->id,

                // ✅ ALL permissions (for checkbox list)
                'permissions' => Permission::select('id', 'name')
                    ->orderBy('name')
                    ->get(),

                // ✅ User ke assigned permissions (role + direct)
                'assigned' => $user
                    ->getAllPermissions()
                    ->pluck('name')
                    ->values(),
            ]
        );
    }

    public function assignPermissions(Request $request, $id)
    {
        $request->validate([
            'permissions' => ['array'],
            'permissions.*' => ['string', 'exists:permissions,name'],
        ]);

        $user = User::findOrFail($id);

        // direct permissions sync (roles untouched)
        $user->syncPermissions($request->permissions ?? []);

        return $this->success('Permissions updated');
    }

    // app/Http/Controllers/Api/Admin/UserController.php

    public function restore($id)
    {
        $user = User::withTrashed()->findOrFail($id);
        $user->restore();

        return $this->success(
            'User restored successfully',
            $user
        );
    }

}
