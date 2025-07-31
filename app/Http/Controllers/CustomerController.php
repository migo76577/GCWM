<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Models\CustomerCategory;
use App\Http\Requests\Customer\StoreCustomerRequest;
use App\Http\Requests\Customer\UpdateCustomerRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CustomerController extends Controller
{
    public function index()
    {
        $categories = CustomerCategory::active()->get();
        
        // Return Inertia page - the ShareApiToken middleware will handle adding the token
        return Inertia::render('Customers/Index', [
            'categories' => $categories
        ]);
    }

    public function show(Customer $customer)
    {
        // Load related data for the customer
        $customer->load(['activePlan.plan', 'activeRoute.route']);
        
        // Get categories for edit form
        $categories = CustomerCategory::active()->get();
        
        // Return Inertia page with customer data
        return Inertia::render('Customers/Show', [
            'customer' => $customer,
            'categories' => $categories
        ]);
    }

    public function store(StoreCustomerRequest $request)
    {
        $customer = Customer::create($request->validated());
        
        return response()->json([
            'message' => 'Customer created successfully',
            'customer' => $customer
        ]);
    }

    public function edit(Customer $customer)
    {
        return response()->json($customer);
    }

    public function update(UpdateCustomerRequest $request, Customer $customer)
    {
        $customer->update($request->validated());
        
        return response()->json([
            'message' => 'Customer updated successfully',
            'customer' => $customer
        ]);
    }

    public function destroy(Customer $customer)
    {
        $customer->delete();
        
        return response()->json([
            'message' => 'Customer deleted successfully'
        ]);
    }
}