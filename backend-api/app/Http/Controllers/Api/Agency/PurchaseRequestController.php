<?php

namespace App\Http\Controllers\Api\Agency;

use App\Enums\VehicleStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\Agency\UpdatePurchaseRequestStatusRequest;
use App\Http\Resources\PurchaseRequestResource;
use App\Models\PurchaseRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use OpenApi\Attributes as OA;

class PurchaseRequestController extends Controller
{
    #[OA\Get(
        path: '/api/v1/agence/demandes-achat',
        tags: ['Agence'],
        security: [['sanctum' => []]],
        responses: [
            new OA\Response(response: 200, description: 'Demandes d achat agence recuperees', content: new OA\JsonContent(properties: [new OA\Property(property: 'status', type: 'boolean', example: true), new OA\Property(property: 'message', type: 'string', example: 'Demandes d achat recuperees avec succes.'), new OA\Property(property: 'data', type: 'array', items: new OA\Items(type: 'object'))], type: 'object')),
            new OA\Response(response: 401, description: 'Token manquant ou invalide', content: new OA\JsonContent(ref: '#/components/schemas/UnauthorizedResponse')),
            new OA\Response(response: 403, description: 'Acces interdit', content: new OA\JsonContent(ref: '#/components/schemas/ForbiddenResponse')),
            new OA\Response(response: 500, description: 'Erreur serveur', content: new OA\JsonContent(ref: '#/components/schemas/ServerErrorResponse'))
        ]
    )]
    public function index(Request $request): JsonResponse
    {
        $requests = PurchaseRequest::query()
            ->with(['vehicle', 'client'])
            ->where('agency_id', $request->user()->agency_id)
            ->latest()
            ->get();

        return $this->successResponse(
            'Demandes d achat recuperees avec succes.',
            PurchaseRequestResource::collection($requests)
        );
    }

    #[OA\Patch(
        path: '/api/v1/agence/demandes-achat/{purchaseRequest}/statut',
        tags: ['Agence'],
        security: [['sanctum' => []]],
        parameters: [new OA\Parameter(name: 'purchaseRequest', in: 'path', required: true, schema: new OA\Schema(type: 'integer'))],
        requestBody: new OA\RequestBody(required: true, content: new OA\JsonContent(required: ['status'], properties: [new OA\Property(property: 'status', type: 'string', example: 'contacted')], type: 'object')),
        responses: [
            new OA\Response(response: 200, description: 'Statut demande achat mis a jour', content: new OA\JsonContent(properties: [new OA\Property(property: 'status', type: 'boolean', example: true), new OA\Property(property: 'message', type: 'string', example: 'Statut de la demande d achat mis a jour.'), new OA\Property(property: 'data', type: 'object')], type: 'object')),
            new OA\Response(response: 401, description: 'Token manquant ou invalide', content: new OA\JsonContent(ref: '#/components/schemas/UnauthorizedResponse')),
            new OA\Response(response: 403, description: 'Acces interdit', content: new OA\JsonContent(ref: '#/components/schemas/ForbiddenResponse')),
            new OA\Response(response: 404, description: 'Demande d achat introuvable', content: new OA\JsonContent(ref: '#/components/schemas/NotFoundResponse')),
            new OA\Response(response: 422, description: 'Erreur de validation', content: new OA\JsonContent(ref: '#/components/schemas/ValidationErrorResponse')),
            new OA\Response(response: 500, description: 'Erreur serveur', content: new OA\JsonContent(ref: '#/components/schemas/ServerErrorResponse'))
        ]
    )]
    public function updateStatus(UpdatePurchaseRequestStatusRequest $request, PurchaseRequest $purchaseRequest): JsonResponse
    {
        abort_unless($purchaseRequest->agency_id === $request->user()->agency_id, 403);

        $status = $request->string('status')->toString();

        $purchaseRequest->update([
            'status' => $status,
        ]);

        if ($purchaseRequest->vehicle) {
            if ($status === 'closed') {
                $purchaseRequest->vehicle->update([
                    'status' => VehicleStatus::Sold->value,
                ]);
            }

            if ($status === 'cancelled' && ($purchaseRequest->vehicle->listing_type?->value ?? $purchaseRequest->vehicle->listing_type) === 'sale') {
                $purchaseRequest->vehicle->update([
                    'status' => VehicleStatus::ForSale->value,
                ]);
            }
        }

        return $this->successResponse(
            'Statut de la demande d achat mis a jour.',
            new PurchaseRequestResource($purchaseRequest->load(['vehicle', 'client']))
        );
    }
}
