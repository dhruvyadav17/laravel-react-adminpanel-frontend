<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;
// use Spatie\Permission\Models\Role;
// use Spatie\Permission\Models\Permission;
use App\Models\Role;
use App\Models\Permission;

class RoleController extends Controller
{
    use ApiResponse;

    public function index()
    {
        return $this->success(
            'Roles fetched',
            Role::withCount('permissions')->get()
        );
    }

    public function show(Role $role)
    {
        return $this->success(
            'Role details',
            $role->load('permissions')
        );
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|unique:roles,name',
        ]);

        $role = Role::create([
            'name' => $data['name'],
            'guard_name' => 'api',
        ]);

        return $this->success('Role created', $role, 201);
    }

    public function update(Request $request, Role $role)
    {
        $data = $request->validate([
            'name' => 'required|unique:roles,name,' . $role->id,
        ]);

        $role->update($data);

        return $this->success('Role updated', $role);
    }

    public function destroy(Role $role)
    {
        if ($role->name === 'super-admin') {
            return $this->error('Super admin role cannot be deleted', null, 403);
        }

        $role->delete();
        return $this->success('Role deleted');
    }

    // enable / disable
    public function toggle(Role $role)
    {
        if ($role->name === 'super-admin') {
            return $this->error('Super admin role cannot be disabled', null, 403);
        }

        $role->update([
            'is_active' => !$role->is_active
        ]);

        return $this->success('Role status updated', $role);
    }

    // all permissions + assigned
    public function permissions(Role $role)
    {
        return $this->success('Role permissions', [
            'role' => $role,
            'permissions' => Permission::all(),
            'assigned' => $role->permissions->pluck('name'),
        ]);
    }

    public function assignPermissions(Request $request, Role $role)
    {
        $data = $request->validate([
            'permissions' => 'array',
            'permissions.*' => 'exists:permissions,name',
        ]);

        $role->syncPermissions($data['permissions'] ?? []);

        return $this->success('Permissions updated');
    }
}
