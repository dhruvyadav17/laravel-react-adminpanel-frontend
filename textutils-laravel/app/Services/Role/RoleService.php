<?php

namespace App\Services\Role;

use App\Models\Role;
use App\Models\Permission;

class RoleService
{
    /**
     * Create new role
     */
    public function create(array $data): Role
    {
        return Role::create([
            'name'       => $data['name'],
            'guard_name' => 'api',
        ]);
    }

    /**
     * Update role
     */
    public function update(Role $role, array $data): Role
    {
        $role->update([
            'name' => $data['name'],
        ]);

        return $role;
    }

    /**
     * Delete role (with protection)
     */
    public function delete(Role $role): void
    {
        if ($role->name === 'super-admin') {
            abort(403, 'Super admin role cannot be deleted');
        }

        $role->delete();
    }

    /**
     * Enable / Disable role
     */
    public function toggle(Role $role): Role
    {
        if ($role->name === 'super-admin') {
            abort(403, 'Super admin role cannot be disabled');
        }

        $role->update([
            'is_active' => ! $role->is_active
        ]);

        return $role;
    }

    /**
     * Assign permissions to role
     */
    public function syncPermissions(Role $role, array $permissions = []): void
    {
        $role->syncPermissions($permissions);
    }

    /**
     * Role permissions data (UI helper)
     */
    public function permissions(Role $role): array
    {
        return [
            'role'        => $role,
            'permissions' => Permission::all(),
            'assigned'    => $role->permissions->pluck('name'),
        ];
    }
}
