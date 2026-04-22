<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminLoginTest extends TestCase
{
    use RefreshDatabase;

    public function test_super_admin_can_log_in_with_seed_credentials_even_if_account_is_missing(): void
    {
        $this->assertDatabaseMissing('users', [
            'email' => 'admin@carexpress.sn',
        ]);

        $this->postJson('/api/v1/authentification/superadmin/connexion', [
            'identifier' => ' admin@carexpress.sn ',
            'password' => 'admin12345',
            'device_name' => 'admin-web',
        ])
            ->assertOk()
            ->assertJsonPath('data.utilisateur.email', 'admin@carexpress.sn')
            ->assertJsonPath('data.utilisateur.role', 'admin');

        $this->assertDatabaseHas('users', [
            'email' => 'admin@carexpress.sn',
            'role' => 'admin',
            'status' => 'active',
        ]);
    }

    public function test_super_admin_login_rejects_invalid_password(): void
    {
        User::query()->create([
            'role' => 'admin',
            'name' => 'Car Express Admin',
            'email' => 'admin@carexpress.sn',
            'phone' => '+221770001111',
            'city' => 'Dakar',
            'password' => 'admin12345',
            'status' => 'active',
        ]);

        $this->postJson('/api/v1/authentification/superadmin/connexion', [
            'identifier' => 'admin@carexpress.sn',
            'password' => 'wrong-password',
            'device_name' => 'admin-web',
        ])
            ->assertStatus(422)
            ->assertJsonPath('errors.identifier.0', 'Les identifiants fournis sont invalides.');
    }
}
