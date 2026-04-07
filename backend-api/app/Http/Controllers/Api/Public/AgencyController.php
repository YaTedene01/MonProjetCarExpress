<?php

namespace App\Http\Controllers\Api\Public;

use App\Http\Controllers\Controller;
use App\Http\Resources\AgencyResource;
use App\Models\Agency;
use Illuminate\Http\JsonResponse;
use OpenApi\Attributes as OA;

class AgencyController extends Controller
{
    #[OA\Get(
        path: '/api/v1/catalogue/agences',
        tags: ['Public'],
        responses: [
            new OA\Response(
                response: 200,
                description: 'Liste des agences recuperee',
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: 'status', type: 'boolean', example: true),
                        new OA\Property(property: 'message', type: 'string', example: 'Agences recuperees avec succes.'),
                        new OA\Property(property: 'data', type: 'array', items: new OA\Items(type: 'object'))
                    ],
                    type: 'object'
                )
            ),
            new OA\Response(response: 500, description: 'Erreur serveur', content: new OA\JsonContent(ref: '#/components/schemas/ServerErrorResponse'))
        ]
    )]
    public function listCatalogueAgencies(): JsonResponse
    {
        $agencies = Agency::query()
            ->withCount('vehicles')
            ->where('status', 'active')
            ->latest()
            ->get();

        return $this->successResponse(
            'Agences recuperees avec succes.',
            AgencyResource::collection($agencies)
        );
    }

    #[OA\Get(
        path: '/api/v1/catalogue/agences/{slug}',
        tags: ['Public'],
        parameters: [new OA\Parameter(name: 'slug', in: 'path', required: true, schema: new OA\Schema(type: 'string'))],
        responses: [
            new OA\Response(
                response: 200,
                description: 'Detail agence recupere',
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: 'status', type: 'boolean', example: true),
                        new OA\Property(property: 'message', type: 'string', example: 'Agence recuperee avec succes.'),
                        new OA\Property(property: 'data', type: 'object')
                    ],
                    type: 'object'
                )
            ),
            new OA\Response(response: 404, description: 'Agence introuvable', content: new OA\JsonContent(ref: '#/components/schemas/NotFoundResponse')),
            new OA\Response(response: 500, description: 'Erreur serveur', content: new OA\JsonContent(ref: '#/components/schemas/ServerErrorResponse'))
        ]
    )]
    public function showCatalogueAgency(Agency $agency): JsonResponse
    {
        return $this->successResponse(
            'Agence recuperee avec succes.',
            new AgencyResource($agency->loadCount('vehicles'))
        );
    }
}
