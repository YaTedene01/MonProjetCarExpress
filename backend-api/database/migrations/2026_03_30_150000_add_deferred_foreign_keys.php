<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public $withinTransaction = false;

    public function up(): void
    {
        Schema::table('reservations', function (Blueprint $table): void {
            $table->foreign('vehicle_id')->references('id')->on('vehicles')->cascadeOnDelete();
            $table->foreign('agency_id')->references('id')->on('agencies')->cascadeOnDelete();
            $table->foreign('client_id')->references('id')->on('users')->cascadeOnDelete();
        });

        Schema::table('purchase_requests', function (Blueprint $table): void {
            $table->foreign('vehicle_id')->references('id')->on('vehicles')->cascadeOnDelete();
            $table->foreign('agency_id')->references('id')->on('agencies')->cascadeOnDelete();
            $table->foreign('client_id')->references('id')->on('users')->cascadeOnDelete();
        });

        Schema::table('payments', function (Blueprint $table): void {
            $table->foreign('reservation_id')->references('id')->on('reservations')->cascadeOnDelete();
            $table->foreign('purchase_request_id')->references('id')->on('purchase_requests')->cascadeOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('payments', function (Blueprint $table): void {
            $table->dropForeign(['reservation_id']);
            $table->dropForeign(['purchase_request_id']);
        });

        Schema::table('purchase_requests', function (Blueprint $table): void {
            $table->dropForeign(['vehicle_id']);
            $table->dropForeign(['agency_id']);
            $table->dropForeign(['client_id']);
        });

        Schema::table('reservations', function (Blueprint $table): void {
            $table->dropForeign(['vehicle_id']);
            $table->dropForeign(['agency_id']);
            $table->dropForeign(['client_id']);
        });
    }
};
