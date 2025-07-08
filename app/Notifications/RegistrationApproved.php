<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use App\Models\Customer;

class RegistrationApproved extends Notification implements ShouldQueue
{
    use Queueable;

    public $customer;

    public function __construct(Customer $customer)
    {
        $this->customer = $customer;
    }

    public function via($notifiable)
    {
        return ['database', 'mail'];
    }

    public function toMail($notifiable)
    {
        return (new MailMessage)
            ->subject('Registration Approved - Welcome to GCWM!')
            ->greeting('Hello ' . $this->customer->first_name . '!')
            ->line('Congratulations! Your registration has been approved.')
            ->line('Customer Number: ' . $this->customer->customer_number)
            ->line('You can now subscribe to our waste collection plans.')
            ->action('View Available Plans', url('/plans'))
            ->line('Thank you for choosing our waste management service!');
    }

    public function toArray($notifiable)
    {
        return [
            'type' => 'registration_approved',
            'customer_id' => $this->customer->id,
            'customer_number' => $this->customer->customer_number,
            'message' => 'Your registration has been approved! You can now subscribe to our plans.',
        ];
    }
}