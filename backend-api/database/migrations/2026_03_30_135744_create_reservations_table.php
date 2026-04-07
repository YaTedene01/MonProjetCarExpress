<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public $withinTransaction = false;

    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('reservations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('vehicle_id');
            $table->foreignId('agency_id');
            $table->foreignId('client_id');
            $table->string('pickup_location');
            $table->date('pickup_date');
            $table->string('pickup_time');
            $table->date('return_date');
            $table->string('return_time');
            $table->unsignedInteger('days_count');
            $table->decimal('daily_rate', 12, 2);
            $table->decimal('total_amount', 12, 2);
            $table->string('payment_method');
            $table->string('status')->default('pending')->index();
            $table->string('client_name');
            $table->string('client_phone');
            $table->string('identity_number');
            $table->string('driver_license_number');
            $table->boolean('accepted_terms')->default(false);
            $table->boolean('accepted_agency_terms')->default(false);
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reservations');
    }
};
