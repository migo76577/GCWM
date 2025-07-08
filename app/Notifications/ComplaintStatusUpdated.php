<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use App\Models\Complaint;

class ComplaintStatusUpdated extends Notification implements ShouldQueue
{
    use Queueable;

    public $complaint;

    public function __construct(Complaint $complaint)
    {
        $this->complaint = $complaint;
    }

    public function via($notifiable)
    {
        return ['database', 'mail'];
    }

    public function toMail($notifiable)
    {
        return (new MailMessage)
            ->subject('Complaint Update - ' . $this->complaint->complaint_number)
            ->greeting('Hello ' . $notifiable->customer->first_name . '!')
            ->line('There has been an update on your complaint.')
            ->line('Complaint Number: ' . $this->complaint->complaint_number)
            ->line('Subject: ' . $this->complaint->subject)
            ->line('Status: ' . ucfirst(str_replace('_', ' ', $this->complaint->status)))
            ->when($this->complaint->admin_response, function ($message) {
                return $message->line('Response: ' . $this->complaint->admin_response);
            })
            ->when($this->complaint->resolution_notes && $this->complaint->status === 'resolved', function ($message) {
                return $message->line('Resolution: ' . $this->complaint->resolution_notes);
            })
            ->action('View Complaint', url('/complaints/' . $this->complaint->id))
            ->line('Thank you for your patience.');
    }

    public function toArray($notifiable)
    {
        return [
            'type' => 'complaint_updated',
            'complaint_id' => $this->complaint->id,
            'complaint_number' => $this->complaint->complaint_number,
            'status' => $this->complaint->status,
            'message' => 'Complaint ' . $this->complaint->complaint_number . ' has been updated to: ' . ucfirst(str_replace('_', ' ', $this->complaint->status)),
        ];
    }
}