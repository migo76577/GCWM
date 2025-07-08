<?php


namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'role' => $this->role,
            'status' => $this->status,
            'last_login_at' => $this->last_login_at,
            'created_at' => $this->created_at,
            'customer' => new CustomerResource($this->whenLoaded('customer')),
            'driver' => new DriverResource($this->whenLoaded('driver')),
        ];
    }
}
