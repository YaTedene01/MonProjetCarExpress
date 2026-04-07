<?php

namespace App\Http\Controllers\Api\Client;

use App\Http\Controllers\Controller;
use App\Http\Requests\Client\StorePurchaseRequestRequest;
use App\Http\Resources\PurchaseRequestResource;
use App\Models\Vehicle;
use App\Repository\PurchaseRequestRepository;
use App\Services\DemandeAchatService;
use Illuminate\Http\JsonResponse;
use OpenApi\Attributes as OA;

class PurchaseRequestController extends Controller
{
    public function __construct(
        private readonly PurchaseRequestRepository $purchaseRequests,
        private readonly DemandeAchatService $demandeAchatService
    ) {}

    #[OA\Get(
        path: '/api/v1/client/demandes-achat',
        tags: ['Client'],
        security: [['sanctum' => []]],
        responses: [
            new OA\Response(
                response: 200,
                description: 'Demandes d achat client recuperees',
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: 'status', type: 'boolean', example: true),
                        new OA\Property(property: 'message', type: 'string', example: 'Demandes d achat recuperees avec succes.'),
                        new OA\Property(property: 'data', type: 'array', items: new OA\Items(type: 'object'))
                    ],
                    type: 'object'
                )
            ),
            new OA\Response(response: 401, description: 'Token manquant ou invalide', content: new OA\JsonContent(ref: '#/components/schemas/UnauthorizedResponse')),
            new OA\Response(response: 500, description: 'Erreur serveur', content: new OA\JsonContent(ref: '#/components/schemas/ServerErrorResponse'))
        ]
    )]
    public function index(): JsonResponse
    {
        return $this->successResponse(
            'Demandes d achat recuperees avec succes.',
            PurchaseRequestResource::collection(
                $this->purchaseRequests->getClientRequests(auth()->id())
            )
        );
    }

    #[OA\Post(
        path: '/api/v1/client/demandes-achat',
        tags: ['Client'],
        security: [['sanctum' => []]],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ['vehicle_id', 'payment_method', 'client_name', 'client_phone', 'accepted_terms', 'accepted_non_refundable'],
                properties: [
                    new OA\Property(property: 'vehicle_id', type: 'integer', example: 18),
                    new OA\Property(property: 'payment_method', type: 'string', example: 'card'),
                    new OA\Property(property: 'client_name', type: 'string', example: 'Moussa Ndiaye'),
                    new OA\Property(property: 'client_phone', type: 'string', example: '+221771234567'),
                    new OA\Property(property: 'client_email', type: 'string', format: 'email', example: 'moussa@carexpress.sn')
                ],
                type: 'object'
            )
        ),
        responses: [
            new OA\Response(
                response: 201,
                description: 'Demande d achat creee',
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: 'status', type: 'boolean', example: true),
                        new OA\Property(property: 'message', type: 'string', example: 'Demande d achat creee avec succes.'),
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
    public function store(StorePurchaseRequestRequest $request): JsonResponse
    {
        $vehicle = Vehicle::query()->with('agency')->findOrFail($request->integer('vehicle_id'));
        $purchaseRequest = $this->demandeAchatService->creer(
            $request->validated(),
            $vehicle,
            $request->user()->id
        );

        return $this->successResponse(
            'Demande d\'achat créée avec succès.',
            new PurchaseRequestResource($purchaseRequest),
            201
        );
    }
}
