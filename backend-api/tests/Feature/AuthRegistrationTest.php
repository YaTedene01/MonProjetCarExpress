<?php

namespace Tests\Feature;

use App\Models\Agency;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthRegistrationTest extends TestCase
{
    use RefreshDatabase;

    public function test_client_can_register_without_explicit_name(): void
    {
        $response = $this->postJson('/api/v1/authentification/client/inscription', [
            'email' => 'client.test@carexpress.sn',
            'phone' => '+221770000111',
            'city' => 'Dakar',
            'password' => 'client12345',
            'password_confirmation' => 'client12345',
        ]);

        $response
            ->assertCreated()
            ->assertJsonPath('status', true)
            ->assertJsonPath('data.utilisateur.email', 'client.test@carexpress.sn')
            ->assertJsonPath('data.utilisateur.name', 'Client Test');

        $this->assertDatabaseHas('users', [
            'email' => 'client.test@carexpress.sn',
            'role' => 'client',
        ]);
    }

    public function test_agency_can_self_register_from_front_signup_payload(): void
    {
        $response = $this->postJson('/api/v1/authentification/agence/inscription', [
            'company' => 'Nouvelle Agence Dakar',
            'phone' => '+221770000222',
            'email' => 'contact@nouvelle-agence.sn',
            'city' => 'Dakar',
            'activity' => 'Location et vente',
            'password' => 'agency12345',
            'password_confirmation' => 'agency12345',
        ]);

        $response
            ->assertCreated()
            ->assertJsonPath('status', true)
            ->assertJsonPath('data.utilisateur.role', 'agency')
            ->assertJsonPath('data.agence.name', 'Nouvelle Agence Dakar')
            ->assertJsonPath('data.agence.status', 'pending');

        $agency = Agency::query()->where('name', 'Nouvelle Agence Dakar')->first();

        $this->assertNotNull($agency);
        $this->assertDatabaseHas('users', [
            'agency_id' => $agency->id,
            'email' => 'contact@nouvelle-agence.sn',
            'role' => 'agency',
        ]);
    }
}
