<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Customer extends Model
{
    use HasFactory;

    protected $fillable = [
        'customer_number', 'first_name', 'last_name', 'phone', 
        'alternative_phone', 'address', 'city', 'area', 'latitude', 'longitude',
        'registration_status', 'registration_fee', 'registration_paid', 
        'registration_paid_at', 'status', 'notes', 'category_id'
    ];

    protected $casts = [
        'latitude' => 'decimal:8',
        'longitude' => 'decimal:8',
        'registration_fee' => 'decimal:2',
        'registration_paid' => 'boolean',
        'registration_paid_at' => 'datetime',
    ];

    // Relationships

    public function category()
    {
        return $this->belongsTo(CustomerCategory::class, 'category_id');
    }

    public function customerPlans()
    {
        return $this->hasMany(CustomerPlan::class);
    }

    public function activePlan()
    {
        return $this->hasOne(CustomerPlan::class)->where('status', 'active');
    }

    public function collections()
    {
        return $this->hasMany(Collection::class);
    }

    public function invoices()
    {
        return $this->hasMany(Invoice::class);
    }

    public function payments()
    {
        return $this->hasMany(Payment::class);
    }

    public function complaints()
    {
        return $this->hasMany(Complaint::class);
    }

    public function customerRoutes()
    {
        return $this->hasMany(CustomerRoute::class);
    }

    public function activeRoute()
    {
        return $this->hasOne(CustomerRoute::class)->where('status', 'active');
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    public function scopeRegistrationPaid($query)
    {
        return $query->where('registration_paid', true);
    }

    public function scopeWithActivePlan($query)
    {
        return $query->whereHas('activePlan');
    }
}
