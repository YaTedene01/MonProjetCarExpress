<?php

namespace Tests\Feature;

use App\Models\Agency;
use App\Models\User;
use App\Models\Vehicle;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class PurchaseRequestAlertTest extends TestCase
{
    use RefreshDatabase;

    public function test_agency_and_admin_receive_alerts_when_client_confirms_purchase(): void
    {
        $agency = Agency::query()->create([
            'name' => 'Agence Achat Test',
            'slug' => 'agence-achat-test',
            'activity' => 'Vente',
            'city' => 'Dakar',
            'status' => 'active',
        ]);

        $agencyUser = User::query()->create([
            'agency_id' => $agency->id,
            'role' => 'agency',
            'name' => 'Manager Achat',
            'email' => 'agency.purchase@carexpress.sn',
            'phone' => '+221770001111',
            'city' => 'Dakar',
            'password' => 'agency12345',
            'status' => 'active',
        ]);

        $adminUser = User::query()->create([
            'role' => 'admin',
            'name' => 'Admin Achat',
            'email' => 'admin.purchase@carexpress.sn',
            'phone' => '+221770003333',
            'city' => 'Dakar',
            'password' => 'admin12345',
            'status' => 'active',
        ]);

        $client = User::query()->create([
            'role' => 'client',
            'name' => 'Client Achat',
            'email' => 'client.purchase@carexpress.sn',
            'phone' => '+221770002222',
            'city' => 'Dakar',
            'password' => 'client12345',
            'status' => 'active',
        ]);

        $vehicle = Vehicle::query()->create([
            'agency_id' => $agency->id,
            'listing_type' => 'sale',
            'reference' => 'VHC-A-0001',
            'name' => 'Kia Sportage',
            'slug' => 'kia-sportage-test',
            'brand' => 'Kia',
            'model' => 'Sportage',
            'year' => 2021,
            'category' => 'SUV',
            'class_name' => 'Standard',
            'price' => 7200000,
            'price_unit' => 'fixed',
            'service_fee' => 95000,
            'city' => 'Dakar',
            'status' => 'for_sale',
        ]);

        Sanctum::actingAs($client);

        $this->postJson('/api/v1/client/demandes-achat', [
            'vehicle_id' => $vehicle->id,
            'payment_method' => 'mobile_money',
            'client_name' => 'Client Achat',
            'client_phone' => '+221770002222',
            'client_email' => 'client.purchase@carexpress.sn',
            'preferred_location' => 'Dakar Plateau',
            'notes' => 'Je suis interesse par ce vehicule.',
            'accepted_terms' => true,
            'accepted_non_refundable' => true,
        ])->assertCreated();

        $this->assertDatabaseHas('alerts', [
            'user_id' => $agencyUser->id,
            'title' => 'Nouvelle demande d\'achat client',
            'is_read' => false,
        ]);

        $this->assertDatabaseHas('alerts', [
            'user_id' => $adminUser->id,
            'title' => 'Frais de service achat encaisses',
            'is_read' => false,
        ]);

        Sanctum::actingAs($adminUser);

        $this->getJson('/api/v1/administration/tableau-de-bord')
            ->assertOk()
            ->assertJsonPath('status', true)
            ->assertJsonFragment([
                'title' => 'Frais de service achat encaisses',
            ]);
    }
}
