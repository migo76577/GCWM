<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateExpenseApprovalsTable extends Migration
{
    public function up()
    {
        Schema::create('expense_approvals', function (Blueprint $table) {
            $table->id();
            $table->foreignId('expense_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->constrained()->onDelete('cascade'); // Who took the action
            $table->enum('action', ['submitted', 'approved', 'rejected', 'returned_for_revision']);
            $table->text('comments')->nullable();
            $table->datetime('action_date');
            $table->timestamps();
            
            $table->index(['expense_id', 'action_date']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('expense_approvals');
    }
}
