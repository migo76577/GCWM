<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateDriversTable extends Migration
{
    public function up()
    {
        Schema::create('drivers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('employee_number')->unique();
            $table->string('first_name');
            $table->string('last_name');
            $table->string('phone');
            $table->string('license_number');
            $table->date('license_expiry');
            $table->enum('status', ['active', 'inactive', 'suspended'])->default('active');
            $table->date('hire_date');
            $table->text('address')->nullable();
            $table->timestamps();
            
            $table->index(['status', 'license_expiry']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('drivers');
    }
}