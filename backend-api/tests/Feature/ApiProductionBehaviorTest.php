<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\File;
use Tests\TestCase;

class ApiProductionBehaviorTest extends TestCase
{
    use RefreshDatabase;

    public function test_protected_client_profile_returns_401_without_token(): void
    {
        $this->getJson('/api/v1/client/profil')
            ->assertUnauthorized()
            ->assertJson([
                'status' => false,
                'message' => 'Authentification requise ou jeton invalide.',
            ]);
    }

    public function test_openapi_route_serves_current_app_url_as_server(): void
    {
        config()->set('app.url', 'http://localhost:8000');

        $directory = storage_path('api-docs');
        File::ensureDirectoryExists($directory);
        File::put($directory.'/api-docs.json', json_encode([
            'openapi' => '3.0.0',
            'info' => [
                'title' => 'Car Express API',
                'version' => '1.0.0',
            ],
            'servers' => [
                ['url' => 'http://localhost:8000'],
            ],
        ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));

        $this->withServerVariables([
            'HTTP_HOST' => 'backendcarexpress.onrender.com',
            'HTTPS' => 'on',
        ])->getJson('/api/docs/openapi.json')
            ->assertOk()
            ->assertJsonPath('servers.0.url', 'http://localhost:8000')
            ->assertJsonPath('servers.0.description', 'Serveur API');
    }
}
