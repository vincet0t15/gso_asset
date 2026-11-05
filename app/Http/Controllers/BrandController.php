<?php

namespace App\Http\Controllers;

use App\Models\Brand;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class BrandController extends Controller
{
    /**
     * Display a listing of the brands.
     */
    public function index(Request $request): Response
    {
        $search = $request->string('search')->trim()->toString();

        $brands = Brand::query()
            ->withCount('models')
            ->when($search !== '', function ($query) use ($search): void {
                $query->where(function ($query) use ($search): void {
                    $query->where('name', 'like', "%{$search}%")
                        ->orWhere('code', 'like', "%{$search}%")
                        ->orWhere('description', 'like', "%{$search}%");
                });
            })
            ->orderBy('name')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('brands/index', [
            'brands' => $brands,
            'filters' => [
                'search' => $search,
            ],
        ]);
    }

    /**
     * Show the form for creating a new brand.
     */
    public function create(): Response
    {
        return Inertia::render('brands/create');
    }

    /**
     * Store a newly created brand.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255', 'unique:brands,name'],
            'code' => ['required', 'string', 'max:50', 'unique:brands,code'],
            'description' => ['nullable', 'string', 'max:1000'],
        ]);

        Brand::create($validated);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => __('Brand created.'),
        ]);

        return to_route('brands.index');
    }

    /**
     * Show the form for editing the given brand.
     */
    public function edit(Brand $brand): Response
    {
        return Inertia::render('brands/edit', [
            'brand' => $brand->only(['id', 'name', 'code', 'description']),
        ]);
    }

    /**
     * Update the given brand.
     */
    public function update(Request $request, Brand $brand): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255', Rule::unique('brands', 'name')->ignore($brand->id)],
            'code' => ['required', 'string', 'max:50', Rule::unique('brands', 'code')->ignore($brand->id)],
            'description' => ['nullable', 'string', 'max:1000'],
        ]);

        $brand->update($validated);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => __('Brand updated.'),
        ]);

        return to_route('brands.index');
    }

    /**
     * Delete the given brand.
     */
    public function destroy(Brand $brand): RedirectResponse
    {
        if ($brand->models()->exists()) {
            Inertia::flash('toast', [
                'type' => 'error',
                'message' => __('Cannot delete a brand that still has models.'),
            ]);

            return back();
        }

        $brand->delete();

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => __('Brand deleted.'),
        ]);

        return to_route('brands.index');
    }
}
