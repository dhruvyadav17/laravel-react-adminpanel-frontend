<?php

namespace App\Services\Role;

use App\Models\User;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Cache;
use Spatie\Permission\Models\Role;

class RolePermissionResolver
{
    /* ================= PUBLIC API ================= */

    /**
     * Universal entry point
     */
    public static function for(User $user): Collection
    {
        return self::forUser($user);
    }

    /**
     * Resolve permissions for a user (cached)
     */
    public static function forUser(User $user): Collection
    {
        return Cache::remember(
            "user_permissions_{$user->id}",
            now()->addMinutes(10),
            fn () => self::resolveForUser($user)
        );
    }

    /**
     * Resolve permissions for a role
     */
    public static function forRole(Role $role): Collection
    {
        return self::resolveRolePermissions($role);
    }

    /* ================= INTERNAL ================= */

    protected static function resolveForUser(User $user): Collection
    {
        $permissions = collect();

        // 👇 Spatie roles
        foreach ($user->roles as $role) {
            $permissions = $permissions->merge(
                self::resolveRolePermissions($role)
            );
        }

        return $permissions->unique()->values();
    }

    protected static function resolveRolePermissions(
        Role $role,
        array $visited = []
    ): Collection {
        // 🔒 Prevent circular hierarchy
        if (in_array($role->id, $visited, true)) {
            return collect();
        }

        $visited[] = $role->id;

        // Own permissions (Spatie relation)
        $permissions = $role
            ->permissions
            ->pluck('name');

        // 🔁 Inherit from parent (custom column)
        if ($role->parent_id) {
            $parent = Role::find($role->parent_id);

            if ($parent) {
                $permissions = $permissions->merge(
                    self::resolveRolePermissions($parent, $visited)
                );
            }
        }

        return $permissions;
    }
}
