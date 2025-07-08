<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCustomersTable extends Migration
{
    public function up()
    {
        Schema::create('customers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('customer_number')->unique();
            $table->string('first_name');
            $table->string('last_name');
            $table->string('phone');
            $table->string('alternative_phone')->nullable();
            $table->text('address');
            $table->string('city');
            $table->string('area'); // Specific area/neighborhood
            $table->decimal('latitude', 10, 8);
            $table->decimal('longitude', 11, 8);
            $table->enum('registration_status', ['pending', 'approved', 'rejected'])->default('pending');
            $table->decimal('registration_fee', 8, 2)->default(0);
            $table->boolean('registration_paid')->default(false);
            $table->datetime('registration_paid_at')->nullable();
            $table->enum('status', ['active', 'inactive', 'suspended'])->default('inactive');
            $table->text('notes')->nullable();
            $table->timestamps();
            
            $table->index(['registration_status', 'registration_paid']);
            $table->index(['latitude', 'longitude']);
            $table->index(['city', 'area']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('customers');
    }
}
