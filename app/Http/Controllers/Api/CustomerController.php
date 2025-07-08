<?php

namespace App\Http\Controllers\Api;

use App\Events\CustomerApproved;
use App\Http\Controllers\Controller;
use App\Http\Requests\Customer\StoreCustomerRequest;
use App\Http\Requests\Customer\UpdateCustomerRequest;
use App\Models\Customer;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class CustomerController extends Controller
{
    public function index(Request $request)
    {
        $customers = Customer::with(['activePlan.plan', 'activeRoute.route'])
            ->when($request->status, fn($q) => $q->where('status', $request->status))
            ->when($request->registration_status, fn($q) => $q->where('registration_status', $request->registration_status))
            ->when($request->city, fn($q) => $q->where('city', $request->city))
            ->paginate(20);

        return response()->json($customers);
    }

    public function store(StoreCustomerRequest $request)
    {
        $validated = $request->validated();
        
        // Generate customer number if not provided
        $customerNumber = $validated['customer_number'] ?? $this->generateCustomerNumber();

        // Create customer
        $customer = Customer::create([
            'customer_number' => $customerNumber,
            'first_name' => $validated['first_name'],
            'last_name' => $validated['last_name'],
            'phone' => $validated['phone'],
            'alternative_phone' => $validated['alternative_phone'] ?? null,
            'address' => $validated['address'],
            'city' => $validated['city'],
            'area' => $validated['area'],
            'latitude' => $validated['latitude'],
            'longitude' => $validated['longitude'],
            'notes' => $validated['notes'] ?? null,
            'registration_status' => 'pending',
            'status' => 'inactive',
        ]);

        // Assign to route if provided
        if (isset($validated['route_id'])) {
            $customer->customerRoutes()->create([
                'route_id' => $validated['route_id'],
                'assigned_date' => now(),
                'status' => 'active',
            ]);
        }

        return response()->json($customer->load('activeRoute.route'), 201);
    }

    private function generateCustomerNumber()
    {
        do {
            $number = 'CUS' . str_pad(mt_rand(1, 999999), 6, '0', STR_PAD_LEFT);
        } while (Customer::where('customer_number', $number)->exists());
        
        return $number;
    }

    public function show(Customer $customer)
    {
        return response()->json($customer->load([
            'customerPlans.plan', 'collections', 'invoices', 
            'payments', 'complaints', 'activeRoute.route'
        ]));
    }

    public function update(UpdateCustomerRequest $request, Customer $customer)
    {
        $customer->update($request->validated());

        return response()->json($customer->fresh());
    }

    public function destroy(Customer $customer)
    {
        $customer->delete();
        return response()->json(null, 204);
    }

    public function approveRegistration(Customer $customer)
    {
        $customer->update([
            'registration_status' => 'approved',
            'status' => 'active',
        ]);

        // Fire event to create initial invoice
        CustomerApproved::dispatch($customer->fresh()->load('category'));

        return response()->json($customer->fresh());
    }

    public function assignToRoute(Request $request, Customer $customer)
    {
        $request->validate([
            'route_id' => 'required|exists:routes,id',
            'collection_order' => 'nullable|integer',
            'special_instructions' => 'nullable|string',
        ]);

        // Remove from current route if exists
        $customer->customerRoutes()->where('status', 'active')->update([
            'status' => 'removed',
            'removed_date' => now(),
        ]);

        // Assign to new route
        $assignment = $customer->customerRoutes()->create([
            'route_id' => $request->route_id,
            'assigned_date' => now(),
            'collection_order' => $request->collection_order,
            'special_instructions' => $request->special_instructions,
        ]);

        return response()->json($assignment->load('route'));
    }
}