<?php

namespace App\Console\Commands;

use App\Services\BillingService;
use Illuminate\Console\Command;
use Carbon\Carbon;

class GenerateMonthlyBilling extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'billing:generate-monthly {--month=} {--year=}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Generate monthly invoices for all active customers';

    protected BillingService $billingService;

    public function __construct(BillingService $billingService)
    {
        parent::__construct();
        $this->billingService = $billingService;
    }

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $month = $this->option('month') ?: now()->month;
        $year = $this->option('year') ?: now()->year;
        
        $billingMonth = Carbon::create($year, $month, 1);
        
        $this->info("Generating monthly invoices for {$billingMonth->format('F Y')}...");
        
        try {
            // Generate monthly invoices
            $invoicesCreated = $this->billingService->generateMonthlyInvoices($billingMonth);
            
            // Mark overdue invoices
            $overdueMarked = $this->billingService->markOverdueInvoices();
            
            $this->info("Successfully created {$invoicesCreated} monthly invoices");
            $this->info("Marked {$overdueMarked} invoices as overdue");
            
            // Show billing summary
            $summary = $this->billingService->getBillingSummary();
            
            $this->table(
                ['Metric', 'Value'],
                [
                    ['Total Pending Amount', '$' . number_format($summary['total_pending'], 2)],
                    ['Paid This Month', '$' . number_format($summary['total_paid_this_month'], 2)],
                    ['Overdue Invoices', $summary['overdue_invoices']],
                    ['Pending Invoices', $summary['pending_invoices']],
                ]
            );
            
        } catch (\Exception $e) {
            $this->error("Error generating monthly billing: " . $e->getMessage());
            return 1;
        }
        
        return 0;
    }
}
