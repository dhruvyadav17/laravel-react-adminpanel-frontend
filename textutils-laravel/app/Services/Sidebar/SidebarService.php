<?php

namespace App\Services\Sidebar;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use App\Services\Role\RolePermissionResolver;

class SidebarService
{
    public function get(): array
    {
        $user = Auth::user();
        $version = Cache::get('permission_version', 1);

        return Cache::remember(
            "sidebar_{$user->id}_v{$version}",
            now()->addMinutes(10),
            fn () => $this->buildSidebar($user)
        );
    }

    protected function buildSidebar($user): array
    {
        $sidebar = config('sidebar');

        $permissions = RolePermissionResolver::for($user)->toArray();

        return collect($sidebar)
            ->map(fn ($group) => $this->transformGroup($group, $permissions, $user))
            ->filter(fn ($group) => ! empty($group['children']))
            ->values()
            ->toArray();
    }

    protected function canAccess(array $item, array $permissions, $user): bool
    {
        if ($user->hasRole('super-admin')) {
            return true;
        }

        if (! isset($item['permission']) && ! isset($item['role'])) {
            return true;
        }

        if (isset($item['permission'])) {
            return in_array($item['permission'], $permissions, true);
        }

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
