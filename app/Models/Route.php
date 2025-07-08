<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Route extends Model
{
    use HasFactory;

    protected $fillable = [
        'route_code', 'name', 'description', 'areas_covered', 'collection_days',
        'start_time', 'end_time', 'status', 'max_customers'
    ];

    protected $casts = [
        'areas_covered' => 'array',
        'collection_days' => 'array',
        'start_time' => 'datetime:H:i',
        'end_time' => 'datetime:H:i',
    ];

    // Relationships
    public function routeAssignments()
    {
        return $this->hasMany(RouteAssignment::class);
    }

    public function customerRoutes()
    {
        return $this->hasMany(CustomerRoute::class);
    }

    public function customers()
    {
        return $this->belongsToMany(Customer::class, 'customer_routes')
                    ->wherePivot('status', 'active');
    }

    public function allCustomers()
    {
        return $this->belongsToMany(Customer::class, 'customer_routes');
    }

    public function collections()
    {
        return $this->hasMany(Collection::class);
    }

    public function expenses()
    {
        return $this->hasMany(Expense::class);
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    public function scopeHasCapacity($query)
    {
        return $query->whereColumn('max_customers', '>', 
            \DB::raw('(SELECT COUNT(*) FROM customer_routes WHERE route_id = routes.id AND status = "active")')
        );
    }
}
