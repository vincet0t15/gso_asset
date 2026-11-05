<?php

use App\Models\Office;
use App\Models\User;
use Database\Seeders\RoleAndPermissionSeeder;
use Inertia\Testing\AssertableInertia as Assert;

beforeEach(function () {
    $this->seed(RoleAndPermissionSeeder::class);

    $this->user = User::factory()->create();
    $this->user->assignRole('super admin');
});

test('guests cannot view offices', function () {
    $this->get(route('offices.index'))->assertRedirect(route('login'));
});

test('offices index can be rendered', function () {
    Office::factory()->count(3)->create();

    $this->actingAs($this->user)
        ->get(route('offices.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('offices/index')
            ->has('offices.data', 3)
            ->where('filters.search', '')
        );
});

test('offices can be searched', function () {
    Office::factory()->create(['name' => 'Mayor Office', 'code' => 'MO']);
    Office::factory()->create(['name' => 'Treasury', 'code' => 'TO']);

    $this->actingAs($this->user)
        ->get(route('offices.index', ['search' => 'Mayor']))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('offices/index')
            ->has('offices.data', 1)
            ->where('offices.data.0.name', 'Mayor Office')
        );
});

test('offices can be created', function () {
    $this->actingAs($this->user)
        ->post(route('offices.store'), [
            'name' => 'Mayor Office',
            'code' => 'MO',
        ])
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('offices.index'));

    $this->assertDatabaseHas('offices', [
        'name' => 'Mayor Office',
        'code' => 'MO',
    ]);
});

test('office creation validates unique name and code', function () {
    Office::factory()->create(['name' => 'Mayor Office', 'code' => 'MO']);

    $this->actingAs($this->user)
        ->post(route('offices.store'), [
            'name' => 'Mayor Office',
            'code' => 'MO',
        ])
        ->assertSessionHasErrors(['name', 'code']);

    expect(Office::count())->toBe(1);
});

test('offices can be updated', function () {
    $office = Office::factory()->create(['name' => 'Mayor Office', 'code' => 'MO']);

    $this->actingAs($this->user)
        ->patch(route('offices.update', $office), [
            'name' => 'Office of the Mayor',
            'code' => 'OM',
        ])
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('offices.index'));

    expect($office->refresh()->name)->toBe('Office of the Mayor');
});

test('offices can be deleted', function () {
    $office = Office::factory()->create();

    $this->actingAs($this->user)
        ->delete(route('offices.destroy', $office))
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('offices.index'));

    $this->assertDatabaseMissing('offices', ['id' => $office->id]);
});

test('staff can only view offices', function () {
    $staff = User::factory()->create();
    $staff->assignRole('staff');

    $this->actingAs($staff)->get(route('offices.index'))->assertOk();
    $this->actingAs($staff)
        ->post(route('offices.store'), ['name' => 'X', 'code' => 'X'])
        ->assertForbidden();
    $this->actingAs($staff)
        ->delete(route('offices.destroy', Office::factory()->create()))
        ->assertForbidden();
});
