<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CustomerCategory extends Model
{
    protected $fillable = [
        'name',
        'description',
        'required_fields',
        'optional_fields',
        'is_active',
        'registration_fee',
        'monthly_charge',
        'payment_terms',
        'send_sms_reminders',
    ];

    protected $casts = [
        'required_fields' => 'array',
        'optional_fields' => 'array',
        'is_active' => 'boolean',
        'registration_fee' => 'decimal:2',
        'monthly_charge' => 'decimal:2',
        'send_sms_reminders' => 'boolean',
    ];

    public function customers()
    {
        return $this->hasMany(Customer::class, 'category_id');
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
}
