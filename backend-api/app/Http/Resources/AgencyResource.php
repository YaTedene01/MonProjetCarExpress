<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AgencyResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
            'activity' => $this->activity,
            'city' => $this->city,
            'district' => $this->district,
            'address' => $this->address,
            'contact_phone' => $this->contact_phone,
            'contact_email' => $this->contact_email,
            'color' => $this->color,
            'logo_url' => $this->logo_url,
            'status' => $this->status?->value ?? $this->status,
            'vehicles_count' => $this->whenCounted('vehicles'),
            'metadata' => $this->metadata,
            'created_at' => $this->created_at,
        ];
    }
}
