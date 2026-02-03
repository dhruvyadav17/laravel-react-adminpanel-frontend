<?php

namespace App\Services\Permission;

use App\Models\Permission;
use Spatie\Permission\PermissionRegistrar;

class PermissionService
{
    /**
     * 🔹 Grouped permissions for UI (Role/User modal)
     *
     * Return format:
     * [
     *   "User" => [{ id, name }],
     *   "Role" => [{ id, name }],
     * ]
     */
    public function grouped(): array
    {
        return Permission::query()
            ->where('is_active', true)
            ->whereNull('deleted_at')
            ->orderBy('group_name')
            ->orderBy('name')
            ->get()
            ->groupBy('group_name')
            ->map(fn ($items) =>
                $items->map(fn ($p) => [
                    'id'   => $p->id,
                    'name' => $p->name,
                ])
            )
            ->toArray();
    }

    /**
     * 🔹 Flat permissions list (Permissions page)
     */
    public function flat()
    {
        return Permission::query()
            ->select('id', 'name', 'group_name')
            ->orderBy('group_name')
            ->orderBy('name')
            ->get();
    }

    /**
     * Create permission
     */
    public function create(array $data): Permission
    {
        $permission = Permission::create([
            'name'       => $data['name'],
            'group_name' => $data['group_name'],
            'guard_name' => 'api',
            'is_active'  => true,
        ]);

        app(PermissionRegistrar::class)->forgetCachedPermissions();

        return $permission;
    }

    /**
     * Update permission
     */
    public function update(Permission $permission, array $data): Permission
    {
        $permission->update([
            'name'       => $data['name'],
            'group_name' => $data['group_name'],
        ]);

        app(PermissionRegistrar::class)->forgetCachedPermissions();

        return $permission;
    }

    /**
     * Delete permission (soft delete)
     */
    public function delete(Permission $permission): void
    {
        $permission->delete();
        app(PermissionRegistrar::class)->forgetCachedPermissions();
    }

    /**
     * Enable / Disable permission
     */
    public function toggle(Permission $permission): Permission
    {
        $permission->update([
            'is_active' => ! $permission->is_active,
        ]);

        return $permission;
    }
}
