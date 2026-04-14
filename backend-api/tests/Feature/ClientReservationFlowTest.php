<?php

namespace Tests\Feature;

use App\Models\Agency;
use App\Models\Reservation;
use App\Models\User;
use App\Models\Vehicle;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class ClientReservationFlowTest extends TestCase
{
    use RefreshDatabase;

    public function test_client_cannot_reserve_an_unavailable_vehicle(): void
    {
        [$client, $vehicle] = $this->createRentalContext([
            'status' => 'maintenance',
        ]);

        Sanctum::actingAs($client);

        $this->postJson('/api/v1/client/reservations', $this->reservationPayload($vehicle))
            ->assertStatus(422)
            ->assertJsonPath('status', false);
    }

    public function test_client_cannot_reserve_a_vehicle_on_overlapping_dates(): void
    {
        [$client, $vehicle, $agency] = $this->createRentalContext();

        Reservation::query()->create([
            'vehicle_id' => $vehicle->id,
            'agency_id' => $agency->id,
            'client_id' => $client->id,
            'pickup_location' => 'Dakar Plateau',
            'pickup_date' => now()->addDays(2)->toDateString(),
            'pickup_time' => '09:00',
            'return_date' => now()->addDays(5)->toDateString(),
            'return_time' => '18:00',
            'days_count' => 3,
            'daily_rate' => 75000,
            'total_amount' => 225000,
            'payment_method' => 'card',
            'status' => 'confirmed',
            'client_name' => 'Client Test',
            'client_phone' => '+221770002222',
            'identity_number' => 'CNI-123456',
            'driver_license_number' => 'PERMIS-123456',
            'accepted_terms' => true,
            'accepted_agency_terms' => true,
        ]);

        Sanctum::actingAs($client);

        $this->postJson('/api/v1/client/reservations', $this->reservationPayload($vehicle))
            ->assertStatus(422)
            ->assertJsonPath('status', false);
    }

    private function createRentalContext(array $vehicleOverrides = []): array
    {
        $agency = Agency::query()->create([
            'name' => 'Agence Test',
            'slug' => 'agence-test',
            'activity' => 'Location',
            'city' => 'Dakar',
            'status' => 'active',
        ]);

        $client = User::query()->create([
            'role' => 'client',
            'name' => 'Client Test',
            'email' => 'client.test@carexpress.sn',
            'phone' => '+221770002222',
            'city' => 'Dakar',
            'password' => 'client12345',
            'status' => 'active',
        ]);

        $vehicle = Vehicle::query()->create([
            'agency_id' => $agency->id,
            'listing_type' => 'rental',
            'reference' => 'VHC-T-0001',
            'name' => 'Toyota Land Cruiser',
            'slug' => 'toyota-land-cruiser-test',
            'brand' => 'Toyota',
            'model' => 'Land Cruiser',
            'year' => 2022,
            'category' => 'SUV',
            'class_name' => 'Standard',
            'price' => 75000,
            'price_unit' => 'day',
            'city' => 'Dakar',
            'status' => 'available',
            ...$vehicleOverrides,
        ]);

        return [$client, $vehicle, $agency];
    }

    private function reservationPayload(Vehicle $vehicle): array
    {
        return [
            'vehicle_id' => $vehicle->id,
            'pickup_location' => 'Aeroport DSS',
            'pickup_date' => now()->addDays(3)->toDateString(),
            'pickup_time' => '10:00',
            'return_date' => now()->addDays(6)->toDateString(),
            'return_time' => '09:00',
            'payment_method' => 'mobile_money',
            'client_name' => 'Client Test',
            'client_phone' => '+221770002222',
            'identity_number' => 'CNI-123456',
            'driver_license_number' => 'PERMIS-123456',
            'accepted_terms' => true,
            'accepted_agency_terms' => true,
        ];
    }
}
