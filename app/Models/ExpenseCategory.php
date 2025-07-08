<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;


class ExpenseCategory extends Model
{
    use HasFactory;

    protected $fillable = [
        'name', 'code', 'description', 'color_code', 'requires_approval',
        'auto_approval_limit', 'is_active', 'sort_order'
    ];

    protected $casts = [
        'requires_approval' => 'boolean',
        'auto_approval_limit' => 'decimal:2',
        'is_active' => 'boolean',
    ];

    // Relationships
    public function expenses()
    {
        return $this->hasMany(Expense::class, 'expense_category', 'code');
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
}
