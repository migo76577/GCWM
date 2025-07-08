<?php
namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use App\Models\Invoice;

class InvoiceGenerated extends Notification implements ShouldQueue
{
    use Queueable;

    public $invoice;

    public function __construct(Invoice $invoice)
    {
        $this->invoice = $invoice;
    }

    public function via($notifiable)
    {
        return ['database', 'mail'];
    }

    public function toMail($notifiable)
    {
        return (new MailMessage)
            ->subject('New Invoice Generated - ' . $this->invoice->invoice_number)
            ->greeting('Hello ' . $notifiable->customer->first_name . '!')
            ->line('A new invoice has been generated for your account.')
            ->line('Invoice Number: ' . $this->invoice->invoice_number)
            ->line('Amount: KSh ' . number_format($this->invoice->total_amount, 2))
            ->line('Due Date: ' . $this->invoice->due_date->format('M d, Y'))
            ->line('Description: ' . $this->invoice->description)
            ->action('Pay Invoice', url('/invoices/' . $this->invoice->id))
            ->line('Please pay your invoice before the due date to avoid service interruption.');
    }

    public function toArray($notifiable)
    {
        return [
            'type' => 'invoice_generated',
            'invoice_id' => $this->invoice->id,
            'invoice_number' => $this->invoice->invoice_number,
            'amount' => $this->invoice->total_amount,
            'due_date' => $this->invoice->due_date,
            'message' => 'New invoice generated: ' . $this->invoice->invoice_number,
        ];
    }
}