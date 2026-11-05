<?php

use App\Http\Controllers\AssetModelController;
use App\Http\Controllers\BrandController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\OfficeController;
use App\Http\Controllers\PpeClassificationController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');

    Route::get('brands', [BrandController::class, 'index'])
        ->middleware('permission:brands.view')
        ->name('brands.index');
    Route::post('brands', [BrandController::class, 'store'])
        ->middleware('permission:brands.create')
        ->name('brands.store');
    Route::patch('brands/{brand}', [BrandController::class, 'update'])
        ->middleware('permission:brands.update')
        ->name('brands.update');
    Route::delete('brands/{brand}', [BrandController::class, 'destroy'])
        ->middleware('permission:brands.delete')
        ->name('brands.destroy');

    Route::get('categories', [CategoryController::class, 'index'])
        ->middleware('permission:categories.view')
        ->name('categories.index');
    Route::post('categories', [CategoryController::class, 'store'])
        ->middleware('permission:categories.create')
        ->name('categories.store');
    Route::patch('categories/{category}', [CategoryController::class, 'update'])
        ->middleware('permission:categories.update')
        ->name('categories.update');
    Route::delete('categories/{category}', [CategoryController::class, 'destroy'])
        ->middleware('permission:categories.delete')
        ->name('categories.destroy');

    Route::get('models', [AssetModelController::class, 'index'])
        ->middleware('permission:models.view')
        ->name('models.index');
    Route::post('models', [AssetModelController::class, 'store'])
        ->middleware('permission:models.create')
        ->name('models.store');
    Route::patch('models/{model}', [AssetModelController::class, 'update'])
        ->middleware('permission:models.update')
        ->name('models.update');
    Route::delete('models/{model}', [AssetModelController::class, 'destroy'])
        ->middleware('permission:models.delete')
        ->name('models.destroy');

    Route::get('offices', [OfficeController::class, 'index'])
        ->middleware('permission:offices.view')
        ->name('offices.index');
    Route::post('offices', [OfficeController::class, 'store'])
        ->middleware('permission:offices.create')
        ->name('offices.store');
    Route::patch('offices/{office}', [OfficeController::class, 'update'])
        ->middleware('permission:offices.edit')
        ->name('offices.update');
    Route::delete('offices/{office}', [OfficeController::class, 'destroy'])
        ->middleware('permission:offices.delete')
        ->name('offices.destroy');

    Route::get('ppe-classifications', [PpeClassificationController::class, 'index'])
        ->middleware('permission:ppe_classifications.view')
        ->name('ppe-classifications.index');
    Route::post('ppe-classifications', [PpeClassificationController::class, 'store'])
        ->middleware('permission:ppe_classifications.create')
        ->name('ppe-classifications.store');
    Route::patch('ppe-classifications/{ppeClassification}', [PpeClassificationController::class, 'update'])
        ->middleware('permission:ppe_classifications.update')
        ->name('ppe-classifications.update');
    Route::delete('ppe-classifications/{ppeClassification}', [PpeClassificationController::class, 'destroy'])
        ->middleware('permission:ppe_classifications.delete')
        ->name('ppe-classifications.destroy');
});

require __DIR__.'/settings.php';
