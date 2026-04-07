<?php

namespace App\Models;

use App\Enums\PaymentMethod;
use App\Enums\PurchaseRequestStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class PurchaseRequest extends Model
{
    use HasFactory;

    protected $fillable = [
        'vehicle_id',
        'agency_id',
        'client_id',
        'service_fee',
        'payment_method',
        'status',
        'client_name',
        'client_phone',
        'client_email',
        'preferred_location',
        'notes',
        'accepted_terms',
        'accepted_non_refundable',
    ];

    protected function casts(): array
    {
        return [
            'service_fee' => 'decimal:2',
            'accepted_terms' => 'boolean',
            'accepted_non_refundable' => 'boolean',
            'payment_method' => PaymentMethod::class,
            'status' => PurchaseRequestStatus::class,
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
