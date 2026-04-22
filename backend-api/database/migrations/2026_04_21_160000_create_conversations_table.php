<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('conversations', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('vehicle_id')->constrained()->onDelete('cascade');
            $table->foreignId('client_id')->constrained('users')->onDelete('cascade');
            $table->unsignedBigInteger('agency_id');
            $table->foreign('agency_id')->references('id')->on('agencies')->onDelete('cascade');
            $table->string('subject');
            $table->string('type')->default('location'); // 'location' | 'achat'
            $table->timestamp('last_message_at')->nullable();
            $table->timestamps();

            $table->unique(['vehicle_id', 'client_id', 'agency_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('conversations');
    }
};
