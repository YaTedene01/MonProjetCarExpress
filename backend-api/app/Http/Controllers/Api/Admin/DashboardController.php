<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Agency;
use App\Models\PurchaseRequest;
use App\Models\Reservation;
use App\Models\User;
use App\Models\Vehicle;
use Illuminate\Http\JsonResponse;
use OpenApi\Attributes as OA;

class DashboardController extends Controller
{
    #[OA\Get(
        path: '/api/v1/administration/tableau-de-bord',
        tags: ['Administration'],
        security: [['sanctum' => []]],
        responses: [
            new OA\Response(
                response: 200,
                description: 'Tableau de bord administration recupere',
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: 'status', type: 'boolean', example: true),
                        new OA\Property(property: 'message', type: 'string', example: 'Tableau de bord administration recupere avec succes.'),
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
        return $this->successResponse('Tableau de bord administration recupere avec succes.', [
            'metrics' => [
                'users_count' => User::count(),
                'agencies_count' => Agency::count(),
                'active_agencies_count' => Agency::query()->where('status', 'active')->count(),
                'vehicles_count' => Vehicle::count(),
                'reservations_count' => Reservation::count(),
                'purchase_requests_count' => PurchaseRequest::count(),
            ],
        ]);
    }
}
