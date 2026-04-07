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
        Schema::create('vehicles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('agency_id')->constrained()->cascadeOnDelete();
            $table->string('listing_type')->index();
            $table->string('reference')->unique();
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('brand');
            $table->string('model');
            $table->unsignedSmallInteger('year');
            $table->string('category');
            $table->string('class_name')->nullable();
            $table->decimal('price', 12, 2);
            $table->string('price_unit')->default('day');
            $table->decimal('service_fee', 12, 2)->nullable();
            $table->string('city');
            $table->string('status')->index();
            $table->boolean('is_featured')->default(false);
            $table->string('summary')->nullable();
            $table->text('description')->nullable();
            $table->unsignedSmallInteger('seats')->nullable();
            $table->unsignedSmallInteger('doors')->nullable();
            $table->string('transmission')->nullable();
            $table->string('fuel_type')->nullable();
            $table->unsignedInteger('mileage')->nullable();
            $table->string('engine')->nullable();
            $table->string('consumption')->nullable();
            $table->string('horsepower')->nullable();
            $table->string('location_label')->nullable();
            $table->decimal('rating', 3, 1)->default(0);
            $table->unsignedInteger('reviews_count')->default(0);
            $table->json('gallery')->nullable();
            $table->json('specifications')->nullable();
            $table->json('equipment')->nullable();
            $table->json('tags')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('vehicles');
    }
};
