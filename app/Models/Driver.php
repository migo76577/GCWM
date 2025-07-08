<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Driver extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id', 'employee_number', 'first_name', 'last_name', 'phone',
        'license_number', 'license_expiry', 'status', 'hire_date', 'address'
    ];

    protected $casts = [
        'license_expiry' => 'date',
        'hire_date' => 'date',
    ];

    // Relationships
    public function user()
    {
        return $this->belongsTo(User::class);
    }

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

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    public function scopeLicenseExpiringSoon($query, $days = 30)
    {
        return $query->where('license_expiry', '<=', now()->addDays($days)->toDateString());
    }
}