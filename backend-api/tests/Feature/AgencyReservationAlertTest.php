<?php

namespace Tests\Feature;

use App\Models\Agency;
use App\Models\User;
use App\Models\Vehicle;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class AgencyReservationAlertTest extends TestCase
{
    use RefreshDatabase;

    public function test_agency_receives_alert_when_client_creates_reservation(): void
    {
        $agency = Agency::query()->create([
            'name' => 'Agence Test',
            'slug' => 'agence-test',
            'activity' => 'Location',
            'city' => 'Dakar',
            'status' => 'active',
        ]);

        $agencyUser = User::query()->create([
            'agency_id' => $agency->id,
            'role' => 'agency',
            'name' => 'Manager Agence',
            'email' => 'agency.test@carexpress.sn',
            'phone' => '+221770001111',
            'city' => 'Dakar',
            'password' => 'agency12345',
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
        ]);

        Sanctum::actingAs($client);

        $pickupDate = now()->addDays(2)->toDateString();
        $returnDate = now()->addDays(5)->toDateString();

        $this->postJson('/api/v1/client/reservations', [
            'vehicle_id' => $vehicle->id,
            'pickup_location' => 'Aeroport DSS',
            'pickup_date' => $pickupDate,
            'pickup_time' => '10:00',
            'return_date' => $returnDate,
            'return_time' => '09:00',
            'payment_method' => 'mobile_money',
            'client_name' => 'Client Test',
            'client_phone' => '+221770002222',
            'identity_number' => 'CNI-123456',
            'driver_license_number' => 'PERMIS-123456',
            'accepted_terms' => true,
            'accepted_agency_terms' => true,
        ])->assertCreated();

        $this->assertDatabaseHas('alerts', [
            'user_id' => $agencyUser->id,
            'title' => 'Nouvelle reservation client',
            'is_read' => false,
        ]);

        Sanctum::actingAs($agencyUser);

        $this->getJson('/api/v1/agence/alertes')
            ->assertOk()
            ->assertJsonPath('status', true)
            ->assertJsonCount(1, 'data');
    }
}

