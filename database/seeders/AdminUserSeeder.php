<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $adminEmail = (string) (config('install.seed.admin_email') ?? 'admin@example.com');
        $adminName = (string) (config('install.seed.admin_name') ?? 'Admin User');
        $adminPassword = (string) (config('install.seed.admin_password') ?? 'adminpassword');

        User::query()->updateOrCreate(
            ['email' => $adminEmail],
            [
                'name' => $adminName,
                'password' => Hash::make($adminPassword),
                'role' => User::ROLE_ADMIN,
                'email_verified_at' => now(),
            ]
        );

        if (! (bool) config('install.seed.with_demo_user', true)) {
            return;
        }

        User::query()->updateOrCreate(
            ['email' => 'user@example.com'],
            [
                'name' => 'Regular User',
                'password' => Hash::make('userpassword'),
                'role' => User::ROLE_USER,
                'email_verified_at' => now(),
            ]
        );
    }
}
