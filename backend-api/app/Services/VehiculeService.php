<?php

namespace App\Services;

use App\Models\Vehicle;
use App\Repository\ReservationRepository;
use App\Repository\VehicleRepository;
use App\Utils\GenererReference;
use Illuminate\Http\Request;

class VehiculeService
{
    public function __construct(
        private readonly VehicleRepository $vehicles,
        private readonly ReservationRepository $reservations,
        private readonly TarificationService $tarificationService
    ) {}

    public function cataloguePublic(Request $request)
    {
        return $this->vehicles->getPublicCatalog($request);
    }

    public function creerPourAgence(array $data, int $agencyId): Vehicle
    {
        $pricing = $this->tarificationService->calculate((float) $data['price'], (string) $data['listing_type']);

        return $this->vehicles->create([
            ...$data,
            'service_fee' => $pricing['amount'],
            'agency_id' => $agencyId,
            'reference' => GenererReference::vehicule(),
            'slug' => GenererReference::slug($data['brand'].'-'.$data['model']),
        ]);
    }

    public function mettreAJourPourAgence(Vehicle $vehicle, array $data): Vehicle
    {
        $pricing = $this->tarificationService->calculate(
            (float) ($data['price'] ?? $vehicle->price),
            (string) ($data['listing_type'] ?? ($vehicle->listing_type?->value ?? $vehicle->listing_type))
        );

        return $this->vehicles->update($vehicle, [
            ...$data,
            'service_fee' => $pricing['amount'],
        ]);
    }

    public function verifierDisponibilite(int $vehicleId, string $pickupDate, string $returnDate): bool
    {
        return ! $this->reservations->hasOverlap($vehicleId, $pickupDate, $returnDate);
    }
}
