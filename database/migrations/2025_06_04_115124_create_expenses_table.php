<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
class CreateExpensesTable extends Migration
{
    public function up()
    {
        Schema::create('expenses', function (Blueprint $table) {
            $table->id();
            $table->string('expense_number')->unique();
            $table->enum('expense_category', [
                'fuel',
                'vehicle_maintenance',
                'driver_wages',
                'equipment_purchase',
                'office_supplies',
                'insurance',
                'licenses_permits',
                'utilities',
                'marketing',
                'repairs',
                'training',
                'other'
            ]);
            $table->string('title');
            $table->text('description');
            $table->decimal('amount', 10, 2);
            $table->date('expense_date');
            $table->string('vendor_supplier')->nullable();
            $table->string('invoice_reference')->nullable();
            
            // Related entities (nullable - not all expenses relate to specific items)
            $table->foreignId('vehicle_id')->nullable()->constrained()->onDelete('set null');
            $table->foreignId('driver_id')->nullable()->constrained()->onDelete('set null');
            $table->foreignId('route_id')->nullable()->constrained()->onDelete('set null');
            
            // Payment information
            $table->enum('payment_method', [
                'cash',
                'bank_transfer',
                'mpesa',
                'cheque',
                'card',
                'petty_cash'
            ]);
            $table->string('payment_reference')->nullable(); // Transaction ID, cheque number, etc.
            $table->enum('payment_status', [
                'pending',
                'paid',
                'partially_paid',
                'overdue'
            ])->default('pending');
            $table->date('payment_due_date')->nullable();
            $table->datetime('paid_at')->nullable();
            
            // Approval workflow
            $table->enum('approval_status', [
                'draft',
                'pending_approval',
                'approved',
                'rejected'
            ])->default('draft');
            $table->foreignId('submitted_by')->constrained('users')->onDelete('cascade');
            $table->foreignId('approved_by')->nullable()->constrained('users')->onDelete('set null');
            $table->datetime('submitted_at')->nullable();
            $table->datetime('approved_at')->nullable();
            $table->text('approval_notes')->nullable();
            $table->text('rejection_reason')->nullable();
            
            // Document storage
            $table->json('receipts')->nullable(); // Array of receipt file paths/URLs
            $table->json('supporting_documents')->nullable(); // Additional documents
            
            // Budgeting
            $table->string('budget_category')->nullable(); // For budget tracking
            $table->year('budget_year')->default(date('Y'));
            $table->enum('budget_quarter', ['Q1', 'Q2', 'Q3', 'Q4'])->nullable();
            
            // Additional fields
            $table->boolean('is_recurring')->default(false);
            $table->enum('recurring_frequency', ['weekly', 'monthly', 'quarterly', 'annually'])->nullable();
            $table->date('next_due_date')->nullable(); // For recurring expenses
            $table->boolean('is_reimbursable')->default(false); // Can be reimbursed to employee
            $table->text('notes')->nullable();
            
            $table->timestamps();
            
            // Indexes for better performance
            $table->index(['expense_category', 'expense_date']);
            $table->index(['approval_status', 'submitted_at']);
            $table->index(['payment_status', 'payment_due_date']);
            $table->index(['budget_category', 'budget_year']);
            $table->index(['vehicle_id', 'expense_date']);
            $table->index(['driver_id', 'expense_date']);
            $table->index(['is_recurring', 'next_due_date']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('expenses');
    }
}