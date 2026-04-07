<?php

namespace App\Http\Controllers\Api\Agency;

use App\Http\Controllers\Controller;
use App\Models\PurchaseRequest;
use App\Models\Reservation;
use App\Models\Vehicle;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use OpenApi\Attributes as OA;

class DashboardController extends Controller
{
    #[OA\Get(
        path: '/api/v1/agence/tableau-de-bord',
        tags: ['Agence'],
        security: [['sanctum' => []]],
        responses: [
            new OA\Response(
                response: 200,
                description: 'Tableau de bord agence recupere',
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: 'status', type: 'boolean', example: true),
                        new OA\Property(property: 'message', type: 'string', example: 'Tableau de bord agence recupere avec succes.'),
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
    public function __invoke(Request $request): JsonResponse
    {
        $agencyId = $request->user()->agency_id;

        return $this->successResponse('Tableau de bord agence recupere avec succes.', [
            'metrics' => [
                'vehicles_count' => Vehicle::query()->where('agency_id', $agencyId)->count(),
                'active_rentals' => Reservation::query()->where('agency_id', $agencyId)->where('status', 'confirmed')->count(),
                'purchase_requests_count' => PurchaseRequest::query()->where('agency_id', $agencyId)->count(),
                'monthly_revenue' => (float) Reservation::query()
                    ->where('agency_id', $agencyId)
                    ->whereMonth('created_at', now()->month)
                    ->sum('total_amount'),
            ],
        ]);
    }
}
