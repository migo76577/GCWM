<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Plan\StorePlanRequest;
use App\Models\Plan;
use App\Models\CustomerPlan;
use App\Models\Invoice;
use Illuminate\Http\Request;

class PlanController extends Controller
{
    public function index()
    {
        $plans = Plan::active()->get();
        return response()->json($plans);
    }

    public function store(StorePlanRequest $request)
    {
        $plan = Plan::create($request->validated());
        return response()->json($plan, 201);
    }

    public function show(Plan $plan)
    {
        return response()->json($plan->load('activeSubscriptions.customer'));
    }

    public function subscribe(Request $request, Plan $plan)
    {
        $request->validate([
            'customer_id' => 'required|exists:customers,id',
        ]);

        $customer = Customer::findOrFail($request->customer_id);

        // Check if customer has paid registration
        if (!$customer->registration_paid) {
            return response()->json(['error' => 'Registration fee must be paid first'], 422);
        }

        // Cancel existing active plan
        $customer->customerPlans()->where('status', 'active')->update([
            'status' => 'cancelled',
            'cancelled_at' => now(),
        ]);

        // Create new subscription
        $subscription = CustomerPlan::create([
            'customer_id' => $customer->id,
            'plan_id' => $plan->id,
            'start_date' => now(),
            'monthly_amount' => $plan->monthly_price,
            'next_billing_date' => now()->addMonth(),
        ]);

        // Generate first invoice
        $invoice = Invoice::create([
            'invoice_number' => 'INV-' . now()->format('YmdHis'),
            'customer_id' => $customer->id,
            'customer_plan_id' => $subscription->id,
            'invoice_type' => 'monthly_plan',
            'invoice_date' => now(),
            'due_date' => now()->addDays(7),
            'amount' => $plan->monthly_price,
            'tax_amount' => 0,
            'total_amount' => $plan->monthly_price,
            'description' => "Monthly subscription: {$plan->name}",
        ]);

        return response()->json([
            'subscription' => $subscription->load('plan'),
            'invoice' => $invoice,
        ]);
    }
}