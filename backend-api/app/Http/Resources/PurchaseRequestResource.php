<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PurchaseRequestResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'status' => $this->status?->value ?? $this->status,
            'service_fee' => (float) $this->service_fee,
            'payment_method' => $this->payment_method?->value ?? $this->payment_method,
            'client_name' => $this->client_name,
            'client_phone' => $this->client_phone,
            'client_email' => $this->client_email,
            'preferred_location' => $this->preferred_location,
            'notes' => $this->notes,
            'vehicle' => new VehicleResource($this->whenLoaded('vehicle')),
            'agency' => new AgencyResource($this->whenLoaded('agency')),
            'client' => new UserResource($this->whenLoaded('client')),
            'created_at' => $this->created_at,
        ];
    }
}
