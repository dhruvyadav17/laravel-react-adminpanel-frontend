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
        return Role::with('parent')
            ->withCount('permissions')
            ->orderBy('name')
            ->get();
    }

    public function create(array $data): Role
    {
        $role = Role::create([
            'name'       => $data['name'],
            'guard_name' => 'api',
            'parent_id'  => $data['parent_id'] ?? null,
        ]);

        RolePermissionResolver::clearAll();
        app(PermissionRegistrar::class)->forgetCachedPermissions();

        return $role;
    }

    public function update(Role $role, array $data): Role
    {
        if ($role->name === 'super-admin') {
            abort(403, 'Super-admin cannot be modified');
        }

        if (
            isset($data['parent_id']) &&
            $this->createsCycle($role, $data['parent_id'])
        ) {
            abort(422, 'Circular role hierarchy detected');
        }

        $role->update([
            'name'      => $data['name'],
            'parent_id' => $data['parent_id'] ?? null,
        ]);

        RolePermissionResolver::clearAll();
        app(PermissionRegistrar::class)->forgetCachedPermissions();

        return $role;
    }

    protected function createsCycle(Role $role, ?int $parentId): bool
    {
        while ($parentId) {
            if ($parentId === $role->id) {
                return true;
            }

            $parent = Role::find($parentId);
            $parentId = $parent?->parent_id;
        }

        return false;
    }

    public function syncPermissions(Role $role, array $permissions = []): void
    {
        if ($role->name === 'super-admin') {
            abort(403, 'Super-admin permissions cannot be modified');
        }

        $old = $role->permissions->pluck('name')->toArray();

        $role->syncPermissions($permissions);

        AuditService::log(
            'role-permissions-updated',
            $role,
            ['old' => $old, 'new' => $permissions]
        );

        RolePermissionResolver::clearAll();
        app(PermissionRegistrar::class)->forgetCachedPermissions();
    }

    public function permissions(Role $role): array
    {
        return [
            'role' => $role,
            'permissions' => Permission::orderBy('group_name')
                ->orderBy('name')
                ->get()
                ->groupBy('group_name')
                ->map(fn ($items) =>
                    $items->map(fn ($p) => [
                        'id'   => $p->id,
                        'name' => $p->name,
                    ])
                ),
            'assigned' => $role->permissions->pluck('name')->values(),
            'inherited' => RolePermissionResolver::forRole($role->parent)
                ->diff($role->permissions->pluck('name'))
                ->values(),
        ];
    }
}
