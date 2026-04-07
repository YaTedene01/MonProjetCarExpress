<?php

namespace App\Services;

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

        return $reservation->load(['vehicle.agency', 'agency']);
    }
}
