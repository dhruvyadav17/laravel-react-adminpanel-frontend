<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
// use Spatie\Permission\Models\Role;
// use Spatie\Permission\Models\Permission;
use App\Models\Role;
use App\Models\Permission;
use App\Traits\ApiResponse;

class RolePermissionController extends Controller
{
    use ApiResponse;

    public function roles()
    {
        return $this->success('Roles list', Role::all());
    }

    public function permissions()
    {
        return $this->success('Permissions list', Permission::all());
    }

    public function assignPermissions(Request $request, Role $role)
    {
        $request->validate([
            'permissions' => 'array|required',
        ]);

        $role->syncPermissions($request->permissions);

        return $this->success('Permissions assigned to role');
    }
}
