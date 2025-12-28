<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\PermissionRegistrar;

class PermissionSeeder extends Seeder
{
    public function run(): void
    {
        app(PermissionRegistrar::class)->forgetCachedPermissions();

        $guard = 'api';

        $permissions = [
            // users
            'user-view',
            'user-create',
            'user-edit',
            'user-delete',
            'user-restore',

            // roles
            'role-view',
            'role-create',
            'role-edit',
            'role-delete',
            'role-manage',

            // permissions
            'permission-assign',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate([
                'name' => $permission,
                'guard_name' => $guard,
            ]);
        }
    }
}
