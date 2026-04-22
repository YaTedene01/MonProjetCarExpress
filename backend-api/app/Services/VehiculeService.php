<?php

namespace App\Services;

use App\Enums\UserRole;
use App\Enums\VehicleStatus;
use App\Models\Alert;
use App\Models\Vehicle;
use App\Models\User;
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

        $vehicle = $this->vehicles->create([
            ...$data,
            'service_fee' => $pricing['amount'],
            'agency_id' => $agencyId,
            'reference' => GenererReference::vehicule(),
            'slug' => GenererReference::slug($data['brand'].'-'.$data['model']),
            'status' => VehicleStatus::Pending->value,
        ]);

        $this->notifyAdminsAboutPendingVehicle($vehicle);

        return $vehicle;
    }

    public function mettreAJourPourAgence(Vehicle $vehicle, array $data): Vehicle
    {
        $pricing = $this->tarificationService->calculate(
            (float) ($data['price'] ?? $vehicle->price),
            (string) ($data['listing_type'] ?? ($vehicle->listing_type?->value ?? $vehicle->listing_type))
        );

        $currentStatus = $vehicle->status?->value ?? $vehicle->status;

        if (in_array($currentStatus, [VehicleStatus::Pending->value, VehicleStatus::Draft->value], true)) {
            $data['status'] = VehicleStatus::Pending->value;
        }

        return $this->vehicles->update($vehicle, [
            ...$data,
            'service_fee' => $pricing['amount'],
        ]);
    }

    public function verifierDisponibilite(int $vehicleId, string $pickupDate, string $returnDate): bool
    {
        return ! $this->reservations->hasOverlap($vehicleId, $pickupDate, $returnDate);
    }

    private function notifyAdminsAboutPendingVehicle(Vehicle $vehicle): void
    {
        $adminUserIds = User::query()
            ->where('role', UserRole::Admin->value)
            ->pluck('id');

        if ($adminUserIds->isEmpty()) {
            return;
        }

        $now = now();
        $alerts = $adminUserIds->map(fn (int $userId): array => [
            'user_id' => $userId,
            'title' => 'Nouvelle annonce agence a valider',
            'message' => sprintf(
                'L agence %s a publie l annonce %s. Validation admin requise avant diffusion.',
                (string) ($vehicle->agency?->name ?? 'partenaire'),
                (string) ($vehicle->name ?? 'Vehicule')
            ),
            'context' => json_encode([
                'type' => 'vehicle_pending_approval',
                'vehicle_id' => $vehicle->id,
                'agency_id' => $vehicle->agency_id,
            ], JSON_UNESCAPED_UNICODE),
            'is_read' => false,
            'created_at' => $now,
            'updated_at' => $now,
        ])->all();

        Alert::query()->insert($alerts);
    }
}
