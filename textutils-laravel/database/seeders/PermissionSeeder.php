<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;

class PermissionSeeder extends Seeder
{
    public function run(): void
    {
        $guard = 'api';

        /* ================= BASE PERMISSIONS ================= */
        foreach (config('permissions') as $group) {
            foreach ($group as $permission) {
                Permission::firstOrCreate([
                    'name'       => $permission,
                    'guard_name' => $guard,
                ]);
            }
        }

        /* ================= SYSTEM / ADMIN PERMISSIONS ================= */
        $systemPermissions = [
            'admin-impersonate',   // 🔥 REQUIRED for impersonation
        ];

        foreach ($systemPermissions as $permission) {
            Permission::firstOrCreate([
                'name'       => $permission,
                'guard_name' => $guard,
            ]);
        }
    }
}
