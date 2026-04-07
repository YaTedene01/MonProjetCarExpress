<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AgencyRegistrationRequest extends Model
{
    use HasFactory;

    protected $fillable = [
        'company',
        'email',
        'phone',
        'city',
        'activity',
        'manager_name',
        'district',
        'address',
        'ninea',
        'color',
        'logo_url',
        'password',
        'status',
        'documents',
        'read_at',
        'reviewed_at',
    ];

    protected function casts(): array
    {
        return [
            'documents' => 'array',
            'read_at' => 'datetime',
            'reviewed_at' => 'datetime',
            'password' => 'hashed',
        ];
    }
}
