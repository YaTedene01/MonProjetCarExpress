<?php

namespace App\Services;

use App\Enums\ListingType;
use App\Enums\UserRole;
use App\Enums\VehicleStatus;
use App\Exceptions\ApiException;
use App\Models\Alert;
use App\Models\User;
use App\Models\Vehicle;
use App\Repository\PaymentRepository;
use App\Repository\ReservationRepository;
use App\Utils\GenererReference;
use Illuminate\Support\Carbon;
use Throwable;

class ReservationService
{
    public function __construct(
        private readonly ReservationRepository $reservations,
        private readonly PaymentRepository $payments
    ) {}

    public function creer(array $data, Vehicle $vehicle, int $clientId)
    {
        if (($vehicle->listing_type?->value ?? $vehicle->listing_type) !== ListingType::Rental->value) {
            throw new ApiException('Ce vehicule n est pas disponible a la location.', 422);
        }

        if (($vehicle->status?->value ?? $vehicle->status) !== VehicleStatus::Available->value) {
            throw new ApiException('Ce vehicule n est pas disponible a la reservation pour le moment.', 422);
        }

        if (! $this->isWithinAvailabilityWindow($vehicle, $data['pickup_date'], $data['return_date'])) {
            throw new ApiException('Ce vehicule est indisponible sur les dates choisies.', 422, [
                'pickup_date' => ['La periode selectionnee depasse la disponibilite definie par l agence.'],
            ]);
        }

        if ($this->reservations->hasOverlap($vehicle->id, $data['pickup_date'], $data['return_date'])) {
            throw new ApiException('Ce vehicule est deja reserve sur la periode selectionnee.', 422, [
                'pickup_date' => ['Le vehicule n est pas disponible sur cette periode.'],
            ]);
        }

        $daysCount = Carbon::parse($data['pickup_date'])->diffInDays(Carbon::parse($data['return_date']));
        $totalAmount = $daysCount * (float) $vehicle->price;

        $reservation = $this->reservations->create([
            ...$data,
            'agency_id' => $vehicle->agency_id,
            'client_id' => $clientId,
            'days_count' => $daysCount,
            'daily_rate' => $vehicle->price,
            'total_amount' => $totalAmount,
            'status' => 'pending',
        ]);

        $vehicle->update([
            'status' => VehicleStatus::Rented->value,
        ]);

        $this->payments->create([
            'reservation_id' => $reservation->id,
            'amount' => $totalAmount,
            'currency' => 'XOF',
            'method' => $reservation->payment_method?->value ?? $reservation->payment_method,
            'status' => 'paid',
            'paid_at' => now(),
            'reference' => GenererReference::paiementReservation(),
        ]);

        $this->notifierAgenceNouvelleReservation($reservation, $vehicle, $data, $clientId);

        return $reservation->load(['vehicle.agency', 'agency']);
    }

    private function isWithinAvailabilityWindow(Vehicle $vehicle, string $pickupDate, string $returnDate): bool
    {
        $specifications = is_array($vehicle->specifications) ? $vehicle->specifications : [];
        $availableFrom = $this->parseDateOrNull($specifications['available_from'] ?? null);
        $availableTo = $this->parseDateOrNull($specifications['available_to'] ?? null);
        $pickup = Carbon::parse($pickupDate)->startOfDay();
        $return = Carbon::parse($returnDate)->startOfDay();

        if ($availableFrom !== null && $pickup->lt($availableFrom)) {
            return false;
        }

        if ($availableTo !== null && $return->gt($availableTo)) {
            return false;
        }

        return true;
    }

    private function parseDateOrNull(mixed $value): ?Carbon
    {
        if (! is_string($value) || trim($value) === '') {
            return null;
        }

        try {
            return Carbon::parse($value)->startOfDay();
        } catch (Throwable) {
            return null;
        }
    }

    private function notifierAgenceNouvelleReservation(object $reservation, object $vehicle, array $data, int $clientId): void
    {
        $agencyUserIds = User::query()
            ->where('agency_id', $vehicle->agency_id)
            ->where('role', UserRole::Agency->value)
            ->pluck('id');

        if ($agencyUserIds->isEmpty()) {
            return;
        }

        $clientName = (string) ($data['client_name'] ?? '');
        $vehicleName = (string) ($vehicle->name ?? 'Vehicule');
        $pickupDate = (string) ($data['pickup_date'] ?? '');
        $returnDate = (string) ($data['return_date'] ?? '');

        $alertsPayload = $agencyUserIds
            ->map(fn (int $userId): array => [
                'user_id' => $userId,
                'title' => 'Nouvelle reservation client',
                'message' => sprintf(
                    '%s a reserve %s du %s au %s.',
                    $clientName !== '' ? $clientName : 'Un client',
                    $vehicleName,
                    $pickupDate,
                    $returnDate
                ),
                'context' => json_encode([
                    'type' => 'reservation_created',
                    'reservation_id' => $reservation->id,
                    'vehicle_id' => $vehicle->id,
                    'agency_id' => $vehicle->agency_id,
                    'client_id' => $clientId,
                    'pickup_date' => $pickupDate,
                    'return_date' => $returnDate,
                ]),
                'is_read' => false,
                'created_at' => now(),
                'updated_at' => now(),
            ])
            ->all();

        Alert::query()->insert($alertsPayload);
    }
}
