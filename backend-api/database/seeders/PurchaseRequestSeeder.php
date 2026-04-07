<?php

namespace Database\Seeders;

use App\Models\PurchaseRequest;
use App\Models\User;
use App\Models\Vehicle;
use Illuminate\Database\Seeder;

class PurchaseRequestSeeder extends Seeder
{
    public function run(): void
    {
        $client = User::query()->where('email', 'moussa@carexpress.sn')->firstOrFail();
        $vehicle = Vehicle::query()->where('name', 'Kia Sportage')->firstOrFail();

        PurchaseRequest::query()->updateOrCreate(
            ['client_id' => $client->id, 'vehicle_id' => $vehicle->id],
            [
                'agency_id' => $vehicle->agency_id,
                'service_fee' => $vehicle->service_fee,
                'payment_method' => 'card',
                'status' => 'negotiating',
                'client_name' => $client->name,
                'client_phone' => $client->phone,
                'client_email' => $client->email,
                'preferred_location' => 'Dakar',
                'notes' => 'Souhaite planifier une visite cette semaine.',
                'accepted_terms' => true,
                'accepted_non_refundable' => true,
            ]
        );
    }
}
