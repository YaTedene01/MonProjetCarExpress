<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use OpenApi\Attributes as OA;

class SystemController extends Controller
{
    #[OA\Get(
        path: '/api/v1/administration/systeme',
        tags: ['Administration'],
        security: [['sanctum' => []]],
        responses: [
            new OA\Response(
                response: 200,
                description: 'Etat systeme recupere',
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: 'status', type: 'boolean', example: true),
                        new OA\Property(property: 'message', type: 'string', example: 'Etat systeme recupere avec succes.'),
                        new OA\Property(property: 'data', type: 'object')
                    ],
                    type: 'object'
                )
            ),
            new OA\Response(response: 401, description: 'Token manquant ou invalide', content: new OA\JsonContent(ref: '#/components/schemas/UnauthorizedResponse')),
            new OA\Response(response: 403, description: 'Acces interdit', content: new OA\JsonContent(ref: '#/components/schemas/ForbiddenResponse')),
            new OA\Response(response: 500, description: 'Erreur serveur', content: new OA\JsonContent(ref: '#/components/schemas/ServerErrorResponse'))
        ]
    )]
    public function __invoke(): JsonResponse
    {
        return $this->successResponse('Etat systeme recupere avec succes.', [
            'app_name' => config('app.name'),
            'app_env' => config('app.env'),
            'debug' => (bool) config('app.debug'),
            'swagger_url' => url('/api/documentation'),
            'timestamp' => now(),
        ]);
    }
}
