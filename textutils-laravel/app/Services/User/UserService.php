<?php

namespace App\Services\User;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\PermissionRegistrar;
use App\Services\Audit\AuditService;

class UserService
{
    public function paginate(Request $request): array
    {
        $users = User::withTrashed()
            ->with('roles')
            ->when(
                $request->filled('search'),
                fn ($q) =>
                    $q->where('name', 'like', "%{$request->search}%")
                      ->orWhere('email', 'like', "%{$request->search}%")
            )
            ->latest()
            ->paginate(10);

        return [
            'data' => $users->items(),
            'meta' => [
                'current_page' => $users->currentPage(),
                'last_page'    => $users->lastPage(),
                'per_page'     => $users->perPage(),
                'total'        => $users->total(),
            ],
        ];
    }

    public function delete(User $user): void
    {
        $user->delete();
    }

    public function restore(User $user): void
    {
        $user->restore();
    }

    /* ================= STATUS TOGGLE 🆕 ================= */

    public function toggleStatus(User $user): void
    {
        $user->update([
            'is_active' => ! $user->is_active,
        ]);

        AuditService::log(
            'user-status-updated',
            $user,
            ['is_active' => $user->is_active]
        );
    }

    /* ================= FORCE PASSWORD RESET 🆕 ================= */

    public function forcePasswordReset(User $user): void
    {
        $user->update([
            'force_password_reset' => ! $user->force_password_reset,
        ]);

        AuditService::log(
            'user-force-password-reset',
            $user,
            ['force' => $user->force_password_reset]
        );
    }

    /* ================= ROLES ================= */

    public function assignRoles(User $user, array $roles): void
    {
        $oldRoles = $user->getRoleNames()->toArray();

        $user->syncRoles($roles);
        $user->load('roles');

        AuditService::log('user-roles-updated', $user, [
            'old' => $oldRoles,
            'new' => $roles,
        ]);

        app(PermissionRegistrar::class)->forgetCachedPermissions();
    }

    /* ================= PERMISSIONS ================= */

    public function assignPermissions(User $user, array $permissions): void
    {
        $old = $user->getAllPermissions()->pluck('name')->toArray();

        $user->syncPermissions($permissions);

        AuditService::log('user-permissions-updated', $user, [
            'old' => $old,
            'new' => $permissions,
        ]);

        app(PermissionRegistrar::class)->forgetCachedPermissions();
    }
}
