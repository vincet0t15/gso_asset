<?php

namespace App\Http\Controllers;

use App\Models\AssetModel;
use App\Models\Brand;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class AssetModelController extends Controller
{
    /**
     * Display a listing of the models.
     */
    public function index(Request $request): Response
    {
        $search = $request->string('search')->trim()->toString();
        $brandId = $request->integer('brand');

        $models = AssetModel::query()
            ->with('brand:id,name')
            ->when($search !== '', function ($query) use ($search): void {
                $query->where(function ($query) use ($search): void {
                    $query->where('name', 'like', "%{$search}%")
                        ->orWhere('code', 'like', "%{$search}%")
                        ->orWhere('description', 'like', "%{$search}%")
                        ->orWhereHas('brand', fn ($query) => $query->where('name', 'like', "%{$search}%"));
                });
            })
            ->when($brandId > 0, fn ($query) => $query->where('brand_id', $brandId))
            ->orderBy('name')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('models/index', [
            'models' => $models,
            'brands' => Brand::query()->orderBy('name')->get(['id', 'name']),
            'filters' => [
                'search' => $search,
                'brand' => $brandId > 0 ? $brandId : null,
            ],
        ]);
    }

    /**
     * Show the form for creating a new model.
     */
    public function create(): Response
    {
        return Inertia::render('models/create', [
            'brands' => Brand::query()->orderBy('name')->get(['id', 'name']),
        ]);
    }

    /**
     * Store a newly created model.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'brand_id' => ['required', 'integer', 'exists:brands,id'],
            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('models', 'name')->where('brand_id', $request->integer('brand_id')),
            ],
            'code' => ['required', 'string', 'max:50', 'unique:models,code'],
            'description' => ['nullable', 'string', 'max:1000'],
        ]);

        AssetModel::create($validated);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => __('Model created.'),
        ]);

        return to_route('models.index');
    }

    /**
     * Show the form for editing the given model.
     */
    public function edit(AssetModel $model): Response
    {
        return Inertia::render('models/edit', [
            'model' => $model->only(['id', 'brand_id', 'name', 'code', 'description']),
            'brands' => Brand::query()->orderBy('name')->get(['id', 'name']),
        ]);
    }

    /**
     * Update the given model.
     */
    public function update(Request $request, AssetModel $model): RedirectResponse
    {
        $validated = $request->validate([
            'brand_id' => ['required', 'integer', 'exists:brands,id'],
            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('models', 'name')
                    ->where('brand_id', $request->integer('brand_id'))
                    ->ignore($model->id),
            ],
            'code' => ['required', 'string', 'max:50', Rule::unique('models', 'code')->ignore($model->id)],
            'description' => ['nullable', 'string', 'max:1000'],
        ]);

        $model->update($validated);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => __('Model updated.'),
        ]);

        return to_route('models.index');
    }

    /**
     * Delete the given model.
     */
    public function destroy(AssetModel $model): RedirectResponse
    {
        $model->delete();

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => __('Model deleted.'),
        ]);

        return to_route('models.index');
    }
}
