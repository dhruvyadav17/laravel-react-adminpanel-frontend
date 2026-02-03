<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;

class PermissionSeeder extends Seeder
{
    public function run(): void
    {
        $guard = 'api';

        /*
        |--------------------------------------------------------------------------
        | Permissions Seeder
        |--------------------------------------------------------------------------
        | config/permissions.php
        | key   => group (User, Role, System)
        | value => permissions list
        |--------------------------------------------------------------------------
        */

        foreach (config('permissions') as $group => $permissions) {
            foreach ($permissions as $permission) {
                Permission::updateOrCreate(
                    [
                        'name'       => $permission,
                        'guard_name' => $guard,
                    ],
                    [
                        // ✅ CORRECT COLUMN
                        'group_name' => ucfirst($group),
                        'is_active'  => true,
                    ]
                );
            }
        }
    }
}
