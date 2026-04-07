<?php

namespace App\Http\Controllers\Api\Agency;

use App\Http\Controllers\Controller;
use App\Http\Requests\Agency\AgencyProfileUpdateRequest;
use App\Http\Resources\AgencyResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use OpenApi\Attributes as OA;

class ProfileController extends Controller
{
    #[OA\Get(
        path: '/api/v1/agence/profil',
        tags: ['Agence'],
        security: [['sanctum' => []]],
        responses: [
            new OA\Response(
                response: 200,
                description: 'Profil agence recupere',
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: 'status', type: 'boolean', example: true),
                        new OA\Property(property: 'message', type: 'string', example: 'Profil agence recupere avec succes.'),
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
    public function show(Request $request): JsonResponse
    {
        return $this->successResponse(
            'Profil agence recupere avec succes.',
            new AgencyResource($request->user()->agency()->withCount('vehicles')->firstOrFail())
        );
    }

    #[OA\Put(
        path: '/api/v1/agence/profil',
        tags: ['Agence'],
        security: [['sanctum' => []]],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                properties: [
                    new OA\Property(property: 'name', type: 'string', example: 'Dakar Auto Services'),
                    new OA\Property(property: 'activity', type: 'string', example: 'Location de vehicules'),
                    new OA\Property(property: 'city', type: 'string', example: 'Dakar'),
                    new OA\Property(property: 'contact_phone', type: 'string', example: '+221771234567')
                ],
                type: 'object'
            )
        ),
        responses: [
            new OA\Response(
                response: 200,
                description: 'Profil agence mis a jour',
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: 'status', type: 'boolean', example: true),
                        new OA\Property(property: 'message', type: 'string', example: 'Profil agence mis a jour avec succes.'),
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
    public function update(AgencyProfileUpdateRequest $request): JsonResponse
    {
        $agency = $request->user()->agency;
        $agency->update($request->validated());

        return $this->successResponse(
            'Profil agence mis a jour avec succes.',
            new AgencyResource($agency->fresh()->loadCount('vehicles'))
        );
    }
}
