<?php

namespace App\Http\Controllers\Api\Agency;

use App\Http\Controllers\Controller;
use App\Http\Requests\Agency\UpsertVehicleRequest;
use App\Http\Resources\VehicleResource;
use App\Models\Vehicle;
use App\Repository\VehicleRepository;
use App\Services\VehiculeService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use OpenApi\Attributes as OA;

class VehicleController extends Controller
{
    public function __construct(
        private readonly VehicleRepository $vehicles,
        private readonly VehiculeService $vehiculeService
    ) {}

    #[OA\Get(
        path: '/api/v1/agence/vehicules',
        tags: ['Agence'],
        security: [['sanctum' => []]],
        responses: [
            new OA\Response(response: 200, description: 'Vehicules agence recuperes', content: new OA\JsonContent(properties: [new OA\Property(property: 'status', type: 'boolean', example: true), new OA\Property(property: 'message', type: 'string', example: 'Vehicules recuperes avec succes.'), new OA\Property(property: 'data', type: 'array', items: new OA\Items(type: 'object'))], type: 'object')),
            new OA\Response(response: 401, description: 'Token manquant ou invalide', content: new OA\JsonContent(ref: '#/components/schemas/UnauthorizedResponse')),
            new OA\Response(response: 403, description: 'Acces interdit', content: new OA\JsonContent(ref: '#/components/schemas/ForbiddenResponse')),
            new OA\Response(response: 500, description: 'Erreur serveur', content: new OA\JsonContent(ref: '#/components/schemas/ServerErrorResponse'))
        ]
    )]
    public function index(Request $request): JsonResponse
    {
        return $this->successResponse(
            'Vehicules recuperes avec succes.',
            VehicleResource::collection(
                $this->vehicles->getAgencyVehicles($request->user()->agency_id)
            )
        );
    }

    #[OA\Post(
        path: '/api/v1/agence/vehicules',
        tags: ['Agence'],
        security: [['sanctum' => []]],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ['listing_type', 'name', 'brand', 'model', 'year', 'category', 'price', 'city', 'status'],
                properties: [
                    new OA\Property(property: 'listing_type', type: 'string', example: 'rental'),
                    new OA\Property(property: 'name', type: 'string', example: 'Toyota Land Cruiser'),
                    new OA\Property(property: 'brand', type: 'string', example: 'Toyota'),
                    new OA\Property(property: 'model', type: 'string', example: 'Land Cruiser'),
                    new OA\Property(property: 'year', type: 'integer', example: 2024),
                    new OA\Property(property: 'category', type: 'string', example: 'SUV'),
                    new OA\Property(property: 'price', type: 'number', example: 85000),
                    new OA\Property(property: 'city', type: 'string', example: 'Dakar'),
                    new OA\Property(property: 'status', type: 'string', example: 'available')
                ],
                type: 'object'
            )
        ),
        responses: [
            new OA\Response(response: 201, description: 'Vehicule cree', content: new OA\JsonContent(properties: [new OA\Property(property: 'status', type: 'boolean', example: true), new OA\Property(property: 'message', type: 'string', example: 'Vehicule cree avec succes.'), new OA\Property(property: 'data', type: 'object')], type: 'object')),
            new OA\Response(response: 401, description: 'Token manquant ou invalide', content: new OA\JsonContent(ref: '#/components/schemas/UnauthorizedResponse')),
            new OA\Response(response: 403, description: 'Acces interdit', content: new OA\JsonContent(ref: '#/components/schemas/ForbiddenResponse')),
            new OA\Response(response: 422, description: 'Erreur de validation', content: new OA\JsonContent(ref: '#/components/schemas/ValidationErrorResponse')),
            new OA\Response(response: 500, description: 'Erreur serveur', content: new OA\JsonContent(ref: '#/components/schemas/ServerErrorResponse'))
        ]
    )]
    public function store(UpsertVehicleRequest $request): JsonResponse
    {
        $vehicle = $this->vehiculeService->creerPourAgence(
            $this->buildVehiclePayload($request),
            $request->user()->agency_id
        );

        return $this->successResponse('Véhicule créé avec succès.', new VehicleResource($vehicle), 201);
    }

    #[OA\Put(
        path: '/api/v1/agence/vehicules/{vehicle}',
        tags: ['Agence'],
        security: [['sanctum' => []]],
        parameters: [new OA\Parameter(name: 'vehicle', in: 'path', required: true, schema: new OA\Schema(type: 'integer'))],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                properties: [
                    new OA\Property(property: 'name', type: 'string', example: 'Toyota Land Cruiser VX'),
                    new OA\Property(property: 'price', type: 'number', example: 90000),
                    new OA\Property(property: 'status', type: 'string', example: 'available')
                ],
                type: 'object'
            )
        ),
        responses: [
            new OA\Response(response: 200, description: 'Vehicule mis a jour', content: new OA\JsonContent(properties: [new OA\Property(property: 'status', type: 'boolean', example: true), new OA\Property(property: 'message', type: 'string', example: 'Vehicule mis a jour avec succes.'), new OA\Property(property: 'data', type: 'object')], type: 'object')),
            new OA\Response(response: 401, description: 'Token manquant ou invalide', content: new OA\JsonContent(ref: '#/components/schemas/UnauthorizedResponse')),
            new OA\Response(response: 403, description: 'Acces interdit', content: new OA\JsonContent(ref: '#/components/schemas/ForbiddenResponse')),
            new OA\Response(response: 404, description: 'Vehicule introuvable', content: new OA\JsonContent(ref: '#/components/schemas/NotFoundResponse')),
            new OA\Response(response: 422, description: 'Erreur de validation', content: new OA\JsonContent(ref: '#/components/schemas/ValidationErrorResponse')),
            new OA\Response(response: 500, description: 'Erreur serveur', content: new OA\JsonContent(ref: '#/components/schemas/ServerErrorResponse'))
        ]
    )]
    public function update(UpsertVehicleRequest $request, Vehicle $vehicle): JsonResponse
    {
        abort_unless($vehicle->agency_id === $request->user()->agency_id, 403);

        return $this->successResponse(
            'Vehicule mis a jour avec succes.',
            new VehicleResource($this->vehiculeService->mettreAJourPourAgence($vehicle, $this->buildVehiclePayload($request, $vehicle)))
        );
    }

    private function buildVehiclePayload(UpsertVehicleRequest $request, ?Vehicle $vehicle = null): array
    {
        $payload = $request->validated();
        $existingGallery = collect($payload['gallery'] ?? ($vehicle?->gallery ?? []))
            ->filter(fn ($item) => is_string($item) && trim($item) !== '')
            ->values()
            ->all();

        unset($payload['gallery_files']);

        $uploadedGallery = collect($request->file('gallery_files', []))
            ->filter()
            ->map(function ($file) use ($request): string {
                $path = $file->storeAs(
                    'vehicles/gallery',
                    Str::uuid()->toString().'.'.$file->getClientOriginalExtension(),
                    'public'
                );

                return '/storage/'.$path;
            })
            ->all();

        if ($uploadedGallery !== [] || array_key_exists('gallery', $payload)) {
            $payload['gallery'] = array_values(array_unique([...$existingGallery, ...$uploadedGallery]));
        }

        return $payload;
    }
}
