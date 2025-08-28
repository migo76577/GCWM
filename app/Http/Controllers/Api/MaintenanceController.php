<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\VehicleMaintenance;
use App\Models\Vehicle;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\Rule;

class MaintenanceController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = VehicleMaintenance::with('vehicle');

        if ($request->has('vehicle_id')) {
            $query->where('vehicle_id', $request->vehicle_id);
        }

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        if ($request->has('active')) {
            $query->active();
        }

        $maintenances = $query->orderBy('scheduled_date', 'desc')->paginate(15);

        return response()->json($maintenances);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'vehicle_id' => 'required|exists:vehicles,id',
            'maintenance_type' => 'required|string|max:255',
            'description' => 'required|string',
            'scheduled_date' => 'required|date|after_or_equal:today',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'status' => ['sometimes', Rule::in(['scheduled', 'in_progress', 'completed', 'cancelled'])],
            'cost' => 'nullable|numeric|min:0',
            'service_provider' => 'nullable|string|max:255',
            'notes' => 'nullable|string',
            'parts_replaced' => 'nullable|array'
        ]);

        $maintenance = VehicleMaintenance::create($validated);
        $vehicle = Vehicle::find($validated['vehicle_id']);
        $vehicle->updateMaintenanceStatus();

        return response()->json($maintenance->load('vehicle'), 201);
    }

    public function show(VehicleMaintenance $maintenance): JsonResponse
    {
        return response()->json($maintenance->load('vehicle'));
    }

    public function update(Request $request, VehicleMaintenance $maintenance): JsonResponse
    {
        $validated = $request->validate([
            'maintenance_type' => 'sometimes|string|max:255',
            'description' => 'sometimes|string',
            'scheduled_date' => 'sometimes|date',
            'start_date' => 'sometimes|nullable|date',
            'end_date' => 'sometimes|nullable|date|after_or_equal:start_date',
            'status' => ['sometimes', Rule::in(['scheduled', 'in_progress', 'completed', 'cancelled'])],
            'cost' => 'sometimes|nullable|numeric|min:0',
            'service_provider' => 'sometimes|nullable|string|max:255',
            'notes' => 'sometimes|nullable|string',
            'parts_replaced' => 'sometimes|nullable|array'
        ]);

        $maintenance->update($validated);
        $maintenance->vehicle->updateMaintenanceStatus();

        return response()->json($maintenance->load('vehicle'));
    }

    public function destroy(VehicleMaintenance $maintenance): JsonResponse
    {
        $vehicle = $maintenance->vehicle;
        $maintenance->delete();
        $vehicle->updateMaintenanceStatus();

        return response()->json(['message' => 'Maintenance record deleted successfully']);
    }

    public function markInProgress(VehicleMaintenance $maintenance): JsonResponse
    {
        $maintenance->update([
            'status' => 'in_progress',
            'start_date' => now()
        ]);
        
        $maintenance->vehicle->updateMaintenanceStatus();

        return response()->json($maintenance->load('vehicle'));
    }

    public function markCompleted(Request $request, VehicleMaintenance $maintenance): JsonResponse
    {
        $validated = $request->validate([
            'end_date' => 'sometimes|date',
            'cost' => 'sometimes|nullable|numeric|min:0',
            'notes' => 'sometimes|nullable|string',
            'parts_replaced' => 'sometimes|nullable|array'
        ]);

        $maintenance->update(array_merge($validated, [
            'status' => 'completed',
            'end_date' => $validated['end_date'] ?? now()
        ]));

        $maintenance->vehicle->updateMaintenanceStatus();

        return response()->json($maintenance->load('vehicle'));
    }
}
