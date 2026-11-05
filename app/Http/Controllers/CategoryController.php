<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class CategoryController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->string('search')->trim()->toString();

        $categories = Category::query()
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

        return Inertia::render('categories/index', [
            'categories' => $categories,
            'filters' => [
                'search' => $search,
            ],
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255', 'unique:categories,name'],
            'code' => ['required', 'string', 'max:50', 'unique:categories,code'],
            'description' => ['nullable', 'string', 'max:1000'],
        ]);

        Category::create($validated);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => __('Category created.'),
        ]);

        return to_route('categories.index');
    }

    public function update(Request $request, Category $category): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255', Rule::unique('categories', 'name')->ignore($category->id)],
            'code' => ['required', 'string', 'max:50', Rule::unique('categories', 'code')->ignore($category->id)],
            'description' => ['nullable', 'string', 'max:1000'],
        ]);

        $category->update($validated);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => __('Category updated.'),
        ]);

        return to_route('categories.index');
    }

    public function destroy(Category $category): RedirectResponse
    {
        $category->delete();

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => __('Category deleted.'),
        ]);

        return to_route('categories.index');
    }
}
