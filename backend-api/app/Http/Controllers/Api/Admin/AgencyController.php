<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreAgencyRequest;
use App\Http\Requests\Admin\UpdateAgencyStatusRequest;
use App\Http\Resources\AgencyResource;
use App\Models\Agency;
use App\Repository\AgencyRepository;
use App\Services\AgenceService;
use Illuminate\Http\JsonResponse;
use OpenApi\Attributes as OA;

class AgencyController extends Controller
{
    public function __construct(
        private readonly AgencyRepository $agencies,
        private readonly AgenceService $agenceService
    ) {}

    #[OA\Get(
        path: '/api/v1/administration/agences',
        tags: ['Administration'],
        security: [['sanctum' => []]],
        responses: [
            new OA\Response(
                response: 200,
                description: 'Agences administration recuperees',
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: 'status', type: 'boolean', example: true),
                        new OA\Property(property: 'message', type: 'string', example: 'Agences recuperees avec succes.'),
                        new OA\Property(property: 'data', type: 'array', items: new OA\Items(type: 'object'))
                    ],
                    type: 'object'
                )
            ),
            new OA\Response(response: 401, description: 'Token manquant ou invalide', content: new OA\JsonContent(ref: '#/components/schemas/UnauthorizedResponse')),
            new OA\Response(response: 403, description: 'Acces interdit', content: new OA\JsonContent(ref: '#/components/schemas/ForbiddenResponse')),
            new OA\Response(response: 500, description: 'Erreur serveur', content: new OA\JsonContent(ref: '#/components/schemas/ServerErrorResponse'))
        ]
    )]
    public function index(): JsonResponse
    {
        return $this->successResponse(
            'Agences recuperees avec succes.',
            AgencyResource::collection($this->agencies->getAllWithCount())
        );
    }

    #[OA\Get(
        path: '/api/v1/administration/agences/{agency}',
        tags: ['Administration'],
        security: [['sanctum' => []]],
        parameters: [new OA\Parameter(name: 'agency', in: 'path', required: true, schema: new OA\Schema(type: 'integer'))],
        responses: [
            new OA\Response(
                response: 200,
                description: 'Detail agence administration recupere',
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: 'status', type: 'boolean', example: true),
                        new OA\Property(property: 'message', type: 'string', example: 'Agence recuperee avec succes.'),
                        new OA\Property(property: 'data', type: 'object')
                    ],
                    type: 'object'
                )
            ),
            new OA\Response(response: 401, description: 'Token manquant ou invalide', content: new OA\JsonContent(ref: '#/components/schemas/UnauthorizedResponse')),
            new OA\Response(response: 403, description: 'Acces interdit', content: new OA\JsonContent(ref: '#/components/schemas/ForbiddenResponse')),
            new OA\Response(response: 404, description: 'Agence introuvable', content: new OA\JsonContent(ref: '#/components/schemas/NotFoundResponse')),
            new OA\Response(response: 500, description: 'Erreur serveur', content: new OA\JsonContent(ref: '#/components/schemas/ServerErrorResponse'))
        ]
    )]
    public function show(Agency $agency): JsonResponse
    {
        return $this->successResponse(
            'Agence recuperee avec succes.',
            new AgencyResource($this->agencies->findForAdminShow($agency))
        );
    }

    #[OA\Post(
        path: '/api/v1/administration/agences',
        tags: ['Administration'],
        security: [['sanctum' => []]],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ['name', 'activity', 'city', 'contact_phone', 'manager_name', 'manager_email', 'manager_phone'],
                properties: [
                    new OA\Property(property: 'name', type: 'string', example: 'Dakar Auto Services'),
                    new OA\Property(property: 'activity', type: 'string', example: 'Location et vente'),
                    new OA\Property(property: 'city', type: 'string', example: 'Dakar'),
                    new OA\Property(property: 'contact_phone', type: 'string', example: '+221771234567'),
                    new OA\Property(property: 'manager_name', type: 'string', example: 'Amadou Fall'),
                    new OA\Property(property: 'manager_email', type: 'string', format: 'email', example: 'agency@carexpress.sn'),
                    new OA\Property(property: 'manager_phone', type: 'string', example: '+221778887766')
                ],
                type: 'object'
            )
        ),
        responses: [
            new OA\Response(
                response: 201,
                description: 'Agence creee',
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: 'status', type: 'boolean', example: true),
                        new OA\Property(property: 'message', type: 'string', example: 'Agence creee avec succes.'),
                        new OA\Property(property: 'data', type: 'object')
                    ],
                    type: 'object'
                )
            ),
            new OA\Response(response: 401, description: 'Token manquant ou invalide', content: new OA\JsonContent(ref: '#/components/schemas/UnauthorizedResponse')),
            new OA\Response(response: 403, description: 'Acces interdit', content: new OA\JsonContent(ref: '#/components/schemas/ForbiddenResponse')),
            new OA\Response(response: 422, description: 'Erreur de validation', content: new OA\JsonContent(ref: '#/components/schemas/ValidationErrorResponse')),
            new OA\Response(response: 500, description: 'Erreur serveur', content: new OA\JsonContent(ref: '#/components/schemas/ServerErrorResponse'))
        ]
    )]
    public function store(StoreAgencyRequest $request): JsonResponse
    {
        $agency = $this->agenceService->creerDepuisAdministration($request->validated());

        return $this->successResponse('Agence créée avec succès.', new AgencyResource($agency), 201);
    }

    #[OA\Patch(
        path: '/api/v1/administration/agences/{agency}/statut',
        tags: ['Administration'],
        security: [['sanctum' => []]],
        parameters: [new OA\Parameter(name: 'agency', in: 'path', required: true, schema: new OA\Schema(type: 'integer'))],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ['status'],
                properties: [
                    new OA\Property(property: 'status', type: 'string', example: 'active', enum: ['pending', 'active', 'suspended'])
                ],
                type: 'object'
            )
        ),
        responses: [
            new OA\Response(
                response: 200,
                description: 'Statut agence mis a jour',
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: 'status', type: 'boolean', example: true),
                        new OA\Property(property: 'message', type: 'string', example: 'Statut de l agence mis a jour.'),
                        new OA\Property(property: 'data', type: 'object')
                    ],
                    type: 'object'
                )
            ),
            new OA\Response(response: 401, description: 'Token manquant ou invalide', content: new OA\JsonContent(ref: '#/components/schemas/UnauthorizedResponse')),
            new OA\Response(response: 403, description: 'Acces interdit', content: new OA\JsonContent(ref: '#/components/schemas/ForbiddenResponse')),
            new OA\Response(response: 404, description: 'Agence introuvable', content: new OA\JsonContent(ref: '#/components/schemas/NotFoundResponse')),
            new OA\Response(response: 422, description: 'Erreur de validation', content: new OA\JsonContent(ref: '#/components/schemas/ValidationErrorResponse')),
            new OA\Response(response: 500, description: 'Erreur serveur', content: new OA\JsonContent(ref: '#/components/schemas/ServerErrorResponse'))
        ]
    )]
    public function updateStatus(UpdateAgencyStatusRequest $request, Agency $agency): JsonResponse
    {
        $agency = $this->agencies->updateStatus($agency, $request->string('status')->toString());

        return $this->successResponse('Statut de l\'agence mis à jour.', new AgencyResource($agency));
    }
}
