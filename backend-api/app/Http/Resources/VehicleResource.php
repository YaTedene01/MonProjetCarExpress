<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class VehicleResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'agency_id' => $this->agency_id,
            'reference' => $this->reference,
            'listing_type' => $this->listing_type?->value ?? $this->listing_type,
            'name' => $this->name,
            'slug' => $this->slug,
            'brand' => $this->brand,
            'model' => $this->model,
            'year' => $this->year,
            'category' => $this->category,
            'class_name' => $this->class_name,
            'price' => (float) $this->price,
            'price_unit' => $this->price_unit,
            'service_fee' => $this->service_fee !== null ? (float) $this->service_fee : null,
            'city' => $this->city,
            'status' => $this->status?->value ?? $this->status,
            'is_featured' => $this->is_featured,
            'summary' => $this->summary,
            'description' => $this->description,
            'seats' => $this->seats,
            'doors' => $this->doors,
            'transmission' => $this->transmission,
            'fuel_type' => $this->fuel_type,
            'mileage' => $this->mileage,
            'engine' => $this->engine,
            'consumption' => $this->consumption,
            'horsepower' => $this->horsepower,
            'location_label' => $this->location_label,
            'rating' => (float) $this->rating,
            'reviews_count' => $this->reviews_count,
            'gallery' => $this->gallery ?? [],
            'specifications' => $this->specifications ?? [],
            'equipment' => $this->equipment ?? [],
            'tags' => $this->tags ?? [],
            'agency' => new AgencyResource($this->whenLoaded('agency')),
            'created_at' => $this->created_at,
        ];
    }
}
