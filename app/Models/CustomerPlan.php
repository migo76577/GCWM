<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CustomerPlan extends Model
{
    use HasFactory;

    protected $fillable = [
        'customer_id', 'plan_id', 'start_date', 'end_date', 'status',
        'monthly_amount', 'next_billing_date', 'last_billing_date',
        'auto_renew', 'cancellation_reason', 'cancelled_at'
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'monthly_amount' => 'decimal:2',
        'next_billing_date' => 'date',
        'last_billing_date' => 'date',
        'auto_renew' => 'boolean',
        'cancelled_at' => 'datetime',
    ];

    // Relationships
    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }

    public function plan()
    {
        return $this->belongsTo(Plan::class);
    }

    public function invoices()
    {
        return $this->hasMany(Invoice::class);
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    public function scopeDueForBilling($query)
    {
        return $query->where('next_billing_date', '<=', now()->toDateString())
                    ->where('status', 'active');
    }
}
