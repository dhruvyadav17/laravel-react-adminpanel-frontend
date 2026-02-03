<?php

namespace App\Services\Role;

use App\Models\Role;
use App\Models\Permission;
use Spatie\Permission\PermissionRegistrar;
use App\Services\Audit\AuditService;

class RoleService
{
    public function list()
    {
        return Role::withCount('permissions')
            ->orderBy('name')
            ->get();
    }

    public function create(array $data): Role
    {
        $role = Role::create([
            'name'       => $data['name'],
            'guard_name' => 'api',
        ]);

        app(PermissionRegistrar::class)->forgetCachedPermissions();

        return $role;
    }

    public function update(Role $role, array $data): Role
    {
        if ($role->name === 'super-admin') {
            abort(403, 'Super admin role cannot be modified');
        }

        $role->update([
            'name' => $data['name'],
        ]);

        app(PermissionRegistrar::class)->forgetCachedPermissions();

        return $role;
    }

    public function delete(Role $role): void
    {
        if ($role->name === 'super-admin') {
            abort(403, 'Super admin role cannot be deleted');
        }

        $role->delete();

        app(PermissionRegistrar::class)->forgetCachedPermissions();
    }

    public function toggle(Role $role): Role
    {
        if ($role->name === 'super-admin') {
            abort(403, 'Super admin role cannot be disabled');
        }

        $role->update([
            'is_active' => ! $role->is_active,
        ]);

        return $role;
    }

    public function syncPermissions(Role $role, array $permissions = []): void
    {
        if ($role->name === 'super-admin') {
            abort(403, 'Super admin permissions cannot be modified');
        }

        $old = $role->permissions->pluck('name')->toArray();

        $role->syncPermissions($permissions);

        AuditService::log(
            'role-permissions-updated',
            $role,
            [
                'old' => $old,
                'new' => $permissions,
            ]
        );

        app(PermissionRegistrar::class)->forgetCachedPermissions();
    }

    public function permissions(Role $role): array
    {
        return [
            'role'        => $role,
            'permissions' => Permission::select('id', 'name')
                ->orderBy('name')
                ->get(),
            'assigned'    => $role->permissions
                ->pluck('name')
                ->values(),
        ];
    }
}
