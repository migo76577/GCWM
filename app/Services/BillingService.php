<?php

namespace App\Services;

use App\Models\Customer;
use App\Models\Invoice;
use App\Models\CustomerCategory;
use Carbon\Carbon;

class BillingService
{
    /**
     * Create initial invoice for a new customer (registration fee + monthly charge)
     */
    public function createInitialInvoice(Customer $customer)
    {
        if (!$customer->category) {
            throw new \Exception('Customer must have a category to generate invoice');
        }

        $category = $customer->category;
        $totalAmount = $category->registration_fee + $category->monthly_charge;
        
        // Set due date based on payment terms
        $dueDate = $category->payment_terms === 'upfront' 
            ? now()->addDays(7) // Upfront: 7 days to pay
            : now()->endOfMonth(); // End of month: due at month end

        return Invoice::create([
            'invoice_number' => $this->generateInvoiceNumber(),
            'customer_id' => $customer->id,
            'invoice_type' => 'initial',
            'invoice_date' => now(),
            'due_date' => $dueDate,
            'amount' => $totalAmount,
            'tax_amount' => 0.00, // No tax for now
            'total_amount' => $totalAmount,
            'status' => 'pending',
            'description' => "Initial invoice: Registration fee (KES " . number_format($category->registration_fee, 2) . ") + Monthly charge (KES " . number_format($category->monthly_charge, 2) . ")",
            'notes' => "Category: {$category->name}, Payment Terms: {$category->payment_terms}"
        ]);
    }

    /**
     * Create monthly recurring invoice for a customer
     */
    public function createMonthlyInvoice(Customer $customer, Carbon $billingMonth = null)
    {
        if (!$customer->category) {
            throw new \Exception('Customer must have a category to generate invoice');
        }

        $billingMonth = $billingMonth ?: now();
        $category = $customer->category;
        
        // Check if monthly invoice already exists for this month
        $existingInvoice = Invoice::where('customer_id', $customer->id)
            ->where('invoice_type', 'monthly')
            ->whereYear('invoice_date', $billingMonth->year)
            ->whereMonth('invoice_date', $billingMonth->month)
            ->first();

        if ($existingInvoice) {
            return $existingInvoice; // Already billed for this month
        }

        // Set due date based on payment terms
        $dueDate = $category->payment_terms === 'upfront' 
            ? $billingMonth->startOfMonth()->addDays(7) // Upfront: due by 7th of month
            : $billingMonth->endOfMonth(); // End of month: due at month end

        return Invoice::create([
            'invoice_number' => $this->generateInvoiceNumber(),
            'customer_id' => $customer->id,
            'invoice_type' => 'monthly',
            'invoice_date' => $billingMonth->endOfMonth(), // Invoice on last day of month
            'due_date' => $dueDate,
            'amount' => $category->monthly_charge,
            'tax_amount' => 0.00,
            'total_amount' => $category->monthly_charge,
            'status' => 'pending',
            'description' => "Monthly service charge for {$billingMonth->format('F Y')} (KES " . number_format($category->monthly_charge, 2) . ")",
            'notes' => "Category: {$category->name}, Payment Terms: {$category->payment_terms}"
        ]);
    }

    /**
     * Generate monthly invoices for all active customers
     */
    public function generateMonthlyInvoices(Carbon $billingMonth = null)
    {
        $billingMonth = $billingMonth ?: now();
        $invoicesCreated = 0;

        $activeCustomers = Customer::where('status', 'active')
            ->where('registration_status', 'approved')
            ->with('category')
            ->get();

        foreach ($activeCustomers as $customer) {
            // Skip customers without categories
            if (!$customer->category) {
                continue;
            }

            // Skip if customer was registered this month (already has initial invoice)
            if ($customer->created_at->year === $billingMonth->year && 
                $customer->created_at->month === $billingMonth->month) {
                continue;
            }

            try {
                $this->createMonthlyInvoice($customer, $billingMonth);
                $invoicesCreated++;
            } catch (\Exception $e) {
                \Log::error("Failed to create monthly invoice for customer {$customer->id}: " . $e->getMessage());
            }
        }

        return $invoicesCreated;
    }

    /**
     * Get customers due for payment reminders
     */
    public function getCustomersForPaymentReminders()
    {
        return Customer::whereHas('invoices', function($query) {
            $query->where('status', 'pending')
                  ->where('due_date', '<=', now()->addDays(3)); // 3 days before due
        })->with(['category', 'invoices' => function($query) {
            $query->where('status', 'pending')
                  ->where('due_date', '<=', now()->addDays(3));
        }])->get();
    }

    /**
     * Mark invoices as overdue
     */
    public function markOverdueInvoices()
    {
        $overdueCount = Invoice::where('status', 'pending')
            ->where('due_date', '<', now())
            ->update(['status' => 'overdue']);

        return $overdueCount;
    }

    /**
     * Generate unique invoice number
     */
    private function generateInvoiceNumber()
    {
        $year = now()->year;
        $month = now()->format('m');
        
        $lastInvoice = Invoice::whereYear('created_at', $year)
            ->whereMonth('created_at', now()->month)
            ->orderBy('id', 'desc')
            ->first();

        $sequence = $lastInvoice ? 
            intval(substr($lastInvoice->invoice_number, -4)) + 1 : 1;

        return sprintf('INV-%s%s-%04d', $year, $month, $sequence);
    }

    /**
     * Calculate total pending amount for a customer
     */
    public function getCustomerPendingAmount(Customer $customer)
    {
        return $customer->invoices()
            ->whereIn('status', ['pending', 'overdue'])
            ->sum('total_amount');
    }

    /**
     * Get billing summary for dashboard
     */
    public function getBillingSummary()
    {
        return [
            'total_pending' => Invoice::whereIn('status', ['pending', 'overdue'])->sum('total_amount'),
            'total_paid_this_month' => Invoice::where('status', 'paid')
                ->whereMonth('updated_at', now()->month)
                ->sum('total_amount'),
            'overdue_invoices' => Invoice::where('status', 'overdue')->count(),
            'pending_invoices' => Invoice::where('status', 'pending')->count(),
        ];
    }
}