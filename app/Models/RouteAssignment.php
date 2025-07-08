<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RouteAssignment extends Model
{
    use HasFactory;

    protected $fillable = [
        'route_id', 'vehicle_id', 'driver_id', 'assignment_date', 'status', 'notes'
    ];

    protected $casts = [
        'assignment_date' => 'date',
    ];

    // Relationships
    public function route()
    {
        return $this->belongsTo(Route::class);
    }

    public function vehicle()
    {
        return $this->belongsTo(Vehicle::class);
    }

    public function driver()
    {
        return $this->belongsTo(Driver::class);
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    public function scopeForDate($query, $date)
    {
        return $query->where('assignment_date', $date);
    }
}
