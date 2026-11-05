<?php

use App\Models\Brand;
use App\Models\Category;
use App\Models\Item;
use App\Models\User;
use Database\Seeders\RoleAndPermissionSeeder;
use Inertia\Testing\AssertableInertia as Assert;

beforeEach(function () {
    $this->seed(RoleAndPermissionSeeder::class);

    $this->user = User::factory()->create();
    $this->user->assignRole('super admin');
});

test('guests cannot view items', function () {
    $this->get(route('items.index'))->assertRedirect(route('login'));
});

test('items index can be rendered', function () {
    Item::factory()->count(3)->create();

    $this->actingAs($this->user)
        ->get(route('items.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('items/index')
            ->has('items.data', 3)
            ->where('filters.search', '')
        );
});

test('items can be searched', function () {
    Item::factory()->create(['name' => 'Laptop Dell', 'stock_number' => 'STK-001']);
    Item::factory()->create(['name' => 'Office Chair', 'stock_number' => 'STK-002']);

    $this->actingAs($this->user)
        ->get(route('items.index', ['search' => 'Laptop']))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('items/index')
            ->has('items.data', 1)
            ->where('items.data.0.name', 'Laptop Dell')
        );
});

test('items can be created', function () {
    $brand = Brand::factory()->create();
    $category = Category::factory()->create();

    $this->actingAs($this->user)
        ->post(route('items.store'), [
            'name' => 'Laptop Dell Latitude 5440',
            'stock_number' => 'STK-001',
            'brand_id' => $brand->id,
            'category_id' => $category->id,
            'unit' => 'pcs',
            'unit_cost' => 45000.00,
            'description' => 'Business laptop',
        ])
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('items.index'));

    $this->assertDatabaseHas('items', [
        'name' => 'Laptop Dell Latitude 5440',
        'stock_number' => 'STK-001',
        'brand_id' => $brand->id,
    ]);
});

test('item creation validates unique stock number', function () {
    Item::factory()->create(['stock_number' => 'STK-001']);

    $this->actingAs($this->user)
        ->post(route('items.store'), [
            'name' => 'Another Item',
            'stock_number' => 'STK-001',
            'unit' => 'pcs',
        ])
        ->assertSessionHasErrors('stock_number');

    expect(Item::count())->toBe(1);
});

test('items can be updated', function () {
    $item = Item::factory()->create(['name' => 'Laptop Dell']);

    $this->actingAs($this->user)
        ->patch(route('items.update', $item), [
            'name' => 'Laptop Dell Latitude 5440',
            'stock_number' => $item->stock_number,
            'unit' => $item->unit,
            'description' => null,
        ])
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('items.index'));

    expect($item->refresh()->name)->toBe('Laptop Dell Latitude 5440');
});

test('items can be deleted', function () {
    $item = Item::factory()->create();

    $this->actingAs($this->user)
        ->delete(route('items.destroy', $item))
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('items.index'));

    $this->assertDatabaseMissing('items', ['id' => $item->id]);
});

test('staff can only view items', function () {
    $staff = User::factory()->create();
    $staff->assignRole('staff');

    $this->actingAs($staff)->get(route('items.index'))->assertOk();
    $this->actingAs($staff)
        ->post(route('items.store'), ['name' => 'X', 'unit' => 'pcs'])
        ->assertForbidden();
    $this->actingAs($staff)
        ->delete(route('items.destroy', Item::factory()->create()))
        ->assertForbidden();
});
