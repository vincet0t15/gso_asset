<?php

use App\Models\Brand;
use App\Models\User;
use Database\Seeders\RoleAndPermissionSeeder;
use Inertia\Testing\AssertableInertia as Assert;

beforeEach(function () {
    $this->seed(RoleAndPermissionSeeder::class);

    $this->user = User::factory()->create();
    $this->user->assignRole('super admin');
});

test('guests cannot view brands', function () {
    $this->get(route('brands.index'))->assertRedirect(route('login'));
});

test('brands index can be rendered', function () {
    Brand::factory()->count(3)->create();

    $this->actingAs($this->user)
        ->get(route('brands.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('brands/index')
            ->has('brands.data', 3)
            ->where('filters.search', '')
        );
});

test('brands can be searched', function () {
    Brand::factory()->create(['name' => 'Dell', 'code' => 'DELL']);
    Brand::factory()->create(['name' => 'HP', 'code' => 'HP']);

    $this->actingAs($this->user)
        ->get(route('brands.index', ['search' => 'Dell']))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('brands/index')
            ->has('brands.data', 1)
            ->where('brands.data.0.name', 'Dell')
        );
});

test('brands can be created', function () {
    $this->actingAs($this->user)
        ->post(route('brands.store'), [
            'name' => 'Dell',
            'code' => 'DELL',
            'description' => 'Computer manufacturer',
        ])
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('brands.index'));

    $this->assertDatabaseHas('brands', [
        'name' => 'Dell',
        'code' => 'DELL',
    ]);
});

test('brand creation validates unique name and code', function () {
    Brand::factory()->create(['name' => 'Dell', 'code' => 'DELL']);

    $this->actingAs($this->user)
        ->post(route('brands.store'), [
            'name' => 'Dell',
            'code' => 'DELL',
        ])
        ->assertSessionHasErrors(['name', 'code']);

    expect(Brand::count())->toBe(1);
});

test('brands can be updated', function () {
    $brand = Brand::factory()->create(['name' => 'Dell', 'code' => 'DELL']);

    $this->actingAs($this->user)
        ->patch(route('brands.update', $brand), [
            'name' => 'Dell Technologies',
            'code' => 'DELL-TECH',
            'description' => null,
        ])
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('brands.index'));

    expect($brand->refresh()->name)->toBe('Dell Technologies');
});

test('brands can be deleted', function () {
    $brand = Brand::factory()->create();

    $this->actingAs($this->user)
        ->delete(route('brands.destroy', $brand))
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('brands.index'));

    $this->assertDatabaseMissing('brands', ['id' => $brand->id]);
});

test('brands with models cannot be deleted', function () {
    $brand = Brand::factory()->create();
    $brand->models()->create([
        'name' => 'Latitude 5440',
        'code' => 'LAT-5440',
    ]);

    $this->actingAs($this->user)
        ->delete(route('brands.destroy', $brand))
        ->assertRedirect();

    $this->assertDatabaseHas('brands', ['id' => $brand->id]);
});

test('staff can only view brands', function () {
    $staff = User::factory()->create();
    $staff->assignRole('staff');

    $this->actingAs($staff)->get(route('brands.index'))->assertOk();
    $this->actingAs($staff)->get(route('brands.create'))->assertForbidden();
    $this->actingAs($staff)
        ->post(route('brands.store'), ['name' => 'Dell', 'code' => 'DELL'])
        ->assertForbidden();
});
