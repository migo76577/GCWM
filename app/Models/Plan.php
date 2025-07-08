<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Plan extends Model
{
    use HasFactory;

    protected $fillable = [
        'name', 'code', 'description', 'monthly_price', 'collections_per_week',
        'features', 'is_active', 'max_bins', 'terms_conditions'
    ];

    protected $casts = [
        'monthly_price' => 'decimal:2',
        'features' => 'array',
        'is_active' => 'boolean',
    ];

    // Relationships
    public function customerPlans()
    {
        return $this->hasMany(CustomerPlan::class);
    }

    public function activeSubscriptions()
    {
        return $this->hasMany(CustomerPlan::class)->where('status', 'active');
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
}
