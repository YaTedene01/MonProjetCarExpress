<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ReservationResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'status' => $this->status?->value ?? $this->status,
            'pickup_location' => $this->pickup_location,
            'pickup_date' => $this->pickup_date,
            'pickup_time' => $this->pickup_time,
            'return_date' => $this->return_date,
            'return_time' => $this->return_time,
            'days_count' => $this->days_count,
            'daily_rate' => (float) $this->daily_rate,
            'total_amount' => (float) $this->total_amount,
            'payment_method' => $this->payment_method?->value ?? $this->payment_method,
            'client_name' => $this->client_name,
            'client_phone' => $this->client_phone,
            'notes' => $this->notes,
            'vehicle' => new VehicleResource($this->whenLoaded('vehicle')),
            'agency' => new AgencyResource($this->whenLoaded('agency')),
            'client' => new UserResource($this->whenLoaded('client')),
            'created_at' => $this->created_at,
        ];
    }
}
