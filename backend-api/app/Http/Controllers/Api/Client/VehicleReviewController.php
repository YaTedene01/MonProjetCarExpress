<?php

namespace App\Http\Controllers\Api\Client;

use App\Enums\PurchaseRequestStatus;
use App\Enums\ReservationStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\Client\StoreVehicleReviewRequest;
use App\Http\Resources\VehicleResource;
use App\Models\PurchaseRequest;
use App\Models\Reservation;
use App\Models\Vehicle;
use App\Models\VehicleReview;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class VehicleReviewController extends Controller
{
    public function store(StoreVehicleReviewRequest $request, Vehicle $vehicle): JsonResponse
    {
        $clientId = $request->user()->id;

        $reservation = Reservation::query()
            ->where('client_id', $clientId)
            ->where('vehicle_id', $vehicle->id)
            ->whereIn('status', [ReservationStatus::Confirmed->value, ReservationStatus::Completed->value])
            ->whereDate('return_date', '<=', now()->toDateString())
            ->latest('return_date')
            ->first();

        $purchaseRequest = PurchaseRequest::query()
            ->where('client_id', $clientId)
            ->where('vehicle_id', $vehicle->id)
            ->where('status', PurchaseRequestStatus::Closed->value)
            ->latest()
            ->first();

        if ($reservation === null && $purchaseRequest === null) {
            throw ValidationException::withMessages([
                'vehicle' => ['Vous pouvez donner un avis seulement apres avoir utilise ou achete ce vehicule.'],
            ]);
        }

        DB::transaction(function () use ($request, $vehicle, $clientId, $reservation, $purchaseRequest): void {
            VehicleReview::query()->updateOrCreate(
                [
                    'vehicle_id' => $vehicle->id,
                    'client_id' => $clientId,
                ],
                [
                    'agency_id' => $vehicle->agency_id,
                    'reservation_id' => $reservation?->id,
                    'purchase_request_id' => $purchaseRequest?->id,
                    'rating' => $request->integer('rating'),
                    'comment' => $request->string('comment')->toString() ?: null,
                ]
            );

            $stats = VehicleReview::query()
                ->where('vehicle_id', $vehicle->id)
                ->selectRaw('COUNT(*) as reviews_count, COALESCE(AVG(rating), 0) as rating')
                ->first();

            $vehicle->forceFill([
                'reviews_count' => (int) ($stats->reviews_count ?? 0),
                'rating' => round((float) ($stats->rating ?? 0), 1),
            ])->save();
        });

        return $this->successResponse(
            'Avis enregistre avec succes.',
            new VehicleResource($vehicle->fresh()->load(['agency', 'reviews.client']))
        );
    }
}
