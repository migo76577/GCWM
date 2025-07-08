<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Route\StoreRouteRequest;
use App\Models\Route;
use App\Models\RouteAssignment;
use Illuminate\Http\Request;

class RouteController extends Controller
{
    public function index(Request $request)
    {
        $routes = Route::withCount('customers')
            ->when($request->status, fn($q) => $q->where('status', $request->status))
            ->paginate(20);

        return response()->json($routes);
    }

    public function store(StoreRouteRequest $request)
    {
        $route = Route::create($request->validated());
        return response()->json($route, 201);
    }

    public function show(Route $route)
    {
        return response()->json($route->load(['customers', 'routeAssignments.driver', 'routeAssignments.vehicle']));
    }

    public function update(StoreRouteRequest $request, Route $route)
    {
        $route->update($request->validated());
        return response()->json($route);
    }

    public function destroy(Route $route)
    {
        $route->delete();
        return response()->json(null, 204);
    }

    public function customers(Route $route)
    {
        $customers = $route->customers()->with(['activePlan.plan'])->get();
        return response()->json($customers);
    }

    public function assignDriverAndVehicle(Request $request, Route $route)
    {
        $request->validate([
            'driver_id' => 'required|exists:drivers,id',
            'vehicle_id' => 'required|exists:vehicles,id',
            'assignment_date' => 'required|date',
        ]);

        $assignment = RouteAssignment::create([
            'route_id' => $route->id,
            'driver_id' => $request->driver_id,
            'vehicle_id' => $request->vehicle_id,
            'assignment_date' => $request->assignment_date,
        ]);

        return response()->json($assignment->load(['driver', 'vehicle']));
    }
}