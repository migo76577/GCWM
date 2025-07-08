<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;


class ExpenseApproval extends Model
{
    use HasFactory;

    protected $fillable = [
        'expense_id', 'user_id', 'action', 'comments', 'action_date'
    ];

    protected $casts = [
        'action_date' => 'datetime',
    ];

    // Relationships
    public function expense()
    {
        return $this->belongsTo(Expense::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}