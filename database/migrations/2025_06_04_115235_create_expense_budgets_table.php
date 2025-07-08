<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
class CreateExpenseBudgetsTable extends Migration
{
    public function up()
    {
        Schema::create('expense_budgets', function (Blueprint $table) {
            $table->id();
            $table->string('budget_name');
            $table->string('budget_category'); // Links to expenses.budget_category
            $table->year('budget_year');
            $table->enum('budget_period', ['monthly', 'quarterly', 'annually'])->default('monthly');
            $table->integer('period_number')->nullable(); // 1-12 for monthly, 1-4 for quarterly
            $table->decimal('allocated_amount', 12, 2);
            $table->decimal('spent_amount', 12, 2)->default(0.00);
            $table->decimal('remaining_amount', 12, 2)->default(0.00);
            $table->text('description')->nullable();
            $table->enum('status', ['active', 'exceeded', 'completed'])->default('active');
            $table->timestamps();
            
            $table->index(['budget_category', 'budget_year']);
            $table->index(['budget_year', 'budget_period']);
            $table->unique(['budget_category', 'budget_year', 'period_number'], 'unique_budget_period');
        });
    }

    public function down()
    {
        Schema::dropIfExists('expense_budgets');
    }
}