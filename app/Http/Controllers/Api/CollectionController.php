<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Collection\StoreCollectionRequest;
use App\Models\Collection;
use App\Models\Customer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class CollectionController extends Controller
{
    public function index(Request $request)
    {
        $collections = Collection::with(['customer.user', 'driver.user', 'vehicle', 'route'])
            ->when($request->driver_id, fn($q) => $q->where('driver_id', $request->driver_id))
            ->when($request->customer_id, fn($q) => $q->where('customer_id', $request->customer_id))
            ->when($request->collection_date, fn($q) => $q->where('collection_date', $request->collection_date))
            ->orderBy('collected_at', 'desc')
            ->paginate(20);

        return response()->json($collections);
    }

    public function store(StoreCollectionRequest $request)
    {
        $driver = $request->user()->driver;
        $customer = Customer::findOrFail($request->customer_id);

        // Upload photos
        $photoPaths = [];
        if ($request->hasFile('photos')) {
            foreach ($request->file('photos') as $photo) {
                $path = $photo->store('collections', 'public');
                $photoPaths[] = Storage::url($path);
            }
        }

        $collection = Collection::create([
            'collection_number' => 'COL-' . now()->format('YmdHis'),
            'customer_id' => $customer->id,
            'route_id' => $customer->activeRoute->route_id,
            'driver_id' => $driver->id,
            'vehicle_id' => $driver->routeAssignments()->where('assignment_date', now()->toDateString())->first()->vehicle_id,
            'collection_date' => now()->toDateString(),
            'collected_at' => now(),
            'photos' => $photoPaths,
            'notes' => $request->notes,
            'latitude' => $request->latitude,
            'longitude' => $request->longitude,
            'status' => $request->status,
        ]);

        // Notify customer
        $customer->user->notify(new \App\Notifications\WasteCollected($collection));
        
        $collection->update([
            'customer_notified' => true,
            'customer_notified_at' => now(),
        ]);

        return response()->json($collection->load(['customer', 'route']), 201);
    }

    public function show(Collection $collection)
    {
        return response()->json($collection->load(['customer.user', 'driver.user', 'vehicle', 'route']));
    }
}