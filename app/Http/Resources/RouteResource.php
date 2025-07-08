<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class RouteResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'route_code' => $this->route_code,
            'name' => $this->name,
            'description' => $this->description,
            'areas_covered' => $this->areas_covered,
            'collection_days' => $this->collection_days,
            'start_time' => $this->start_time,
            'end_time' => $this->end_time,
            'status' => $this->status,
            'max_customers' => $this->max_customers,
            'current_customers_count' => $this->whenCounted('customers'),
            'has_capacity' => $this->when(
                $this->relationLoaded('customers'),
                fn() => $this->customers_count < $this->max_customers
            ),
            'created_at' => $this->created_at,
            'customers' => CustomerResource::collection($this->whenLoaded('customers')),
        ];
    }
}