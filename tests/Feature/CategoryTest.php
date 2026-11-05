<?php

use App\Models\Category;
use App\Models\User;
use Database\Seeders\RoleAndPermissionSeeder;
use Inertia\Testing\AssertableInertia as Assert;

beforeEach(function () {
    $this->seed(RoleAndPermissionSeeder::class);

    $this->user = User::factory()->create();
    $this->user->assignRole('super admin');
});

test('guests cannot view categories', function () {
    $this->get(route('categories.index'))->assertRedirect(route('login'));
});

test('categories index can be rendered', function () {
    Category::factory()->count(3)->create();

    $this->actingAs($this->user)
        ->get(route('categories.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('categories/index')
            ->has('categories.data', 3)
            ->where('filters.search', '')
        );
});

test('categories can be searched', function () {
    Category::factory()->create(['name' => 'IT Equipment', 'code' => 'IT-EQ']);
    Category::factory()->create(['name' => 'Furniture', 'code' => 'FUR']);

    $this->actingAs($this->user)
        ->get(route('categories.index', ['search' => 'Furniture']))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('categories/index')
            ->has('categories.data', 1)
            ->where('categories.data.0.name', 'Furniture')
        );
});

test('categories can be created', function () {
    $this->actingAs($this->user)
        ->post(route('categories.store'), [
            'name' => 'IT Equipment',
            'code' => 'IT-EQ',
            'description' => 'Computers and accessories',
        ])
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('categories.index'));

    $this->assertDatabaseHas('categories', [
        'name' => 'IT Equipment',
        'code' => 'IT-EQ',
    ]);
});

test('category creation validates unique name and code', function () {
    Category::factory()->create(['name' => 'IT Equipment', 'code' => 'IT-EQ']);

    $this->actingAs($this->user)
        ->post(route('categories.store'), [
            'name' => 'IT Equipment',
            'code' => 'IT-EQ',
        ])
        ->assertSessionHasErrors(['name', 'code']);

    expect(Category::count())->toBe(1);
});

test('categories can be updated', function () {
    $category = Category::factory()->create(['name' => 'IT Equipment', 'code' => 'IT-EQ']);

    $this->actingAs($this->user)
        ->patch(route('categories.update', $category), [
            'name' => 'IT Assets',
            'code' => 'IT-AS',
            'description' => null,
        ])
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('categories.index'));

    expect($category->refresh()->name)->toBe('IT Assets');
});

test('categories can be deleted', function () {
    $category = Category::factory()->create();

    $this->actingAs($this->user)
        ->delete(route('categories.destroy', $category))
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('categories.index'));

    $this->assertDatabaseMissing('categories', ['id' => $category->id]);
});

test('staff can only view categories', function () {
    $staff = User::factory()->create();
    $staff->assignRole('staff');

    $this->actingAs($staff)->get(route('categories.index'))->assertOk();
    $this->actingAs($staff)
        ->post(route('categories.store'), ['name' => 'X', 'code' => 'X'])
        ->assertForbidden();
    $this->actingAs($staff)
        ->delete(route('categories.destroy', Category::factory()->create()))
        ->assertForbidden();
});
