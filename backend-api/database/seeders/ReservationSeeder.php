<?php

namespace Database\Seeders;

use App\Models\Reservation;
use App\Models\User;
use App\Models\Vehicle;
use Illuminate\Database\Seeder;

class ReservationSeeder extends Seeder
{
    public function run(): void
    {
        $client = User::query()->where('email', 'client@carexpress.sn')->firstOrFail();
        $vehicle = Vehicle::query()->where('name', 'Toyota Land Cruiser')->firstOrFail();

        Reservation::query()->updateOrCreate(
            ['client_id' => $client->id, 'vehicle_id' => $vehicle->id],
            [
                'agency_id' => $vehicle->agency_id,
                'pickup_location' => 'Aeroport DSS',
                'pickup_date' => now()->addDays(5)->toDateString(),
                'pickup_time' => '09:00',
                'return_date' => now()->addDays(8)->toDateString(),
                'return_time' => '18:00',
                'days_count' => 3,
                'daily_rate' => $vehicle->price,
                'total_amount' => $vehicle->price * 3,
                'payment_method' => 'mobile_money',
                'status' => 'confirmed',
                'client_name' => $client->name,
                'client_phone' => $client->phone,
                'identity_number' => 'CNI123456789',
                'driver_license_number' => 'PERMIS221001',
                'accepted_terms' => true,
                'accepted_agency_terms' => true,
            ]
        );
    }
}
