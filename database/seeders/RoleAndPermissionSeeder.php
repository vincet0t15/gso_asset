<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class RoleAndPermissionSeeder extends Seeder
{
    /**
     * Permissions grouped by module.
     *
     * @var array<string, array<int, string>>
     */
    private array $permissions = [
        'users' => ['view', 'create', 'update', 'delete'],
        'roles' => ['view', 'create', 'update', 'delete'],
        'assets' => ['view', 'create', 'update', 'delete'],
        'brands' => ['view', 'create', 'update', 'delete'],
        'models' => ['view', 'create', 'update', 'delete'],
        'offices' => ['view', 'create', 'edit', 'delete'],
        'ppe_classifications' => ['view', 'create', 'update', 'delete'],
        'items' => ['view', 'create', 'update', 'delete'],
        'categories' => ['view', 'create', 'update', 'delete'],
        'suppliers' => ['view', 'create', 'update', 'delete'],
        'departments' => ['view', 'create', 'update', 'delete'],
        'reports' => ['view', 'export'],
        'settings' => ['manage'],
    ];

    /**
     * Seed the application's roles and permissions.
     */
    public function run(): void
    {
        app(PermissionRegistrar::class)->forgetCachedPermissions();

        $permissions = collect($this->permissions)
            ->flatMap(fn (array $actions, string $module): array => array_map(
                fn (string $action): string => "{$module}.{$action}",
                $actions,
            ))
            ->values();

        $permissions->each(fn (string $name) => Permission::findOrCreate($name, 'web'));

        // Newly created permissions are not in the registrar cache yet.
        app(PermissionRegistrar::class)->forgetCachedPermissions();

        $superAdmin = Role::findOrCreate('super admin', 'web');
        $admin = Role::findOrCreate('admin', 'web');
        $staff = Role::findOrCreate('staff', 'web');

        $superAdmin->syncPermissions($permissions);

        // Admins manage day-to-day data but cannot change roles or permissions.
        $admin->syncPermissions(
            $permissions->reject(fn (string $name): bool => str_starts_with($name, 'roles.')),
        );

        $staff->syncPermissions([
            'assets.view',
            'assets.create',
            'assets.update',
            'brands.view',
            'models.view',
            'offices.view',
            'ppe_classifications.view',
            'items.view',
            'categories.view',
            'suppliers.view',
            'departments.view',
            'reports.view',
        ]);

        app(PermissionRegistrar::class)->forgetCachedPermissions();
    }
}
