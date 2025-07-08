<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateComplaintsTable extends Migration
{
    public function up()
    {
        Schema::create('complaints', function (Blueprint $table) {
            $table->id();
            $table->string('complaint_number')->unique();
            $table->foreignId('customer_id')->constrained()->onDelete('cascade');
            $table->enum('complaint_type', [
                'missed_collection', 
                'poor_service', 
                'billing_issue', 
                'driver_behavior', 
                'damaged_property', 
                'schedule_change_request',
                'other'
            ]);
            $table->string('subject');
            $table->text('description');
            $table->enum('priority', ['low', 'medium', 'high', 'urgent'])->default('medium');
            $table->enum('status', ['open', 'in_progress', 'resolved', 'closed'])->default('open');
            $table->foreignId('assigned_to')->nullable()->constrained('users')->onDelete('set null');
            $table->datetime('submitted_at')->default(now());
            $table->datetime('resolved_at')->nullable();
            $table->text('admin_response')->nullable();
            $table->text('resolution_notes')->nullable();
            $table->json('attachments')->nullable(); // Photos, documents
            $table->decimal('latitude', 10, 8)->nullable(); // Location if relevant
            $table->decimal('longitude', 11, 8)->nullable();
            $table->timestamps();
            
            $table->index(['customer_id', 'status']);
            $table->index(['status', 'priority']);
            $table->index(['complaint_type', 'status']);
            $table->index(['assigned_to', 'status']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('complaints');
    }
}