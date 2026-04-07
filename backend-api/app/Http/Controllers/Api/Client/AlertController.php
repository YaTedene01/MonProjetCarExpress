<?php

namespace App\Http\Controllers\Api\Client;

use App\Http\Controllers\Controller;
use App\Http\Resources\AlertResource;
use App\Models\Alert;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use OpenApi\Attributes as OA;

class AlertController extends Controller
{
    #[OA\Get(
        path: '/api/v1/client/alertes',
        tags: ['Client'],
        security: [['sanctum' => []]],
        responses: [
            new OA\Response(
                response: 200,
                description: 'Alertes client recuperees',
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: 'status', type: 'boolean', example: true),
                        new OA\Property(property: 'message', type: 'string', example: 'Alertes recuperees avec succes.'),
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
            'Alertes recuperees avec succes.',
            AlertResource::collection(
                $request->user()->alerts()->latest()->get()
            )
        );
    }

    #[OA\Patch(
        path: '/api/v1/client/alertes/{alert}/lire',
        tags: ['Client'],
        security: [['sanctum' => []]],
        parameters: [new OA\Parameter(name: 'alert', in: 'path', required: true, schema: new OA\Schema(type: 'integer'))],
        responses: [
            new OA\Response(
                response: 200,
                description: 'Alerte marquee comme lue',
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: 'status', type: 'boolean', example: true),
                        new OA\Property(property: 'message', type: 'string', example: 'Alerte marquee comme lue.'),
                        new OA\Property(property: 'data', type: 'object')
                    ],
                    type: 'object'
                )
            ),
            new OA\Response(response: 401, description: 'Token manquant ou invalide', content: new OA\JsonContent(ref: '#/components/schemas/UnauthorizedResponse')),
            new OA\Response(response: 403, description: 'Acces interdit', content: new OA\JsonContent(ref: '#/components/schemas/ForbiddenResponse')),
            new OA\Response(response: 404, description: 'Alerte introuvable', content: new OA\JsonContent(ref: '#/components/schemas/NotFoundResponse')),
            new OA\Response(response: 500, description: 'Erreur serveur', content: new OA\JsonContent(ref: '#/components/schemas/ServerErrorResponse'))
        ]
    )]
    public function markAsRead(Request $request, Alert $alert): JsonResponse
    {
        abort_unless($alert->user_id === $request->user()->id, 403);

        $alert->update([
            'is_read' => true,
            'read_at' => now(),
        ]);

        return $this->successResponse('Alerte marquee comme lue.', new AlertResource($alert));
    }
}
