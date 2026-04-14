<?php

namespace App\Http\Controllers\Api\Public;

use App\Http\Controllers\Controller;
use App\Http\Resources\VehicleResource;
use App\Models\Reservation;
use App\Models\Vehicle;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use OpenApi\Attributes as OA;

class VehicleController extends Controller
{
    #[OA\Get(
        path: '/api/v1/catalogue/vehicules',
        tags: ['Public'],
        responses: [
            new OA\Response(
                response: 200,
                description: 'Liste des vehicules recuperee',
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: 'status', type: 'boolean', example: true),
                        new OA\Property(property: 'message', type: 'string', example: 'Vehicules recuperes avec succes.'),
                        new OA\Property(property: 'data', type: 'array', items: new OA\Items(type: 'object'))
                    ],
                    type: 'object'
                )
            ),
            new OA\Response(response: 500, description: 'Erreur serveur', content: new OA\JsonContent(ref: '#/components/schemas/ServerErrorResponse'))
        ]
    )]
    public function listCatalogueVehicles(Request $request): JsonResponse
    {
        $vehicles = Vehicle::query()
            ->with('agency')
            ->when(
                ! $request->filled('status'),
                function ($query): void {
                    $query->where(function ($catalogueQuery): void {
                        $catalogueQuery
                            ->where(function ($rentalQuery): void {
                                $rentalQuery
                                    ->where('listing_type', 'rental')
                                    ->where('status', 'available');
                            })
                            ->orWhere(function ($saleQuery): void {
                                $saleQuery
                                    ->where('listing_type', 'sale')
                                    ->where('status', 'for_sale');
                            });
                    });
                },
                fn ($query) => $query->where('status', $request->string('status'))
            )
            ->when($request->filled('listing_type'), fn ($query) => $query->where('listing_type', $request->string('listing_type')))
            ->when($request->filled('city'), fn ($query) => $query->where('city', $request->string('city')))
            ->when($request->filled('category'), fn ($query) => $query->where('category', $request->string('category')))
            ->when($request->filled('brand'), fn ($query) => $query->where('brand', $request->string('brand')))
            ->when($request->filled('search'), function ($query) use ($request): void {
                $search = $request->string('search')->toString();
                $query->where(function ($inner) use ($search): void {
                    $inner->where('name', 'like', "%{$search}%")
                        ->orWhere('brand', 'like', "%{$search}%")
                        ->orWhere('model', 'like', "%{$search}%")
                        ->orWhere('city', 'like', "%{$search}%");
                });
            })
            ->when($request->filled('min_price'), fn ($query) => $query->where('price', '>=', $request->float('min_price')))
            ->when($request->filled('max_price'), fn ($query) => $query->where('price', '<=', $request->float('max_price')))
            ->when($request->boolean('featured'), fn ($query) => $query->where('is_featured', true))
            ->latest()
            ->get();

        return $this->successResponse(
            'Vehicules recuperes avec succes.',
            VehicleResource::collection($vehicles)
        );
    }

    #[OA\Get(
        path: '/api/v1/catalogue/vehicules/{vehicle}',
        tags: ['Public'],
        parameters: [new OA\Parameter(name: 'vehicle', in: 'path', required: true, schema: new OA\Schema(type: 'integer'))],
        responses: [
            new OA\Response(
                response: 200,
                description: 'Detail vehicule recupere',
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: 'status', type: 'boolean', example: true),
                        new OA\Property(property: 'message', type: 'string', example: 'Vehicule recupere avec succes.'),
                        new OA\Property(property: 'data', type: 'object')
                    ],
                    type: 'object'
                )
            ),
            new OA\Response(response: 404, description: 'Vehicule introuvable', content: new OA\JsonContent(ref: '#/components/schemas/NotFoundResponse')),
            new OA\Response(response: 500, description: 'Erreur serveur', content: new OA\JsonContent(ref: '#/components/schemas/ServerErrorResponse'))
        ]
    )]
    public function showCatalogueVehicle(Vehicle $vehicle): JsonResponse
    {
        return $this->successResponse(
            'Vehicule recupere avec succes.',
            new VehicleResource($vehicle->load('agency'))
        );
    }

    #[OA\Get(
        path: '/api/v1/catalogue/vehicules/{vehicle}/verifier-disponibilite',
        tags: ['Public'],
        parameters: [
            new OA\Parameter(name: 'vehicle', in: 'path', required: true, schema: new OA\Schema(type: 'integer')),
            new OA\Parameter(name: 'pickup_date', in: 'query', required: true, schema: new OA\Schema(type: 'string', format: 'date')),
            new OA\Parameter(name: 'return_date', in: 'query', required: true, schema: new OA\Schema(type: 'string', format: 'date')),
        ],
        responses: [
            new OA\Response(
                response: 200,
                description: 'Disponibilite verifiee',
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: 'status', type: 'boolean', example: true),
                        new OA\Property(property: 'message', type: 'string', example: 'Disponibilite verifiee avec succes.'),
                        new OA\Property(
                            property: 'data',
                            properties: [
                                new OA\Property(property: 'vehicle_id', type: 'integer', example: 12),
                                new OA\Property(property: 'available', type: 'boolean', example: true),
                                new OA\Property(property: 'pickup_date', type: 'string', example: '2026-04-05'),
                                new OA\Property(property: 'return_date', type: 'string', example: '2026-04-10')
                            ],
                            type: 'object'
                        )
                    ],
                    type: 'object'
                )
            ),
            new OA\Response(response: 404, description: 'Vehicule introuvable', content: new OA\JsonContent(ref: '#/components/schemas/NotFoundResponse')),
            new OA\Response(response: 422, description: 'Erreur de validation', content: new OA\JsonContent(ref: '#/components/schemas/ValidationErrorResponse')),
            new OA\Response(response: 500, description: 'Erreur serveur', content: new OA\JsonContent(ref: '#/components/schemas/ServerErrorResponse'))
        ]
    )]
    public function checkCatalogueVehicleAvailability(Request $request, Vehicle $vehicle): JsonResponse
    {
        $validated = $request->validate([
            'pickup_date' => ['required', 'date'],
            'return_date' => ['required', 'date', 'after:pickup_date'],
        ]);

        $overlap = Reservation::query()
            ->where('vehicle_id', $vehicle->id)
            ->whereIn('status', ['pending', 'confirmed'])
            ->whereDate('pickup_date', '<', $validated['return_date'])
            ->whereDate('return_date', '>', $validated['pickup_date'])
            ->exists();

        return response()->json([
            'status' => true,
            'message' => 'Disponibilite verifiee avec succes.',
            'data' => [
                'vehicle_id' => $vehicle->id,
                'available' => ! $overlap,
                'pickup_date' => $validated['pickup_date'],
                'return_date' => $validated['return_date'],
            ],
        ]);
    }

    #[OA\Get(
        path: '/api/v1/catalogue/vehicules/filtres',
        tags: ['Public'],
        responses: [
            new OA\Response(
                response: 200,
                description: 'Metadonnees de filtres recuperees',
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: 'status', type: 'boolean', example: true),
                        new OA\Property(property: 'message', type: 'string', example: 'Metadonnees recuperees avec succes.'),
                        new OA\Property(
                            property: 'data',
                            properties: [
                                new OA\Property(property: 'brands', type: 'array', items: new OA\Items(type: 'string')),
                                new OA\Property(property: 'categories', type: 'array', items: new OA\Items(type: 'string')),
                                new OA\Property(property: 'cities', type: 'array', items: new OA\Items(type: 'string')),
                                new OA\Property(property: 'listing_types', type: 'array', items: new OA\Items(type: 'string'))
                            ],
                            type: 'object'
                        )
                    ],
                    type: 'object'
                )
            ),
            new OA\Response(response: 500, description: 'Erreur serveur', content: new OA\JsonContent(ref: '#/components/schemas/ServerErrorResponse'))
        ]
    )]
    public function listCatalogueVehicleFilters(): JsonResponse
    {
        return response()->json([
            'status' => true,
            'message' => 'Metadonnees recuperees avec succes.',
            'data' => [
                'brands' => Vehicle::query()->distinct()->orderBy('brand')->pluck('brand'),
                'categories' => Vehicle::query()->distinct()->orderBy('category')->pluck('category'),
                'cities' => Vehicle::query()->distinct()->orderBy('city')->pluck('city'),
                'listing_types' => ['rental', 'sale'],
            ],
        ]);
    }
}
