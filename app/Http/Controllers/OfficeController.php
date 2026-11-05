<?php

namespace App\Http\Controllers;

use App\Models\Office;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class OfficeController extends Controller
{
    /**
     * Display a listing of the offices.
     */
    public function index(Request $request): Response
    {
        $search = $request->string('search')->trim()->toString();

        $offices = Office::query()
            ->when($search !== '', function ($query) use ($search): void {
                $query->where(function ($query) use ($search): void {
                    $query->where('name', 'like', "%{$search}%")
                        ->orWhere('code', 'like', "%{$search}%");
                });
            })
            ->orderBy('name')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('offices/index', [
            'offices' => $offices,
            'filters' => [
                'search' => $search,
            ],
        ]);
    }

    /**
     * Store a newly created office.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255', 'unique:offices,name'],
            'code' => ['required', 'string', 'max:50', 'unique:offices,code'],
        ]);

        Office::create($validated);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => __('Office created.'),
        ]);

        return to_route('offices.index');
    }

    /**
     * Update the given office.
     */
    public function update(Request $request, Office $office): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255', Rule::unique('offices', 'name')->ignore($office->id)],
            'code' => ['required', 'string', 'max:50', Rule::unique('offices', 'code')->ignore($office->id)],
        ]);

        $office->update($validated);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => __('Office updated.'),
        ]);

        return to_route('offices.index');
    }

    /**
     * Delete the given office.
     */
    public function destroy(Office $office): RedirectResponse
    {
        $office->delete();

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => __('Office deleted.'),
        ]);

        return to_route('offices.index');
    }
}
