<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class DriverResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'employee_number' => $this->employee_number,
            'first_name' => $this->first_name,
            'last_name' => $this->last_name,
            'full_name' => $this->first_name . ' ' . $this->last_name,
            'phone' => $this->phone,
            'license_number' => $this->license_number,
            'license_expiry' => $this->license_expiry,
            'license_expires_soon' => $this->license_expiry <= now()->addDays(30),
            'status' => $this->status,
            'hire_date' => $this->hire_date,
            'address' => $this->address,
            'created_at' => $this->created_at,
            'user' => new UserResource($this->whenLoaded('user')),
            'route_assignments_count' => $this->whenCounted('routeAssignments'),
            'collections_count' => $this->whenCounted('collections'),
        ];
    }
}
