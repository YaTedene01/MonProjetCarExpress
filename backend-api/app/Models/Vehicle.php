<?php

namespace App\Models;

use App\Enums\ListingType;
use App\Enums\VehicleStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Vehicle extends Model
{
    use HasFactory;

    protected $fillable = [
        'agency_id',
        'listing_type',
        'reference',
        'name',
        'slug',
        'brand',
        'model',
        'year',
        'category',
        'class_name',
        'price',
        'price_unit',
        'service_fee',
        'city',
        'status',
        'is_featured',
        'summary',
        'description',
        'seats',
        'doors',
        'transmission',
        'fuel_type',
        'mileage',
        'engine',
        'consumption',
        'horsepower',
        'location_label',
        'rating',
        'reviews_count',
        'gallery',
        'specifications',
        'equipment',
        'tags',
    ];

    protected function casts(): array
    {
        return [
            'price' => 'decimal:2',
            'service_fee' => 'decimal:2',
            'rating' => 'decimal:1',
            'is_featured' => 'boolean',
            'gallery' => 'array',
            'specifications' => 'array',
            'equipment' => 'array',
            'tags' => 'array',
            'listing_type' => ListingType::class,
            'status' => VehicleStatus::class,
        ];
    }

    public function agency(): BelongsTo
    {
        return $this->belongsTo(Agency::class);
    }

    public function reservations(): HasMany
    {
        return $this->hasMany(Reservation::class);
    }

    public function purchaseRequests(): HasMany
    {
        return $this->hasMany(PurchaseRequest::class);
    }
}
