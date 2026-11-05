<?php

use App\Http\Controllers\AssetModelController;
use App\Http\Controllers\BrandController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');

    Route::get('brands', [BrandController::class, 'index'])
        ->middleware('permission:brands.view')
        ->name('brands.index');
    Route::get('brands/create', [BrandController::class, 'create'])
        ->middleware('permission:brands.create')
        ->name('brands.create');
    Route::post('brands', [BrandController::class, 'store'])
        ->middleware('permission:brands.create')
        ->name('brands.store');
    Route::get('brands/{brand}/edit', [BrandController::class, 'edit'])
        ->middleware('permission:brands.update')
        ->name('brands.edit');
    Route::patch('brands/{brand}', [BrandController::class, 'update'])
        ->middleware('permission:brands.update')
        ->name('brands.update');
    Route::delete('brands/{brand}', [BrandController::class, 'destroy'])
        ->middleware('permission:brands.delete')
        ->name('brands.destroy');

    Route::get('models', [AssetModelController::class, 'index'])
        ->middleware('permission:models.view')
        ->name('models.index');
    Route::get('models/create', [AssetModelController::class, 'create'])
        ->middleware('permission:models.create')
        ->name('models.create');
    Route::post('models', [AssetModelController::class, 'store'])
        ->middleware('permission:models.create')
        ->name('models.store');
    Route::get('models/{model}/edit', [AssetModelController::class, 'edit'])
        ->middleware('permission:models.update')
        ->name('models.edit');
    Route::patch('models/{model}', [AssetModelController::class, 'update'])
        ->middleware('permission:models.update')
        ->name('models.update');
    Route::delete('models/{model}', [AssetModelController::class, 'destroy'])
        ->middleware('permission:models.delete')
        ->name('models.destroy');
});

require __DIR__.'/settings.php';
