<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Vehicle extends Model
{
    use HasFactory;

    protected $fillable = [
        'vehicle_number', 'license_plate', 'make', 'model', 'year',
        'vehicle_type', 'capacity_kg', 'status', 'notes'
    ];

    protected $casts = [
        'capacity_kg' => 'decimal:2',
    ];

    // Relationships
    public function routeAssignments()
    {
        return $this->hasMany(RouteAssignment::class);
    }

    public function collections()
    {
        return $this->hasMany(Collection::class);
    }

    public function expenses()
    {
        return $this->hasMany(Expense::class);
    }

    public function maintenances()
    {
        return $this->hasMany(VehicleMaintenance::class);
    }

    public function activeMaintenance()
    {
        return $this->hasOne(VehicleMaintenance::class)->active()->latest();
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    public function scopeAvailable($query)
    {
        return $query->where('status', 'active');
    }

    public function scopeNotOnMaintenance($query)
    {
        return $query->where('status', '!=', 'maintenance');
    }

    // Helper methods
    public function isOnMaintenance()
    {
        return $this->status === 'maintenance';
    }

    public function hasActiveMaintenance()
    {
        return $this->maintenances()->active()->exists();
    }

    public function updateMaintenanceStatus()
    {
        if ($this->maintenances()->ongoing()->exists()) {
            $this->update(['status' => 'maintenance']);
        } elseif ($this->status === 'maintenance') {
            $this->update(['status' => 'active']);
        }
    }
}
