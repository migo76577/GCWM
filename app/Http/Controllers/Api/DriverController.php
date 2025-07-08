<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Driver\StoreDriverRequest;
use App\Models\Driver;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class DriverController extends Controller
{
    public function index(Request $request)
    {
        $drivers = Driver::with('user')
            ->when($request->status, fn($q) => $q->where('status', $request->status))
            ->paginate(20);

        return response()->json($drivers);
    }

    public function store(StoreDriverRequest $request)
    {
        // Create user account
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => 'driver',
            'status' => 'active',
        ]);

        // Create driver profile
        $driver = Driver::create([
            'user_id' => $user->id,
            'employee_number' => $request->employee_number,
            'first_name' => $request->first_name,
            'last_name' => $request->last_name,
            'phone' => $request->phone,
            'license_number' => $request->license_number,
            'license_expiry' => $request->license_expiry,
            'hire_date' => $request->hire_date,
            'address' => $request->address,
        ]);

        return response()->json($driver->load('user'), 201);
    }

    public function show(Driver $driver)
    {
        return response()->json($driver->load(['user', 'routeAssignments.route', 'collections']));
    }

    public function todayAssignment(Request $request)
    {
        $driver = $request->user()->driver;
        
        $assignment = $driver->routeAssignments()
            ->with(['route.customers', 'vehicle'])
            ->where('assignment_date', now()->toDateString())
            ->where('status', 'active')
            ->first();

        return response()->json($assignment);
    }
}