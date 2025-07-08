<?php

namespace App\Console\Commands;

use App\Models\Route;
use App\Services\SmsService;
use Illuminate\Console\Command;
use Carbon\Carbon;

class SendCollectionReminders extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'sms:collection-reminders {--route=} {--date=}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Send SMS reminders to customers about upcoming waste collection';

    protected SmsService $smsService;

    public function __construct(SmsService $smsService)
    {
        parent::__construct();
        $this->smsService = $smsService;
    }

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $routeId = $this->option('route');
        $collectionDate = $this->option('date') ? Carbon::parse($this->option('date')) : now()->addDay();
        
        if ($routeId) {
            // Send reminders for specific route
            $route = Route::find($routeId);
            if (!$route) {
                $this->error("Route with ID {$routeId} not found");
                return 1;
            }
            
            $this->sendRemindersForRoute($route, $collectionDate);
        } else {
            // Send reminders for all routes scheduled for tomorrow
            $this->sendRemindersForAllRoutes($collectionDate);
        }
        
        return 0;
    }

    private function sendRemindersForRoute(Route $route, Carbon $collectionDate)
    {
        $this->info("Sending collection reminders for route: {$route->name}");
        $this->info("Collection date: {$collectionDate->format('l, F j, Y')}");
        
        try {
            $result = $this->smsService->sendCollectionReminders($route, $collectionDate);
            
            $this->info("SMS Reminders sent successfully!");
            $this->table(
                ['Metric', 'Count'],
                [
                    ['Total Customers', $result['total_customers']],
                    ['SMS Sent', $result['sent']],
                    ['Failed', $result['failed']],
                ]
            );
            
        } catch (\Exception $e) {
            $this->error("Error sending SMS reminders: " . $e->getMessage());
        }
    }

    private function sendRemindersForAllRoutes(Carbon $collectionDate)
    {
        $this->info("Sending collection reminders for all routes");
        $this->info("Collection date: {$collectionDate->format('l, F j, Y')}");
        
        $routes = Route::where('is_active', true)->get();
        $totalSent = 0;
        $totalFailed = 0;
        $totalCustomers = 0;
        
        foreach ($routes as $route) {
            try {
                $result = $this->smsService->sendCollectionReminders($route, $collectionDate);
                $totalSent += $result['sent'];
                $totalFailed += $result['failed'];
                $totalCustomers += $result['total_customers'];
                
                $this->line("Route {$route->name}: {$result['sent']} sent, {$result['failed']} failed");
                
            } catch (\Exception $e) {
                $this->error("Error sending SMS for route {$route->name}: " . $e->getMessage());
            }
        }
        
        $this->info("\nSummary:");
        $this->table(
            ['Metric', 'Count'],
            [
                ['Total Routes', $routes->count()],
                ['Total Customers', $totalCustomers],
                ['SMS Sent', $totalSent],
                ['Failed', $totalFailed],
            ]
        );
    }
}
