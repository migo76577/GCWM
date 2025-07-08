<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateVehiclesTable extends Migration
{
    public function up()
    {
        Schema::create('vehicles', function (Blueprint $table) {
            $table->id();
            $table->string('vehicle_number')->unique();
            $table->string('license_plate')->unique();
            $table->string('make');
            $table->string('model');
            $table->year('year')->nullable();
            $table->enum('vehicle_type', ['collection_truck', 'pickup', 'van', 'lorry'])->default('collection_truck');
            $table->decimal('capacity_kg', 8, 2)->nullable();
            $table->enum('status', ['active', 'maintenance', 'out_of_service'])->default('active');
            $table->text('notes')->nullable();
            $table->timestamps();
            
            $table->index(['status', 'vehicle_type']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('vehicles');
    }
}