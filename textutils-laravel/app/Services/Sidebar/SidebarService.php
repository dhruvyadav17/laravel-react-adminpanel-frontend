<?php

namespace App\Services\Sidebar;

use Illuminate\Support\Facades\Auth;
use App\Services\Role\RolePermissionResolver;

class SidebarService
{
    public function get(): array
    {
        $user = Auth::user();
        $sidebar = config('sidebar');

        // 🔥 Resolve effective permissions once
        $permissions = RolePermissionResolver::for($user)
            ->pluck('name')
            ->toArray();

        return collect($sidebar)
            ->map(fn ($group) => $this->transformGroup($group, $permissions, $user))
            ->filter(fn ($group) => ! empty($group['children']))
            ->values()
            ->toArray();
    }

    protected function canAccess(array $item, array $permissions, $user): bool
    {
        // 🔥 SUPER ADMIN = SEE EVERYTHING
        if ($user->hasRole('super-admin')) {
            return true;
        }
        // No restriction
        if (! isset($item['permission']) && ! isset($item['role'])) {
            return true;
        }

        // Permission based (ROLE HIERARCHY AWARE ✅)
        if (isset($item['permission'])) {
            return in_array($item['permission'], $permissions, true);
        }

        // Role based (direct role check only)
        if (isset($item['role'])) {
            return $user->hasAnyRole((array) $item['role']);
        }

        return false;
    }

    protected function transformGroup(array $group, array $permissions, $user): array
    {
        return [
            'label' => $group['label'],
            'icon'  => $group['icon'] ?? 'fas fa-circle',
            'children' => collect($group['children'] ?? [])
                ->filter(fn ($item) => $this->canAccess($item, $permissions, $user))
                ->map(fn ($item) => [
                    'label'  => $item['label'],
                    'path'   => $item['route'] ?? null,
                    'action' => $item['action'] ?? null,
                ])
                ->values()
                ->toArray(),
        ];
    }
}
