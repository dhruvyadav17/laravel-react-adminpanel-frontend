<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Role;

class RoleSeeder extends Seeder
{
    public function run(): void
    {
        $guard = 'api';

        $hierarchy = [
            'super-admin' => null,
            'admin'       => 'super-admin',
            'manager'     => 'admin',
            'user'        => 'manager',
        ];

        // 1️⃣ Create roles
        foreach ($hierarchy as $role => $parent) {
            Role::firstOrCreate([
                'name'       => $role,
                'guard_name' => $guard,
            ]);
        }

        // 2️⃣ Assign parents
        foreach ($hierarchy as $role => $parent) {
            if (! $parent) {
                continue;
            }

            $child  = Role::where('name', $role)->first();
            $parent = Role::where('name', $parent)->first();

            if ($child && $parent) {
                $child->update([
                    'parent_id' => $parent->id,
                ]);
            }
        }
    }
}
