<?php

namespace App\Repository;

use App\Models\Vehicle;
use Illuminate\Http\Request;

class VehicleRepository
{
    public function getPublicCatalog(Request $request)
    {
        return Vehicle::query()
            ->with('agency')
            ->when($request->filled('listing_type'), fn ($query) => $query->where('listing_type', $request->string('listing_type')))
            ->when($request->filled('city'), fn ($query) => $query->where('city', $request->string('city')))
            ->when($request->filled('category'), fn ($query) => $query->where('category', $request->string('category')))
            ->when($request->filled('brand'), fn ($query) => $query->where('brand', $request->string('brand')))
            ->when($request->filled('search'), function ($query) use ($request): void {
                $search = $request->string('search')->toString();
                $query->where(function ($inner) use ($search): void {
                    $inner->where('name', 'like', "%{$search}%")
                        ->orWhere('brand', 'like', "%{$search}%")
                        ->orWhere('model', 'like', "%{$search}%")
                        ->orWhere('city', 'like', "%{$search}%");
                });
            })
            ->when($request->filled('min_price'), fn ($query) => $query->where('price', '>=', $request->float('min_price')))
            ->when($request->filled('max_price'), fn ($query) => $query->where('price', '<=', $request->float('max_price')))
            ->when($request->boolean('featured'), fn ($query) => $query->where('is_featured', true))
            ->latest()
            ->get();
    }

    public function getAgencyVehicles(int $agencyId)
    {
        return Vehicle::query()
            ->where('agency_id', $agencyId)
            ->latest()
            ->get();
    }

    public function create(array $data): Vehicle
    {
        return Vehicle::query()->create($data);
    }

    public function update(Vehicle $vehicle, array $data): Vehicle
    {
        $vehicle->update($data);

        return $vehicle->fresh();
    }

    public function getMetadata(): array
    {
        return [
            'marques' => Vehicle::query()->distinct()->orderBy('brand')->pluck('brand'),
            'categories' => Vehicle::query()->distinct()->orderBy('category')->pluck('category'),
            'villes' => Vehicle::query()->distinct()->orderBy('city')->pluck('city'),
            'types_annonce' => ['rental', 'sale'],
        ];
    }
}
