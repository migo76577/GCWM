<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('customer_categories', function (Blueprint $table) {
            $table->decimal('registration_fee', 10, 2)->default(0.00);
            $table->decimal('monthly_charge', 10, 2)->default(0.00);
            $table->enum('payment_terms', ['upfront', 'end_of_month'])->default('end_of_month');
            $table->boolean('send_sms_reminders')->default(true);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('customer_categories', function (Blueprint $table) {
            $table->dropColumn(['registration_fee', 'monthly_charge', 'payment_terms', 'send_sms_reminders']);
        });
    }
};
