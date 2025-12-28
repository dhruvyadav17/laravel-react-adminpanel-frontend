<?php

namespace App\Http\Controllers\Api\Admin;

use App\Models\User;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Traits\ApiResponse;
// // use Spatie\Permission\Models\Role;
// // use Spatie\Permission\Models\Permission;
// use App\Models\Role;
// use App\Models\Permission;

class UserController extends Controller
{
    use ApiResponse;

    // ✅ LIST USERS
    public function index()
    {
        return $this->success(
            'Users list',
            User::latest()->get()
        );
    }

    // ✅ ADD USER
    public function store(Request $request)
    {
        $data = $request->validate([
            'name'     => 'required|string',
            'email'    => 'required|email|unique:users,email',
            'password' => 'required|min:6',
        ]);

        $user = User::create([
            'name'     => $data['name'],
            'email'    => $data['email'],
            'password' => bcrypt($data['password']),
        ]);

        return $this->success(
            'User created successfully',
            $user,
            201
        );
    }

    // ✅ UPDATE USER
    public function update(Request $request, User $user)
    {
        $data = $request->validate([
            'name'  => 'required|string',
            'email' => 'required|email|unique:users,email,' . $user->id,
        ]);

        $user->update($data);

        return $this->success(
            'User updated successfully',
            $user
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
