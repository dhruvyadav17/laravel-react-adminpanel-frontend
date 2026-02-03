<?php

namespace App\Services\Role;

use App\Models\User;
use App\Models\Role as AppRole;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Cache;
use Spatie\Permission\Models\Role as SpatieRole;

class RolePermissionResolver
{
    /* ================= CACHE KEYS ================= */

    protected static function roleCacheKey(int $roleId): string
    {
        return "role_permissions_{$roleId}";
    }

    protected static function userCacheKey(int $userId): string
    {
        return "user_permissions_{$userId}";
    }

    /* ================= PUBLIC API ================= */

    public static function for(User $user): Collection
    {
        return self::forUser($user);
    }

    public static function forUser(User $user): Collection
    {
        return Cache::remember(
            self::userCacheKey($user->id),
            now()->addMinutes(10),
            fn () => self::resolveForUser($user)
        );
    }

    public static function forRole(?AppRole $role): Collection
    {
        if (! $role) {
            return collect();
        }

        return Cache::remember(
            self::roleCacheKey($role->id),
            now()->addMinutes(10),
            fn () => self::resolveRolePermissions($role)
        );
    }

    /* ================= CACHE CLEAR ================= */

    public static function clearRoleCache(AppRole $role): void
    {
        Cache::forget(self::roleCacheKey($role->id));
    }

    public static function clearUserCache(User $user): void
    {
        Cache::forget(self::userCacheKey($user->id));
    }

    public static function clearAll(): void
    {
        Cache::flush(); // safe for admin systems
    }

    /* ================= INTERNAL ================= */

    protected static function resolveForUser(User $user): Collection
    {
        $permissions = collect();

        foreach ($user->roles as $spatieRole) {
            /** @var SpatieRole $spatieRole */
            $role = AppRole::find($spatieRole->id);

            if ($role) {
                $permissions = $permissions->merge(
                    self::forRole($role) // 🔥 role cache reuse
                );
            }
        }

        return $permissions->unique()->values();
    }

    protected static function resolveRolePermissions(
        AppRole $role,
        array $visited = []
    ): Collection {
        if (in_array($role->id, $visited, true)) {
            return collect();
        }

        $visited[] = $role->id;

        // Direct permissions
        $permissions = $role->permissions->pluck('name');

        // Inherited permissions
        if ($role->parent) {
            $permissions = $permissions->merge(
                self::resolveRolePermissions($role->parent, $visited)
            );
        }

        return $permissions;
    }
}
