<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('agency_registration_requests', function (Blueprint $table): void {
            $table->id();
            $table->string('company');
            $table->string('email');
            $table->string('phone', 30);
            $table->string('city', 100);
            $table->string('activity', 100)->nullable();
            $table->string('manager_name');
            $table->string('district', 100)->nullable();
            $table->string('address')->nullable();
            $table->string('ninea', 100);
            $table->string('status', 30)->default('pending');
            $table->json('documents')->nullable();
            $table->timestamp('read_at')->nullable();
            $table->timestamp('reviewed_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('agency_registration_requests');
    }
};
