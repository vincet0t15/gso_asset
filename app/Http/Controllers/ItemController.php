<?php

namespace App\Http\Controllers;

use App\Models\AssetModel;
use App\Models\Brand;
use App\Models\Category;
use App\Models\Item;
use App\Models\PpeClassification;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class ItemController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->string('search')->trim()->toString();

        $items = Item::query()
            ->with(['brand:id,name', 'assetModel:id,name', 'category:id,name', 'ppeClassification:id,name'])
            ->when($search !== '', function ($query) use ($search): void {
                $query->where(function ($query) use ($search): void {
                    $query->where('name', 'like', "%{$search}%")
                        ->orWhere('stock_number', 'like', "%{$search}%")
                        ->orWhere('description', 'like', "%{$search}%");
                });
            })
            ->orderBy('name')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('items/index', [
            'items' => $items,
            'brands' => Brand::query()->orderBy('name')->get(['id', 'name']),
            'models' => AssetModel::query()->orderBy('name')->get(['id', 'name']),
            'categories' => Category::query()->orderBy('name')->get(['id', 'name']),
            'ppeClassifications' => PpeClassification::query()->orderBy('name')->get(['id', 'name']),
            'filters' => [
                'search' => $search,
            ],
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'stock_number' => ['nullable', 'string', 'max:50', 'unique:items,stock_number'],
            'brand_id' => ['nullable', 'integer', 'exists:brands,id'],
            'asset_model_id' => ['nullable', 'integer', 'exists:models,id'],
            'category_id' => ['nullable', 'integer', 'exists:categories,id'],
            'ppe_classification_id' => ['nullable', 'integer', 'exists:ppe_classifications,id'],
            'unit' => ['required', 'string', 'max:50'],
            'unit_cost' => ['nullable', 'numeric', 'min:0'],
            'description' => ['nullable', 'string', 'max:1000'],
        ]);

        Item::create($validated);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => __('Item created.'),
        ]);

        return to_route('items.index');
    }

    public function update(Request $request, Item $item): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'stock_number' => ['nullable', 'string', 'max:50', Rule::unique('items', 'stock_number')->ignore($item->id)],
            'brand_id' => ['nullable', 'integer', 'exists:brands,id'],
            'asset_model_id' => ['nullable', 'integer', 'exists:models,id'],
            'category_id' => ['nullable', 'integer', 'exists:categories,id'],
            'ppe_classification_id' => ['nullable', 'integer', 'exists:ppe_classifications,id'],
            'unit' => ['required', 'string', 'max:50'],
            'unit_cost' => ['nullable', 'numeric', 'min:0'],
            'description' => ['nullable', 'string', 'max:1000'],
        ]);

        $item->update($validated);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => __('Item updated.'),
        ]);

        return to_route('items.index');
    }

    public function destroy(Item $item): RedirectResponse
    {
        $item->delete();

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => __('Item deleted.'),
        ]);

        return to_route('items.index');
    }
}
