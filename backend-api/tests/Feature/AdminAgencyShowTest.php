<?php

namespace Tests\Feature;

use App\Models\Agency;
use App\Models\User;
use App\Models\Vehicle;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class AdminAgencyShowTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_view_agency_profile_with_vehicles(): void
    {
        $admin = User::query()->create([
            'role' => 'admin',
            'name' => 'Admin Test',
            'email' => 'admin.agency-show@carexpress.sn',
            'phone' => '+221770000111',
            'city' => 'Dakar',
            'password' => 'admin12345',
            'status' => 'active',
        ]);

        $agency = Agency::query()->create([
            'name' => 'Elite Motors SN',
            'slug' => 'elite-motors-sn',
            'activity' => 'Location et vente',
            'city' => 'Dakar',
            'status' => 'active',
        ]);

        Vehicle::query()->create([
            'agency_id' => $agency->id,
            'listing_type' => 'rental',
            'reference' => 'LOC-ELITE-001',
            'name' => 'Toyota Prado',
            'slug' => 'toyota-prado-elite',
            'brand' => 'Toyota',
            'model' => 'Prado',
            'year' => 2023,
            'category' => 'SUV',
            'price' => 85000,
            'price_unit' => 'day',
            'city' => 'Dakar',
            'status' => 'available',
        ]);

        Vehicle::query()->create([
            'agency_id' => $agency->id,
            'listing_type' => 'sale',
            'reference' => 'VNT-ELITE-001',
            'name' => 'Hyundai Tucson',
            'slug' => 'hyundai-tucson-elite',
            'brand' => 'Hyundai',
            'model' => 'Tucson',
            'year' => 2022,
            'category' => 'SUV',
            'price' => 18500000,
            'price_unit' => 'total',
            'city' => 'Dakar',
            'status' => 'for_sale',
        ]);

        Sanctum::actingAs($admin);

        $response = $this->getJson("/api/v1/administration/agences/{$agency->id}");

        $response->assertOk()
            ->assertJsonPath('data.name', 'Elite Motors SN')
            ->assertJsonPath('data.vehicles_count', 2)
            ->assertJsonCount(2, 'data.vehicles')
            ->assertJsonPath('data.vehicles.0.agency_id', $agency->id);
    }
}
