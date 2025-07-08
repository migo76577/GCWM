<?php

namespace App\Http\Controllers;

use App\Models\CustomerCategory;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CustomerCategoryController extends Controller
{
    public function index()
    {
        $categories = CustomerCategory::withCount('customers')->get();
        
        return Inertia::render('CustomerCategories/Index', [
            'categories' => $categories
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:customer_categories',
            'description' => 'nullable|string|max:500',
            'required_fields' => 'required|array',
            'optional_fields' => 'nullable|array',
            'is_active' => 'boolean',
            'registration_fee' => 'required|numeric|min:0',
            'monthly_charge' => 'required|numeric|min:0',
            'payment_terms' => 'required|in:upfront,end_of_month',
            'send_sms_reminders' => 'boolean'
        ]);

        CustomerCategory::create($validated);

        return redirect()->back()->with('success', 'Customer category created successfully.');
    }

    public function update(Request $request, CustomerCategory $customerCategory)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:customer_categories,name,' . $customerCategory->id,
            'description' => 'nullable|string|max:500',
            'required_fields' => 'required|array',
            'optional_fields' => 'nullable|array',
            'is_active' => 'boolean',
            'registration_fee' => 'required|numeric|min:0',
            'monthly_charge' => 'required|numeric|min:0',
            'payment_terms' => 'required|in:upfront,end_of_month',
            'send_sms_reminders' => 'boolean'
        ]);

        $customerCategory->update($validated);

        return redirect()->back()->with('success', 'Customer category updated successfully.');
    }

    public function destroy(CustomerCategory $customerCategory)
    {
        if ($customerCategory->customers()->count() > 0) {
            return redirect()->back()->with('error', 'Cannot delete category with existing customers.');
        }

        $customerCategory->delete();

        return redirect()->back()->with('success', 'Customer category deleted successfully.');
    }
}
