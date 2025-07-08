<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class CustomerRouteResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'assigned_date' => $this->assigned_date,
            'removed_date' => $this->removed_date,
            'status' => $this->status,
            'collection_order' => $this->collection_order,
            'special_instructions' => $this->special_instructions,
            'created_at' => $this->created_at,
            'customer' => new CustomerResource($this->whenLoaded('customer')),
            'route' => new RouteResource($this->whenLoaded('route')),
        ];
    }
}
