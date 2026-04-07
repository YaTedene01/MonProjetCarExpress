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
        Schema::create('purchase_requests', function (Blueprint $table) {
            $table->id();
            $table->foreignId('vehicle_id');
            $table->foreignId('agency_id');
            $table->foreignId('client_id');
            $table->decimal('service_fee', 12, 2);
            $table->string('payment_method');
            $table->string('status')->default('pending')->index();
            $table->string('client_name');
            $table->string('client_phone');
            $table->string('client_email')->nullable();
            $table->string('preferred_location')->nullable();
            $table->text('notes')->nullable();
            $table->boolean('accepted_terms')->default(false);
            $table->boolean('accepted_non_refundable')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('purchase_requests');
    }
};
