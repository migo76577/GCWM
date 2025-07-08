<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class VehicleResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'vehicle_number' => $this->vehicle_number,
            'license_plate' => $this->license_plate,
            'make' => $this->make,
            'model' => $this->model,
            'year' => $this->year,
            'vehicle_type' => $this->vehicle_type,
            'capacity_kg' => $this->capacity_kg,
            'status' => $this->status,
            'notes' => $this->notes,
            'created_at' => $this->created_at,
            'route_assignments_count' => $this->whenCounted('routeAssignments'),
            'collections_count' => $this->whenCounted('collections'),
        ];
    }
}
