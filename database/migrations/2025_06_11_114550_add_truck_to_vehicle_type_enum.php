<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        DB::statement("ALTER TABLE vehicles MODIFY COLUMN vehicle_type ENUM('collection_truck', 'pickup', 'van', 'lorry', 'truck') DEFAULT 'collection_truck'");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::statement("ALTER TABLE vehicles MODIFY COLUMN vehicle_type ENUM('collection_truck', 'pickup', 'van', 'lorry') DEFAULT 'collection_truck'");
    }
};
