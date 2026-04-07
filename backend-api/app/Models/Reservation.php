<?php

namespace App\Models;

use App\Enums\PaymentMethod;
use App\Enums\ReservationStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Reservation extends Model
{
    use HasFactory;

    protected $fillable = [
        'vehicle_id',
        'agency_id',
        'client_id',
        'pickup_location',
        'pickup_date',
        'pickup_time',
        'return_date',
        'return_time',
        'days_count',
        'daily_rate',
        'total_amount',
        'payment_method',
        'status',
        'client_name',
        'client_phone',
        'identity_number',
        'driver_license_number',
        'accepted_terms',
        'accepted_agency_terms',
        'notes',
    ];

    protected function casts(): array
    {
        return [
            'pickup_date' => 'date',
            'return_date' => 'date',
            'daily_rate' => 'decimal:2',
            'total_amount' => 'decimal:2',
            'accepted_terms' => 'boolean',
            'accepted_agency_terms' => 'boolean',
            'payment_method' => PaymentMethod::class,
            'status' => ReservationStatus::class,
        ];
    }

    public function vehicle(): BelongsTo
    {
        return $this->belongsTo(Vehicle::class);
    }

    public function agency(): BelongsTo
    {
        return $this->belongsTo(Agency::class);
    }

    public function client(): BelongsTo
    {
        return $this->belongsTo(User::class, 'client_id');
    }

    public function payment(): HasOne
    {
        return $this->hasOne(Payment::class);
    }
}
