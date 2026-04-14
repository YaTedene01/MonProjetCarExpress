<?php

namespace Tests\Feature;

use App\Models\Agency;
use App\Models\AgencyRegistrationRequest;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class ApproveAgencyRegistrationRequestTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_approval_creates_agency_with_same_information_as_request(): void
    {
        $admin = User::query()->create([
            'role' => 'admin',
            'name' => 'Admin Test',
            'email' => 'admin.test@carexpress.sn',
            'phone' => '+221770000000',
            'city' => 'Dakar',
            'password' => 'admin12345',
            'status' => 'active',
        ]);

        $documents = [
            [
                'name' => 'ninea.pdf',
                'path' => 'agency-registration-requests/1/ninea.pdf',
                'mime_type' => 'application/pdf',
                'size' => 123456,
            ],
        ];

        $request = AgencyRegistrationRequest::query()->create([
            'company' => 'Dakar Auto Services',
            'email' => 'contact@dakar-auto.sn',
            'phone' => '+221771234567',
            'city' => 'Dakar',
            'activity' => 'Location et vente',
            'manager_name' => 'Amadou Fall',
            'district' => 'Plateau',
            'address' => 'Rue 10 x Avenue 12',
            'ninea' => 'SN-2026-00123',
            'color' => '#D40511',
            'logo_url' => '/storage/logo.png',
            'password' => 'agency12345',
            'status' => 'pending',
            'documents' => $documents,
        ]);

        Sanctum::actingAs($admin);

        $this->postJson("/api/v1/administration/messages-demandes-agence/{$request->id}/enregistrer")
            ->assertOk()
            ->assertJsonPath('status', true);

        $agency = Agency::query()->where('name', 'Dakar Auto Services')->firstOrFail();

        $this->assertSame('Location et vente', $agency->activity);
        $this->assertSame('Dakar', $agency->city);
        $this->assertSame('Plateau', $agency->district);
        $this->assertSame('Rue 10 x Avenue 12', $agency->address);
        $this->assertSame('Amadou', $agency->contact_first_name);
        $this->assertSame('Fall', $agency->contact_last_name);
        $this->assertSame('+221771234567', $agency->contact_phone);
        $this->assertSame('contact@dakar-auto.sn', $agency->contact_email);
        $this->assertSame('SN-2026-00123', $agency->ninea);
        $this->assertSame('#D40511', $agency->color);
        $this->assertSame('/storage/logo.png', $agency->logo_url);
        $this->assertSame($documents, $agency->documents);
        $this->assertSame('pending', $agency->status->value);
        $this->assertSame($request->id, $agency->metadata['registration_request_id']);
        $this->assertSame('Dakar Auto Services', $agency->metadata['registration_request_snapshot']['company']);
        $this->assertSame('Amadou Fall', $agency->metadata['registration_request_snapshot']['manager_name']);

        $this->assertDatabaseHas('users', [
            'agency_id' => $agency->id,
            'role' => 'agency',
            'name' => 'Amadou Fall',
            'email' => 'contact@dakar-auto.sn',
            'phone' => '+221771234567',
            'city' => 'Dakar',
            'status' => 'active',
        ]);

        $this->assertDatabaseHas('agency_registration_requests', [
            'id' => $request->id,
            'status' => 'approved',
        ]);
    }
}
