<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCustomerRoutesTable extends Migration
{
    public function up()
    {
        Schema::create('customer_routes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('customer_id')->constrained()->onDelete('cascade');
            $table->foreignId('route_id')->constrained()->onDelete('cascade');
            $table->date('assigned_date');
            $table->date('removed_date')->nullable();
            $table->enum('status', ['active', 'removed'])->default('active');
            $table->integer('collection_order')->nullable(); // Order of collection on route
            $table->text('special_instructions')->nullable();
            $table->timestamps();
            
            $table->index(['route_id', 'status']);
            $table->index(['customer_id', 'status']);
            $table->unique(['customer_id', 'assigned_date'], 'unique_customer_route_assignment');
        });
    }

    public function down()
    {
        Schema::dropIfExists('customer_routes');
    }
}