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
        private readonly ReservationRepository $reservations
    ) {}

    public function cataloguePublic(Request $request)
    {
        return $this->vehicles->getPublicCatalog($request);
    }

    public function creerPourAgence(array $data, int $agencyId): Vehicle
    {
        return $this->vehicles->create([
            ...$data,
            'agency_id' => $agencyId,
            'reference' => GenererReference::vehicule(),
            'slug' => GenererReference::slug($data['brand'].'-'.$data['model']),
        ]);
    }

    public function mettreAJourPourAgence(Vehicle $vehicle, array $data): Vehicle
    {
        return $this->vehicles->update($vehicle, $data);
    }

    public function verifierDisponibilite(int $vehicleId, string $pickupDate, string $returnDate): bool
    {
        return ! $this->reservations->hasOverlap($vehicleId, $pickupDate, $returnDate);
    }
}
