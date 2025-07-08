<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCollectionsTable extends Migration
{
    public function up()
    {
        Schema::create('collections', function (Blueprint $table) {
            $table->id();
            $table->string('collection_number')->unique();
            $table->foreignId('customer_id')->constrained()->onDelete('cascade');
            $table->foreignId('route_id')->constrained();
            $table->foreignId('driver_id')->constrained();
            $table->foreignId('vehicle_id')->constrained();
            $table->date('collection_date');
            $table->datetime('collected_at');
            $table->json('photos'); // Array of photo URLs/paths
            $table->text('notes')->nullable();
            $table->decimal('latitude', 10, 8)->nullable(); // GPS location when collected
            $table->decimal('longitude', 11, 8)->nullable();
            $table->enum('status', ['completed', 'missed', 'partial'])->default('completed');
            $table->boolean('customer_notified')->default(false);
            $table->datetime('customer_notified_at')->nullable();
            $table->timestamps();
            
            $table->index(['customer_id', 'collection_date']);
            $table->index(['route_id', 'collection_date']);
            $table->index(['driver_id', 'collection_date']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('collections');
    }
}
