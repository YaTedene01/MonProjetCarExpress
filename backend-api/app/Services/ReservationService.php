<?php

namespace App\Services;

use App\Enums\UserRole;
use App\Models\Alert;
use App\Models\User;
use App\Repository\PaymentRepository;
use App\Repository\ReservationRepository;
use App\Utils\GenererReference;
use Illuminate\Support\Carbon;

class ReservationService
{
    public function __construct(
        private readonly ReservationRepository $reservations,
        private readonly PaymentRepository $payments
    ) {}

    public function creer(array $data, object $vehicle, int $clientId)
    {
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

        $this->payments->create([
            'reservation_id' => $reservation->id,
            'amount' => $totalAmount,
            'method' => $reservation->payment_method,
            'status' => 'paid',
            'paid_at' => now(),
            'reference' => GenererReference::paiementReservation(),
        ]);

        $this->notifierAgenceNouvelleReservation($reservation, $vehicle, $data, $clientId);

        return $reservation->load(['vehicle.agency', 'agency']);
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
                'context' => [
                    'type' => 'reservation_created',
                    'reservation_id' => $reservation->id,
                    'vehicle_id' => $vehicle->id,
                    'agency_id' => $vehicle->agency_id,
                    'client_id' => $clientId,
                    'pickup_date' => $pickupDate,
                    'return_date' => $returnDate,
                ],
                'is_read' => false,
                'created_at' => now(),
                'updated_at' => now(),
            ])
            ->all();

        Alert::query()->insert($alertsPayload);
    }
}
