<?php

namespace App\Http\Controllers\Api\Admin;

use App\Enums\ListingType;
use App\Enums\VehicleStatus;
use App\Http\Controllers\Controller;
use App\Http\Resources\VehicleResource;
use App\Models\Vehicle;
use Illuminate\Http\JsonResponse;

class VehicleController extends Controller
{
    public function approve(Vehicle $vehicle): JsonResponse
    {
        $listingType = $vehicle->listing_type?->value ?? $vehicle->listing_type;

        $vehicle->update([
            'status' => $listingType === ListingType::Sale->value
                ? VehicleStatus::ForSale->value
                : VehicleStatus::Available->value,
        ]);

        return $this->successResponse(
            'Annonce validee avec succes.',
            new VehicleResource($vehicle->fresh('agency'))
        );
    }
}
