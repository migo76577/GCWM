<?php

namespace App\Services;

use App\Models\Customer;
use App\Models\Route;
use Carbon\Carbon;

class SmsService
{
    /**
     * Send collection reminder SMS to customers on a route
     */
    public function sendCollectionReminders(Route $route, Carbon $collectionDate = null)
    {
        $collectionDate = $collectionDate ?: now()->addDay();
        
        $customers = Customer::whereHas('customerRoutes', function($query) use ($route) {
            $query->where('route_id', $route->id)
                  ->where('status', 'active');
        })
        ->whereHas('category', function($query) {
            $query->where('send_sms_reminders', true);
        })
        ->with('category')
        ->get();

        $sentCount = 0;
        $failedCount = 0;

        foreach ($customers as $customer) {
            try {
                $this->sendCollectionReminder($customer, $route, $collectionDate);
                $sentCount++;
            } catch (\Exception $e) {
                $failedCount++;
                \Log::error("Failed to send SMS to customer {$customer->id}: " . $e->getMessage());
            }
        }

        return [
            'sent' => $sentCount,
            'failed' => $failedCount,
            'total_customers' => $customers->count()
        ];
    }

    /**
     * Send individual collection reminder SMS
     */
    private function sendCollectionReminder(Customer $customer, Route $route, Carbon $collectionDate)
    {
        $message = $this->buildCollectionReminderMessage($customer, $route, $collectionDate);
        
        // For now, we'll log the SMS. In production, integrate with SMS provider like Twilio, Africa's Talking, etc.
        \Log::info("SMS Reminder", [
            'customer_id' => $customer->id,
            'phone' => $customer->phone,
            'message' => $message,
            'route' => $route->name,
            'collection_date' => $collectionDate->format('Y-m-d')
        ]);

        // TODO: Integrate with actual SMS provider
        // Example for Africa's Talking:
        // $this->sendViaSmsProvider($customer->phone, $message);
        
        return true;
    }

    /**
     * Build SMS message for collection reminder
     */
    private function buildCollectionReminderMessage(Customer $customer, Route $route, Carbon $collectionDate)
    {
        $dayName = $collectionDate->format('l'); // e.g., "Monday"
        $dateFormatted = $collectionDate->format('M j'); // e.g., "Dec 25"
        
        return "Hi {$customer->first_name}, reminder: Waste collection for {$route->name} is tomorrow ({$dayName}, {$dateFormatted}). Please have your bins ready by 6 AM. Thank you! - GCWM";
    }

    /**
     * Send payment reminder SMS
     */
    public function sendPaymentReminder(Customer $customer, $amount, $dueDate)
    {
        $message = $this->buildPaymentReminderMessage($customer, $amount, $dueDate);
        
        \Log::info("SMS Payment Reminder", [
            'customer_id' => $customer->id,
            'phone' => $customer->phone,
            'message' => $message,
            'amount' => $amount,
            'due_date' => $dueDate
        ]);

        // TODO: Integrate with actual SMS provider
        return true;
    }

    /**
     * Build SMS message for payment reminder
     */
    private function buildPaymentReminderMessage(Customer $customer, $amount, $dueDate)
    {
        $dueDateFormatted = Carbon::parse($dueDate)->format('M j, Y');
        
        return "Hi {$customer->first_name}, your GCWM invoice of \${$amount} is due on {$dueDateFormatted}. Please pay on time to avoid service interruption. Thank you!";
    }

    /**
     * Send bulk SMS to multiple customers
     */
    public function sendBulkSms(array $customers, string $message)
    {
        $sentCount = 0;
        $failedCount = 0;

        foreach ($customers as $customer) {
            try {
                $personalizedMessage = str_replace('{name}', $customer->first_name, $message);
                $this->sendSms($customer->phone, $personalizedMessage);
                $sentCount++;
            } catch (\Exception $e) {
                $failedCount++;
                \Log::error("Failed to send bulk SMS to customer {$customer->id}: " . $e->getMessage());
            }
        }

        return [
            'sent' => $sentCount,
            'failed' => $failedCount,
            'total' => count($customers)
        ];
    }

    /**
     * Send individual SMS
     */
    private function sendSms($phoneNumber, $message)
    {
        // Clean phone number
        $phone = $this->cleanPhoneNumber($phoneNumber);
        
        \Log::info("SMS Sent", [
            'phone' => $phone,
            'message' => $message,
            'timestamp' => now()
        ]);

        // TODO: Integrate with SMS provider
        // Example implementation:
        /*
        $smsProvider = new SmsProvider();
        return $smsProvider->send($phone, $message);
        */
        
        return true;
    }

    /**
     * Clean and format phone number
     */
    private function cleanPhoneNumber($phone)
    {
        // Remove all non-numeric characters
        $phone = preg_replace('/[^0-9]/', '', $phone);
        
        // Add country code if missing (assuming Kenya +254)
        if (strlen($phone) === 9 && substr($phone, 0, 1) === '7') {
            $phone = '254' . $phone;
        } elseif (strlen($phone) === 10 && substr($phone, 0, 2) === '07') {
            $phone = '254' . substr($phone, 1);
        }
        
        return $phone;
    }

    /**
     * Get SMS statistics
     */
    public function getSmsStatistics()
    {
        // In a real implementation, you'd track SMS sends in a database table
        return [
            'total_sent_today' => 0, // TODO: Implement tracking
            'total_sent_this_month' => 0,
            'failed_today' => 0,
            'cost_this_month' => 0.00
        ];
    }
}