<?php
namespace App\Models;

// use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
class ExpenseBudget extends Model
{
    use HasFactory;

    protected $fillable = [
        'budget_name', 'budget_category', 'budget_year', 'budget_period',
        'period_number', 'allocated_amount', 'spent_amount', 'remaining_amount',
        'description', 'status'
    ];

    protected $casts = [
        'allocated_amount' => 'decimal:2',
        'spent_amount' => 'decimal:2',
        'remaining_amount' => 'decimal:2',
    ];

    // Relationships
    public function expenses()
    {
        return $this->hasMany(Expense::class, 'budget_category', 'budget_category')
                    ->where('budget_year', $this->budget_year);
    }

    // Methods
    public function updateSpentAmount()
    {
        $this->spent_amount = $this->expenses()->where('approval_status', 'approved')->sum('amount');
        $this->remaining_amount = $this->allocated_amount - $this->spent_amount;
        $this->save();
    }
}

