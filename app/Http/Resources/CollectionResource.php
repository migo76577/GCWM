<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class CollectionResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'collection_number' => $this->collection_number,
            'collection_date' => $this->collection_date,
            'collected_at' => $this->collected_at,
            'photos' => $this->photos,
            'notes' => $this->notes,
            'location' => [
                'latitude' => $this->latitude,
                'longitude' => $this->longitude,
            ],
            'status' => $this->status,
            'customer_notified' => $this->customer_notified,
            'customer_notified_at' => $this->customer_notified_at,
            'created_at' => $this->created_at,
            'customer' => new CustomerResource($this->whenLoaded('customer')),
            'route' => new RouteResource($this->whenLoaded('route')),
            'driver' => new DriverResource($this->whenLoaded('driver')),
            'vehicle' => new VehicleResource($this->whenLoaded('vehicle')),
        ];
    }
}

