<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateRoutesTable extends Migration
{
    public function up()
    {
        Schema::create('routes', function (Blueprint $table) {
            $table->id();
            $table->string('route_code')->unique();
            $table->string('name');
            $table->text('description')->nullable();
            $table->json('areas_covered'); // Array of areas this route covers
            $table->json('collection_days'); // ['monday', 'wednesday', 'friday']
            $table->time('start_time')->default('06:00:00');
            $table->time('end_time')->default('18:00:00');
            $table->enum('status', ['active', 'inactive'])->default('active');
            $table->integer('max_customers')->default(50); // Max customers per route
            $table->timestamps();
            
            $table->index(['status']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('routes');
    }
}
