<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Payment\StorePaymentRequest;
use App\Models\Payment;
use App\Models\Invoice;
use Illuminate\Http\Request;

class PaymentController extends Controller
{
    public function index(Request $request)
    {
        $payments = Payment::with(['customer.user', 'invoice'])
            ->when($request->user()->role === 'customer', fn($q) => $q->where('customer_id', $request->user()->customer->id))
            ->when($request->payment_method, fn($q) => $q->where('payment_method', $request->payment_method))
            ->when($request->status, fn($q) => $q->where('status', $request->status))
            ->orderBy('payment_date', 'desc')
            ->paginate(20);

        return response()->json($payments);
    }

    public function store(StorePaymentRequest $request)
    {
        $invoice = Invoice::findOrFail($request->invoice_id);

        $payment = Payment::create([
            'payment_reference' => 'PAY-' . now()->format('YmdHis'),
            'customer_id' => $invoice->customer_id,
            'invoice_id' => $invoice->id,
            'amount' => $request->amount,
            'payment_method' => $request->payment_method,
            'transaction_reference' => $request->transaction_reference,
            'payment_date' => now(),
            'payment_details' => $request->payment_details,
            'status' => 'pending', // Will be updated by payment gateway webhook
        ]);

        return response()->json($payment, 201);
    }

    public function show(Payment $payment)
    {
        return response()->json($payment->load(['customer.user', 'invoice']));
    }

    public function confirmPayment(Request $request, Payment $payment)
    {
        $request->validate([
            'status' => 'required|in:completed,failed',
            'transaction_reference' => 'nullable|string',
            'payment_details' => 'nullable|array',
        ]);

        $payment->update([
            'status' => $request->status,
            'transaction_reference' => $request->transaction_reference ?? $payment->transaction_reference,
            'payment_details' => array_merge($payment->payment_details ?? [], $request->payment_details ?? []),
        ]);

        // Update invoice status if payment completed
        if ($request->status === 'completed') {
            $payment->invoice->update(['status' => 'paid']);

            // Update customer registration status if this was registration payment
            if ($payment->invoice->invoice_type === 'registration') {
                $payment->customer->update([
                    'registration_paid' => true,
                    'registration_paid_at' => now(),
                    'registration_status' => 'approved',
                    'status' => 'active',
                ]);
            }
        }

        return response()->json($payment->fresh(['customer.user', 'invoice']));
    }
}