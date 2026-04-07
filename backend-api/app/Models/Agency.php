<?php

namespace App\Models;

use App\Enums\AgencyStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Agency extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'activity',
        'city',
        'district',
        'address',
        'contact_first_name',
        'contact_last_name',
        'contact_phone',
        'contact_email',
        'ninea',
        'color',
        'logo_url',
        'status',
        'documents',
        'metadata',
    ];

    protected function casts(): array
    {
        return [
            'documents' => 'array',
            'metadata' => 'array',
            'status' => AgencyStatus::class,
        ];
    }

    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }

    public function vehicles(): HasMany
    {
        return $this->hasMany(Vehicle::class);
    }
}
