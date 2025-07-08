<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Expense extends Model
{
    use HasFactory;

    protected $fillable = [
        'expense_number', 'expense_category', 'title', 'description', 'amount',
        'expense_date', 'vendor_supplier', 'invoice_reference', 'vehicle_id',
        'driver_id', 'route_id', 'payment_method', 'payment_reference',
        'payment_status', 'payment_due_date', 'paid_at', 'approval_status',
        'submitted_by', 'approved_by', 'submitted_at', 'approved_at',
        'approval_notes', 'rejection_reason', 'receipts', 'supporting_documents',
        'budget_category', 'budget_year', 'budget_quarter', 'is_recurring',
        'recurring_frequency', 'next_due_date', 'is_reimbursable', 'notes'
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'expense_date' => 'date',
        'payment_due_date' => 'date',
        'paid_at' => 'datetime',
        'submitted_at' => 'datetime',
        'approved_at' => 'datetime',
        'receipts' => 'array',
        'supporting_documents' => 'array',
        'is_recurring' => 'boolean',
        'next_due_date' => 'date',
        'is_reimbursable' => 'boolean',
    ];

    // Relationships
    public function vehicle()
    {
        return $this->belongsTo(Vehicle::class);
    }

    public function driver()
    {
        return $this->belongsTo(Driver::class);
    }

    public function route()
    {
        return $this->belongsTo(Route::class);
    }

    public function submittedBy()
    {
        return $this->belongsTo(User::class, 'submitted_by');
    }

    public function approvedBy()
    {
        return $this->belongsTo(User::class, 'approved_by');
    }

    public function approvals()
    {
        return $this->hasMany(ExpenseApproval::class);
    }

    // Scopes
    public function scopeApproved($query)
    {
        return $query->where('approval_status', 'approved');
    }

    public function scopePendingApproval($query)
    {
        return $query->where('approval_status', 'pending_approval');
    }

    public function scopeForCategory($query, $category)
    {
        return $query->where('expense_category', $category);
    }

    public function scopeForMonth($query, $year, $month)
    {
        return $query->whereYear('expense_date', $year)
                    ->whereMonth('expense_date', $month);
    }
}
