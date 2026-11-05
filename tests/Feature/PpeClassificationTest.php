<?php

use App\Models\PpeClassification;
use App\Models\User;
use Database\Seeders\RoleAndPermissionSeeder;
use Inertia\Testing\AssertableInertia as Assert;

beforeEach(function () {
    $this->seed(RoleAndPermissionSeeder::class);

    $this->user = User::factory()->create();
    $this->user->assignRole('super admin');
});

test('guests cannot view ppe classifications', function () {
    $this->get(route('ppe-classifications.index'))->assertRedirect(route('login'));
});

test('ppe classifications index can be rendered', function () {
    PpeClassification::factory()->count(3)->create();

    $this->actingAs($this->user)
        ->get(route('ppe-classifications.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('ppe-classifications/index')
            ->has('classifications.data', 3)
            ->where('filters.search', '')
        );
});

test('ppe classifications can be searched', function () {
    PpeClassification::factory()->create(['name' => 'ICT Equipment', 'code' => 'ICT-EQ']);
    PpeClassification::factory()->create(['name' => 'Furniture', 'code' => 'FUR']);

    $this->actingAs($this->user)
        ->get(route('ppe-classifications.index', ['search' => 'Furniture']))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('ppe-classifications/index')
            ->has('classifications.data', 1)
            ->where('classifications.data.0.name', 'Furniture')
        );
});

test('ppe classifications can be created', function () {
    $this->actingAs($this->user)
        ->post(route('ppe-classifications.store'), [
            'name' => 'ICT Equipment',
            'code' => 'ICT-EQ',
            'description' => 'Computers and accessories',
        ])
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('ppe-classifications.index'));

    $this->assertDatabaseHas('ppe_classifications', [
        'name' => 'ICT Equipment',
        'code' => 'ICT-EQ',
    ]);
});

test('ppe classification creation validates unique name and code', function () {
    PpeClassification::factory()->create(['name' => 'ICT Equipment', 'code' => 'ICT-EQ']);

    $this->actingAs($this->user)
        ->post(route('ppe-classifications.store'), [
            'name' => 'ICT Equipment',
            'code' => 'ICT-EQ',
        ])
        ->assertSessionHasErrors(['name', 'code']);

    expect(PpeClassification::count())->toBe(1);
});

test('ppe classifications can be updated', function () {
    $classification = PpeClassification::factory()->create(['name' => 'ICT Equipment', 'code' => 'ICT-EQ']);

    $this->actingAs($this->user)
        ->patch(route('ppe-classifications.update', $classification), [
            'name' => 'ICT Assets',
            'code' => 'ICT-AS',
            'description' => null,
        ])
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('ppe-classifications.index'));

    expect($classification->refresh()->name)->toBe('ICT Assets');
});

test('ppe classifications can be deleted', function () {
    $classification = PpeClassification::factory()->create();

    $this->actingAs($this->user)
        ->delete(route('ppe-classifications.destroy', $classification))
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('ppe-classifications.index'));

    $this->assertDatabaseMissing('ppe_classifications', ['id' => $classification->id]);
});

test('staff can only view ppe classifications', function () {
    $staff = User::factory()->create();
    $staff->assignRole('staff');

    $this->actingAs($staff)->get(route('ppe-classifications.index'))->assertOk();
    $this->actingAs($staff)
        ->post(route('ppe-classifications.store'), ['name' => 'X', 'code' => 'X'])
        ->assertForbidden();
    $this->actingAs($staff)
        ->delete(route('ppe-classifications.destroy', PpeClassification::factory()->create()))
        ->assertForbidden();
});
