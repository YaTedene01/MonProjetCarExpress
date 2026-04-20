<?php

namespace App\Http\Controllers\Api\Client;

use App\Http\Controllers\Controller;
use App\Http\Requests\Client\StoreReservationRequest;
use App\Http\Resources\ReservationResource;
use App\Models\Vehicle;
use App\Repository\ReservationRepository;
use App\Services\ReservationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use OpenApi\Attributes as OA;

class ReservationController extends Controller
{
    public function __construct(
        private readonly ReservationRepository $reservations,
        private readonly ReservationService $reservationService
    ) {}

    #[OA\Get(
        path: '/api/v1/client/reservations',
        tags: ['Client'],
        security: [['sanctum' => []]],
        responses: [
            new OA\Response(
                response: 200,
                description: 'Reservations client recuperees',
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: 'status', type: 'boolean', example: true),
                        new OA\Property(property: 'message', type: 'string', example: 'Reservations recuperees avec succes.'),
                        new OA\Property(property: 'data', type: 'array', items: new OA\Items(type: 'object'))
                    ],
                    type: 'object'
                )
            ),
            new OA\Response(response: 401, description: 'Token manquant ou invalide', content: new OA\JsonContent(ref: '#/components/schemas/UnauthorizedResponse')),
            new OA\Response(response: 500, description: 'Erreur serveur', content: new OA\JsonContent(ref: '#/components/schemas/ServerErrorResponse'))
        ]
    )]
    public function index(Request $request): JsonResponse
    {
        return $this->successResponse(
            'Reservations recuperees avec succes.',
            ReservationResource::collection(
                $this->reservations->getClientReservations($request->user()->id)
            )
        );
    }

    #[OA\Post(
        path: '/api/v1/client/reservations',
        tags: ['Client'],
        security: [['sanctum' => []]],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ['vehicle_id', 'pickup_location', 'pickup_date', 'pickup_time', 'return_date', 'return_time', 'payment_method', 'client_name', 'client_phone', 'identity_number', 'driver_license_number', 'accepted_terms', 'accepted_agency_terms'],
                properties: [
                    new OA\Property(property: 'vehicle_id', type: 'integer', example: 12),
                    new OA\Property(property: 'pickup_location', type: 'string', example: 'Aeroport de Dakar'),
                    new OA\Property(property: 'pickup_date', type: 'string', example: '2026-04-05'),
                    new OA\Property(property: 'pickup_time', type: 'string', example: '10:00'),
                    new OA\Property(property: 'return_date', type: 'string', example: '2026-04-10'),
                    new OA\Property(property: 'return_time', type: 'string', example: '09:00'),
                    new OA\Property(property: 'payment_method', type: 'string', example: 'mobile_money'),
                    new OA\Property(property: 'client_name', type: 'string', example: 'Moussa Ndiaye'),
                    new OA\Property(property: 'client_phone', type: 'string', example: '+221771234567')
                ],
                type: 'object'
            )
        ),
        responses: [
            new OA\Response(
                response: 201,
                description: 'Reservation creee',
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: 'status', type: 'boolean', example: true),
                        new OA\Property(property: 'message', type: 'string', example: 'Reservation creee avec succes.'),
                        new OA\Property(property: 'data', type: 'object')
                    ],
                    type: 'object'
                )
            ),
            new OA\Response(response: 401, description: 'Token manquant ou invalide', content: new OA\JsonContent(ref: '#/components/schemas/UnauthorizedResponse')),
            new OA\Response(response: 404, description: 'Vehicule introuvable', content: new OA\JsonContent(ref: '#/components/schemas/NotFoundResponse')),
            new OA\Response(response: 422, description: 'Erreur de validation', content: new OA\JsonContent(ref: '#/components/schemas/ValidationErrorResponse')),
            new OA\Response(response: 500, description: 'Erreur serveur', content: new OA\JsonContent(ref: '#/components/schemas/ServerErrorResponse'))
        ]
    )]
    public function store(StoreReservationRequest $request): JsonResponse
    {
        $vehicle = Vehicle::query()->with('agency')->findOrFail($request->integer('vehicle_id'));
        $reservation = $this->reservationService->creer(
            $request->validated(),
            $vehicle,
            $request->user()->id
        );

        return $this->successResponse(
            'Reservation creee avec succes.',
            new ReservationResource($reservation),
            201
        );
    }
}
