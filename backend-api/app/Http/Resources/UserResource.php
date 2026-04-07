<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'agency_id' => $this->agency_id,
            'role' => $this->role?->value ?? $this->role,
            'name' => $this->name,
            'email' => $this->email,
            'phone' => $this->phone,
            'city' => $this->city,
            'status' => $this->status,
            'last_login_at' => $this->last_login_at,
            'agency' => new AgencyResource($this->whenLoaded('agency')),
            'created_at' => $this->created_at,
        ];
    }
}
