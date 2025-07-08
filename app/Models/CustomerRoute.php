<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CustomerRoute extends Model
{
    use HasFactory;

    protected $fillable = [
        'customer_id', 'route_id', 'assigned_date', 'removed_date',
        'status', 'collection_order', 'special_instructions'
    ];

    protected $casts = [
        'assigned_date' => 'date',
        'removed_date' => 'date',
    ];

    // Relationships
    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }

    public function route()
    {
        return $this->belongsTo(Route::class);
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }
}
