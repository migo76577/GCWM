<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class CustomerResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'customer_number' => $this->customer_number,
            'first_name' => $this->first_name,
            'last_name' => $this->last_name,
            'full_name' => $this->first_name . ' ' . $this->last_name,
            'phone' => $this->phone,
            'alternative_phone' => $this->alternative_phone,
            'address' => $this->address,
            'city' => $this->city,
            'area' => $this->area,
            'location' => [
                'latitude' => $this->latitude,
                'longitude' => $this->longitude,
            ],
            'registration_status' => $this->registration_status,
            'registration_fee' => $this->registration_fee,
            'registration_paid' => $this->registration_paid,
            'registration_paid_at' => $this->registration_paid_at,
            'status' => $this->status,
            'notes' => $this->notes,
            'created_at' => $this->created_at,
            'active_plan' => new CustomerPlanResource($this->whenLoaded('activePlan')),
            'active_route' => new CustomerRouteResource($this->whenLoaded('activeRoute')),
            'collections_count' => $this->whenCounted('collections'),
            'invoices_count' => $this->whenCounted('invoices'),
            'complaints_count' => $this->whenCounted('complaints'),
        ];
    }
}
