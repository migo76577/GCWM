<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class PlanResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'code' => $this->code,
            'description' => $this->description,
            'monthly_price' => $this->monthly_price,
            'collections_per_week' => $this->collections_per_week,
            'features' => $this->features,
            'max_bins' => $this->max_bins,
            'is_active' => $this->is_active,
            'terms_conditions' => $this->terms_conditions,
            'created_at' => $this->created_at,
            'active_subscriptions_count' => $this->whenCounted('activeSubscriptions'),
        ];
    }
}
