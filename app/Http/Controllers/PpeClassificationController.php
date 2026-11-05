<?php

namespace App\Http\Controllers;

use App\Models\PpeClassification;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class PpeClassificationController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->string('search')->trim()->toString();

        $classifications = PpeClassification::query()
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

        return Inertia::render('ppe-classifications/index', [
            'classifications' => $classifications,
            'filters' => [
                'search' => $search,
            ],
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255', 'unique:ppe_classifications,name'],
            'code' => ['required', 'string', 'max:50', 'unique:ppe_classifications,code'],
            'description' => ['nullable', 'string', 'max:1000'],
        ]);

        PpeClassification::create($validated);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => __('PPE classification created.'),
        ]);

        return to_route('ppe-classifications.index');
    }

    public function update(Request $request, PpeClassification $ppeClassification): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255', Rule::unique('ppe_classifications', 'name')->ignore($ppeClassification->id)],
            'code' => ['required', 'string', 'max:50', Rule::unique('ppe_classifications', 'code')->ignore($ppeClassification->id)],
            'description' => ['nullable', 'string', 'max:1000'],
        ]);

        $ppeClassification->update($validated);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => __('PPE classification updated.'),
        ]);

        return to_route('ppe-classifications.index');
    }

    public function destroy(PpeClassification $ppeClassification): RedirectResponse
    {
        $ppeClassification->delete();

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => __('PPE classification deleted.'),
        ]);

        return to_route('ppe-classifications.index');
    }
}
