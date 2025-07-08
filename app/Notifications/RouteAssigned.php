<?php


namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use App\Models\CustomerRoute;

class RouteAssigned extends Notification implements ShouldQueue
{
    use Queueable;

    public $customerRoute;

    public function __construct(CustomerRoute $customerRoute)
    {
        $this->customerRoute = $customerRoute;
    }

    public function via($notifiable)
    {
        return ['database', 'mail'];
    }

    public function toMail($notifiable)
    {
        $route = $this->customerRoute->route;
        
        return (new MailMessage)
            ->subject('Collection Route Assigned')
            ->greeting('Hello ' . $notifiable->customer->first_name . '!')
            ->line('You have been assigned to a collection route.')
            ->line('Route: ' . $route->name . ' (' . $route->route_code . ')')
            ->line('Collection Days: ' . implode(', ', array_map('ucfirst', $route->collection_days)))
            ->line('Collection Time: ' . $route->start_time . ' - ' . $route->end_time)
            ->when($this->customerRoute->special_instructions, function ($message) {
                return $message->line('Special Instructions: ' . $this->customerRoute->special_instructions);
            })
            ->line('Our driver will visit you on the scheduled days during the specified time window.')
            ->line('Please ensure your waste is ready for collection.');
    }

    public function toArray($notifiable)
    {
        return [
            'type' => 'route_assigned',
            'customer_route_id' => $this->customerRoute->id,
            'route_name' => $this->customerRoute->route->name,
            'route_code' => $this->customerRoute->route->route_code,
            'collection_days' => $this->customerRoute->route->collection_days,
            'message' => 'You have been assigned to route: ' . $this->customerRoute->route->name,
        ];
    }
}