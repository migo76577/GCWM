<?phpnamespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use App\Models\Collection;

class WasteCollected extends Notification implements ShouldQueue
{
    use Queueable;

    public $collection;

    public function __construct(Collection $collection)
    {
        $this->collection = $collection;
    }

    public function via($notifiable)
    {
        return ['database', 'mail'];
    }

    public function toMail($notifiable)
    {
        return (new MailMessage)
            ->subject('Waste Collection Completed')
            ->greeting('Hello ' . $notifiable->customer->first_name . '!')
            ->line('Your waste has been successfully collected.')
            ->line('Collection Date: ' . $this->collection->collection_date->format('M d, Y'))
            ->line('Collected At: ' . $this->collection->collected_at->format('M d, Y h:i A'))
            ->when($this->collection->notes, function ($message) {
                return $message->line('Notes: ' . $this->collection->notes);
            })
            ->line('Thank you for using our waste management service!')
            ->action('View Collection Details', url('/collections/' . $this->collection->id));
    }

    public function toArray($notifiable)
    {
        return [
            'type' => 'waste_collected',
            'collection_id' => $this->collection->id,
            'collection_number' => $this->collection->collection_number,
            'message' => 'Your waste collection has been completed.',
            'collection_date' => $this->collection->collection_date,
            'collected_at' => $this->collection->collected_at,
            'driver_name' => $this->collection->driver->first_name . ' ' . $this->collection->driver->last_name,
        ];
    }
}