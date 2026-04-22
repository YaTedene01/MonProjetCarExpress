<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Http\Resources\MissingValue;
use Illuminate\Support\Str;

class AgencyResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $vehicles = $this->whenLoaded('vehicles');

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
            'logo_url' => $this->resolveAssetUrl($request, $this->logo_url),
            'status' => $this->status?->value ?? $this->status,
            'vehicles_count' => $this->whenCounted('vehicles'),
            'vehicles' => $vehicles instanceof MissingValue
                ? $vehicles
                : VehicleResource::collection($vehicles),
            'metadata' => $this->metadata,
            'created_at' => $this->created_at,
        ];
    }

    private function resolveAssetUrl(Request $request, ?string $value): ?string
    {
        $path = trim((string) $value);

        if ($path === '') {
            return null;
        }

        if (Str::startsWith($path, ['http://', 'https://'])) {
            $parsed = parse_url($path);
            $assetPath = $parsed['path'] ?? '';

            if ($assetPath !== '' && Str::startsWith($assetPath, '/storage/')) {
                return $request->getSchemeAndHttpHost().$assetPath;
            }

            return $path;
        }

        if (Str::startsWith($path, '/')) {
            return $request->getSchemeAndHttpHost().$path;
        }

        return $request->getSchemeAndHttpHost().'/'.ltrim($path, '/');
    }
}
