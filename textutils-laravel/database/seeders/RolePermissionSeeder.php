<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RolePermissionSeeder extends Seeder
{
    public function run(): void
    {
        $guard = 'api';

        $superAdmin = Role::where('name', 'super-admin')->first();
        $admin      = Role::where('name', 'admin')->first();
        $manager    = Role::where('name', 'manager')->first();
        $user       = Role::where('name', 'user')->first();

        /* =========================================================
         | SUPER ADMIN → FULL ACCESS (NO LIMITS)
         ========================================================= */
        if ($superAdmin) {
            $superAdmin->syncPermissions(
                Permission::where('guard_name', $guard)->get()
            );
        }

        /* =========================================================
         | ADMIN → LIMITED ADMIN (SYSTEM + USER MGMT)
         ========================================================= */
        if ($admin) {
            $admin->syncPermissions([
                // Users
                'user-view',
                'user-create',
                'user-update',
                'user-delete',
                'user-assign-role',
                'user-assign-permission',

                // RBAC
                'role-manage',
                'permission-manage',

                // 🔥 SYSTEM
                'admin-impersonate',
            ]);
        }

        /* =========================================================
         | MANAGER → SUB ADMIN (NO SYSTEM POWERS)
         ========================================================= */
        if ($manager) {
            $manager->syncPermissions([
                'user-view',
                'user-update',
            ]);
        }

        /* =========================================================
         | USER → BASIC
         ========================================================= */
        if ($user) {
            $user->syncPermissions([]);
        }
    }
}
