<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class VehicleMaintenance extends Model
{
    use HasFactory;

    protected $fillable = [
        'vehicle_id',
        'maintenance_type',
        'description',
        'scheduled_date',
        'start_date',
        'end_date',
        'status',
        'cost',
        'service_provider',
        'notes',
        'parts_replaced'
    ];

    protected $casts = [
        'scheduled_date' => 'date',
        'start_date' => 'date',
        'end_date' => 'date',
        'cost' => 'decimal:2',
        'parts_replaced' => 'array'
    ];

    public function vehicle()
    {
        return $this->belongsTo(Vehicle::class);
    }

    public function scopeActive($query)
    {
        return $query->whereIn('status', ['scheduled', 'in_progress']);
    }

    public function scopeOngoing($query)
    {
        return $query->where('status', 'in_progress')
                    ->orWhere(function ($q) {
                        $q->where('status', 'scheduled')
                          ->where('scheduled_date', '<=', Carbon::today());
                    });
    }

    public function scopeForVehicle($query, $vehicleId)
    {
        return $query->where('vehicle_id', $vehicleId);
    }

    public function isActive()
    {
        return in_array($this->status, ['scheduled', 'in_progress']);
    }

    public function isOngoing()
    {
        return $this->status === 'in_progress' || 
               ($this->status === 'scheduled' && $this->scheduled_date <= Carbon::today());
    }
}
