<?php

namespace App\Repository;

use App\Models\Reservation;

class ReservationRepository
{
    public function getClientReservations(int $clientId)
    {
        return Reservation::query()
            ->with(['vehicle.agency', 'agency'])
            ->where('client_id', $clientId)
            ->latest()
            ->get();
    }

    public function getAgencyReservations(int $agencyId)
    {
        return Reservation::query()
            ->with(['vehicle', 'client'])
            ->where('agency_id', $agencyId)
            ->latest()
            ->get();
    }

    public function create(array $data): Reservation
    {
        return Reservation::query()->create($data);
    }

    public function updateStatus(Reservation $reservation, string $status): Reservation
    {
        $reservation->update(['status' => $status]);

        return $reservation->load(['vehicle', 'client']);
    }

    public function hasActiveReservationForVehicle(int $vehicleId, ?int $exceptReservationId = null): bool
    {
        return Reservation::query()
            ->where('vehicle_id', $vehicleId)
            ->whereIn('status', ['pending', 'confirmed'])
            ->when($exceptReservationId !== null, fn ($query) => $query->whereKeyNot($exceptReservationId))
            ->exists();
    }

    public function hasOverlap(int $vehicleId, string $pickupDate, string $returnDate): bool
    {
        return Reservation::query()
            ->where('vehicle_id', $vehicleId)
            ->whereIn('status', ['pending', 'confirmed'])
            ->whereDate('pickup_date', '<', $returnDate)
            ->whereDate('return_date', '>', $pickupDate)
            ->exists();
    }
}
