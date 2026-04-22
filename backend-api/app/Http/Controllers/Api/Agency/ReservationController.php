<?php

namespace App\Http\Controllers\Api\Agency;

use App\Enums\VehicleStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\Agency\UpdateReservationStatusRequest;
use App\Http\Resources\ReservationResource;
use App\Models\Reservation;
use App\Repository\ReservationRepository;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use OpenApi\Attributes as OA;

class ReservationController extends Controller
{
    public function __construct(
        private readonly ReservationRepository $reservations
    ) {}

    #[OA\Get(
        path: '/api/v1/agence/reservations',
        tags: ['Agence'],
        security: [['sanctum' => []]],
        responses: [
            new OA\Response(response: 200, description: 'Reservations agence recuperees', content: new OA\JsonContent(properties: [new OA\Property(property: 'status', type: 'boolean', example: true), new OA\Property(property: 'message', type: 'string', example: 'Reservations recuperees avec succes.'), new OA\Property(property: 'data', type: 'array', items: new OA\Items(type: 'object'))], type: 'object')),
            new OA\Response(response: 401, description: 'Token manquant ou invalide', content: new OA\JsonContent(ref: '#/components/schemas/UnauthorizedResponse')),
            new OA\Response(response: 403, description: 'Acces interdit', content: new OA\JsonContent(ref: '#/components/schemas/ForbiddenResponse')),
            new OA\Response(response: 500, description: 'Erreur serveur', content: new OA\JsonContent(ref: '#/components/schemas/ServerErrorResponse'))
        ]
    )]
    public function index(Request $request): JsonResponse
    {
        $reservations = Reservation::query()
            ->with(['vehicle', 'client'])
            ->where('agency_id', $request->user()->agency_id)
            ->latest()
            ->get();

        return $this->successResponse(
            'Reservations recuperees avec succes.',
            ReservationResource::collection($reservations)
        );
    }

    #[OA\Patch(
        path: '/api/v1/agence/reservations/{reservation}/statut',
        tags: ['Agence'],
        security: [['sanctum' => []]],
        parameters: [new OA\Parameter(name: 'reservation', in: 'path', required: true, schema: new OA\Schema(type: 'integer'))],
        requestBody: new OA\RequestBody(required: true, content: new OA\JsonContent(required: ['status'], properties: [new OA\Property(property: 'status', type: 'string', example: 'confirmed')], type: 'object')),
        responses: [
            new OA\Response(response: 200, description: 'Statut reservation mis a jour', content: new OA\JsonContent(properties: [new OA\Property(property: 'status', type: 'boolean', example: true), new OA\Property(property: 'message', type: 'string', example: 'Statut de la reservation mis a jour.'), new OA\Property(property: 'data', type: 'object')], type: 'object')),
            new OA\Response(response: 401, description: 'Token manquant ou invalide', content: new OA\JsonContent(ref: '#/components/schemas/UnauthorizedResponse')),
            new OA\Response(response: 403, description: 'Acces interdit', content: new OA\JsonContent(ref: '#/components/schemas/ForbiddenResponse')),
            new OA\Response(response: 404, description: 'Reservation introuvable', content: new OA\JsonContent(ref: '#/components/schemas/NotFoundResponse')),
            new OA\Response(response: 422, description: 'Erreur de validation', content: new OA\JsonContent(ref: '#/components/schemas/ValidationErrorResponse')),
            new OA\Response(response: 500, description: 'Erreur serveur', content: new OA\JsonContent(ref: '#/components/schemas/ServerErrorResponse'))
        ]
    )]
    public function updateStatus(UpdateReservationStatusRequest $request, Reservation $reservation): JsonResponse
    {
        abort_unless($reservation->agency_id === $request->user()->agency_id, 403);

        $status = $request->string('status')->toString();

        $reservation->update([
            'status' => $status,
        ]);

        $vehicle = $reservation->vehicle;

        if ($vehicle) {
            if (in_array($status, ['pending', 'confirmed'], true)) {
                $vehicle->update([
                    'status' => VehicleStatus::Rented->value,
                ]);
            }

            if (in_array($status, ['completed', 'cancelled', 'rejected'], true)) {
                $stillReserved = $this->reservations->hasActiveReservationForVehicle($vehicle->id, $reservation->id);

                if (! $stillReserved) {
                    $vehicle->update([
                        'status' => VehicleStatus::Available->value,
                    ]);
                }
            }
        }

        return $this->successResponse(
            'Statut de la reservation mis a jour.',
            new ReservationResource($reservation->load(['vehicle', 'client']))
        );
    }
}
