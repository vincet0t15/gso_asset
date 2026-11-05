<?php

use App\Models\AssetModel;
use App\Models\Brand;
use App\Models\User;
use Database\Seeders\RoleAndPermissionSeeder;
use Inertia\Testing\AssertableInertia as Assert;

beforeEach(function () {
    $this->seed(RoleAndPermissionSeeder::class);

    $this->user = User::factory()->create();
    $this->user->assignRole('super admin');
});

test('models index can be rendered', function () {
    AssetModel::factory()->count(2)->create();

    $this->actingAs($this->user)
        ->get(route('models.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('models/index')
            ->has('models.data', 2)
            ->has('brands')
            ->where('filters.search', '')
            ->where('filters.brand', null)
        );
});

test('models can be filtered by brand', function () {
    $dell = Brand::factory()->create(['name' => 'Dell']);
    $hp = Brand::factory()->create(['name' => 'HP']);

    AssetModel::factory()->for($dell)->create(['name' => 'Latitude']);
    AssetModel::factory()->for($hp)->create(['name' => 'EliteBook']);

    $this->actingAs($this->user)
        ->get(route('models.index', ['brand' => $dell->id]))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('models/index')
            ->has('models.data', 1)
            ->where('models.data.0.name', 'Latitude')
            ->where('filters.brand', $dell->id)
        );
});

test('models can be created', function () {
    $brand = Brand::factory()->create();

    $this->actingAs($this->user)
        ->post(route('models.store'), [
            'brand_id' => $brand->id,
            'name' => 'Latitude 5440',
            'code' => 'LAT-5440',
            'description' => 'Business laptop',
        ])
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('models.index'));

    $this->assertDatabaseHas('models', [
        'brand_id' => $brand->id,
        'name' => 'Latitude 5440',
        'code' => 'LAT-5440',
    ]);
});

test('model creation validates a unique name within the brand', function () {
    $brand = Brand::factory()->create();
    $otherBrand = Brand::factory()->create();

    AssetModel::factory()->for($brand)->create(['name' => 'Latitude']);

    $this->actingAs($this->user)
        ->post(route('models.store'), [
            'brand_id' => $brand->id,
            'name' => 'Latitude',
            'code' => 'LAT-2',
        ])
        ->assertSessionHasErrors('name');

    // The same name is allowed under a different brand.
    $this->actingAs($this->user)
        ->post(route('models.store'), [
            'brand_id' => $otherBrand->id,
            'name' => 'Latitude',
            'code' => 'LAT-3',
        ])
        ->assertSessionHasNoErrors();
});

test('model creation requires an existing brand', function () {
    $this->actingAs($this->user)
        ->post(route('models.store'), [
            'brand_id' => 999,
            'name' => 'Latitude',
            'code' => 'LAT-1',
        ])
        ->assertSessionHasErrors('brand_id');
});

test('models can be updated', function () {
    $model = AssetModel::factory()->create(['name' => 'Latitude']);
    $newBrand = Brand::factory()->create();

    $this->actingAs($this->user)
        ->patch(route('models.update', $model), [
            'brand_id' => $newBrand->id,
            'name' => 'Latitude 5440',
            'code' => $model->code,
            'description' => null,
        ])
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('models.index'));

    $model->refresh();

    expect($model->name)->toBe('Latitude 5440')
        ->and($model->brand_id)->toBe($newBrand->id);
});

test('models can be deleted', function () {
    $model = AssetModel::factory()->create();

    $this->actingAs($this->user)
        ->delete(route('models.destroy', $model))
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('models.index'));

    $this->assertDatabaseMissing('models', ['id' => $model->id]);
});

test('staff can only view models', function () {
    $staff = User::factory()->create();
    $staff->assignRole('staff');

    $this->actingAs($staff)->get(route('models.index'))->assertOk();
    $this->actingAs($staff)->get(route('models.create'))->assertForbidden();
    $this->actingAs($staff)
        ->delete(route('models.destroy', AssetModel::factory()->create()))
        ->assertForbidden();
});
