<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;

class UserFactory extends Factory
{
    public function definition(): array
    {
        return [
            'name' => fake()->name(),
            'email' => fake()->unique()->safeEmail(),
            'email_verified_at' => now(),
            'password' => Hash::make('password'), // default
            'role' => 'user',
            'remember_token' => str()->random(10),
        ];
    }

    // 👑 Admin state
    public function admin(): static
    {
        return $this->state(fn () => [
            'role' => 'admin',
            'email' => 'admin@test.com',
        ]);
    }
}
