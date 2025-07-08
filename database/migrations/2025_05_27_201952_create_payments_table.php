<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePaymentsTable extends Migration
{
    public function up()
    {
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->string('payment_reference')->unique();
            $table->foreignId('customer_id')->constrained()->onDelete('cascade');
            $table->foreignId('invoice_id')->constrained()->onDelete('cascade');
            $table->decimal('amount', 10, 2);
            $table->enum('payment_method', ['mpesa', 'bank_transfer', 'cash', 'card', 'airtel_money']);
            $table->string('transaction_reference')->nullable(); // Mpesa transaction ID, etc.
            $table->datetime('payment_date');
            $table->enum('status', ['pending', 'completed', 'failed', 'cancelled'])->default('pending');
            $table->json('payment_details')->nullable(); // Additional payment gateway response
            $table->text('notes')->nullable();
            $table->timestamps();
            
            $table->index(['customer_id', 'status']);
            $table->index(['payment_date', 'status']);
            $table->index(['transaction_reference']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('payments');
    }
}