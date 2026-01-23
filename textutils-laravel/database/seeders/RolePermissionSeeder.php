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

        /* SUPER ADMIN → ALL */
        $superAdmin?->syncPermissions(
            Permission::where('guard_name', $guard)->get()
        );

        /* ADMIN → LIMITED */
        $admin?->syncPermissions([
            'user-view',
            'user-create',
            'user-edit',
            'user-delete',

            'role-manage',
            'permission-manage',
        ]);

        /* MANAGER → SUB ADMIN */
        $manager?->syncPermissions([
            'user-view',
            'user-edit',
        ]);

        /* USER → BASIC */
        $user?->syncPermissions([]);
    }
}
