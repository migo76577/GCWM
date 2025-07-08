<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePlansTable extends Migration
{
    public function up()
    {
        Schema::create('plans', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('code')->unique(); // BASIC, PREMIUM, etc.
            $table->text('description');
            $table->decimal('monthly_price', 8, 2);
            $table->integer('collections_per_week')->default(1); // How many times per week
            $table->json('features')->nullable(); // Array of plan features
            $table->boolean('is_active')->default(true);
            $table->integer('max_bins')->default(1); // Number of bins provided
            $table->text('terms_conditions')->nullable();
            $table->timestamps();
            
            $table->index(['is_active', 'monthly_price']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('plans');
    }
}
