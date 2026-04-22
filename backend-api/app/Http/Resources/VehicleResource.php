<?php

namespace App\Http\Resources;

use App\Services\TarificationService;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Str;

class VehicleResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $pricing = app(TarificationService::class)->describe(
            (float) $this->price,
            $this->listing_type?->value ?? $this->listing_type
        );

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
            'admin_rate' => $pricing['percentage'] ?? null,
            'admin_share_amount' => $pricing['amount'] ?? ($this->service_fee !== null ? (float) $this->service_fee : null),
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
            'reviews' => VehicleReviewResource::collection($this->whenLoaded('reviews')),
            'gallery' => collect($this->gallery ?? [])
                ->map(fn ($item) => $this->resolveAssetUrl($request, $item))
                ->filter()
                ->values()
                ->all(),
            'specifications' => $this->specifications ?? [],
            'equipment' => $this->equipment ?? [],
            'tags' => $this->tags ?? [],
            'agency' => new AgencyResource($this->whenLoaded('agency')),
            'created_at' => $this->created_at,
        ];
    }

    private function resolveAssetUrl(Request $request, mixed $value): ?string
    {
        $path = trim((string) $value);

        if ($path === '') {
            return null;
        }

        if (Str::startsWith($path, ['http://', 'https://', 'blob:'])) {
            return $path;
        }

        if (Str::startsWith($path, '/')) {
            return $request->getSchemeAndHttpHost().$path;
        }

        return $request->getSchemeAndHttpHost().'/'.ltrim($path, '/');
    }
}
