<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\PermissionRegistrar;

class RolesAndPermissionsSeeder extends Seeder
{
    public function run(): void
    {
        // 🔄 clear cached roles & permissions
        app(PermissionRegistrar::class)->forgetCachedPermissions();

        $guard = 'api';

        /*
        |--------------------------------------------------------------------------
        | PERMISSIONS
        |--------------------------------------------------------------------------
        */
        $permissions = [
            // Users
            'user-view',
            'user-create',
            'user-edit',
            'user-delete',
            'user-restore',

            // Roles
            'role-view',
            'role-create',
            'role-edit',
            'role-delete',
            'role-manage',

            // Permissions
            'permission-assign',
        ];

        foreach ($permissions as $permission) {
            Permission::create([
                'name' => $permission,
                'guard_name' => $guard,
            ]);
        }

        /*
        |--------------------------------------------------------------------------
        | ROLES
        |--------------------------------------------------------------------------
        */
        $superAdmin = Role::create([
            'name' => 'super-admin',
            'guard_name' => $guard,
        ]);

        $admin = Role::create([
            'name' => 'admin',
            'guard_name' => $guard,
        ]);

        $user = Role::create([
            'name' => 'user',
            'guard_name' => $guard,
        ]);

        /*
        |--------------------------------------------------------------------------
        | ASSIGN PERMISSIONS TO ROLES
        |--------------------------------------------------------------------------
        */
        $superAdmin->syncPermissions(
            Permission::where('guard_name', $guard)->get()
        );

        $admin->syncPermissions([
            'user-view',
            'user-create',
            'user-edit',
            'role-view',
            'role-create',
        ]);
    }
}
