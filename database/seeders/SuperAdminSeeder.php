<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class SuperAdminSeeder extends Seeder
{
    /**
     * The default super admin credentials.
     *
     * Change the password after the first login.
     */
    public const USERNAME = 'superadmin';

    public const PASSWORD = 'SuperAdmin#2026';

    /**
     * Seed the application's super admin account.
     */
    public function run(): void
    {
        $user = User::updateOrCreate(
            ['username' => self::USERNAME],
            ['password' => self::PASSWORD],
        );

        $user->syncRoles(['super admin']);
    }
}
