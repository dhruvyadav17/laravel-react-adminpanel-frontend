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

        foreach ($hierarchy as $role => $parent) {
            Role::firstOrCreate([
                'name'       => $role,
                'guard_name' => $guard,
            ]);
        }

        foreach ($hierarchy as $role => $parent) {
            if (! $parent) continue;

            Role::where('name', $role)->update([
                'parent_id' => Role::where('name', $parent)->value('id'),
            ]);
        }
    }
}
