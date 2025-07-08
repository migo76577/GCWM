<?php

namespace App\Listeners;

use App\Services\BillingService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class CreateInitialInvoice implements ShouldQueue
{
    use InteractsWithQueue;

    protected BillingService $billingService;

    /**
     * Create the event listener.
     */
    public function __construct(BillingService $billingService)
    {
        $this->billingService = $billingService;
    }

    /**
     * Handle the event.
     */
    public function handle($event): void
    {
        $customer = $event->customer;
        
        // Only create initial invoice for approved customers with categories
        if ($customer->registration_status === 'approved' && $customer->category) {
            try {
                $this->billingService->createInitialInvoice($customer);
                \Log::info("Initial invoice created for customer {$customer->id}");
            } catch (\Exception $e) {
                \Log::error("Failed to create initial invoice for customer {$customer->id}: " . $e->getMessage());
            }
        }
    }
}
