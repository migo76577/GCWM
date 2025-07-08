<?php


namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use App\Models\Payment;

class PaymentReceived extends Notification implements ShouldQueue
{
    use Queueable;

    public $payment;

    public function __construct(Payment $payment)
    {
        $this->payment = $payment;
    }

    public function via($notifiable)
    {
        return ['database', 'mail'];
    }

    public function toMail($notifiable)
    {
        return (new MailMessage)
            ->subject('Payment Received - ' . $this->payment->payment_reference)
            ->greeting('Hello ' . $notifiable->customer->first_name . '!')
            ->line('We have received your payment. Thank you!')
            ->line('Payment Reference: ' . $this->payment->payment_reference)
            ->line('Amount: KSh ' . number_format($this->payment->amount, 2))
            ->line('Payment Method: ' . ucfirst(str_replace('_', ' ', $this->payment->payment_method)))
            ->line('Date: ' . $this->payment->payment_date->format('M d, Y h:i A'))
            ->when($this->payment->transaction_reference, function ($message) {
                return $message->line('Transaction Reference: ' . $this->payment->transaction_reference);
            })
            ->action('View Payment Details', url('/payments/' . $this->payment->id))
            ->line('Your account has been updated accordingly.');
    }

    public function toArray($notifiable)
    {
        return [
            'type' => 'payment_received',
            'payment_id' => $this->payment->id,
            'payment_reference' => $this->payment->payment_reference,
            'amount' => $this->payment->amount,
            'payment_method' => $this->payment->payment_method,
            'message' => 'Payment received: KSh ' . number_format($this->payment->amount, 2),
        ];
    }
}