<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            AgencySeeder::class,
            VehicleSeeder::class,
            ReservationSeeder::class,
            PurchaseRequestSeeder::class,
            PaymentSeeder::class,
            AlertSeeder::class,
        ]);
    }
}
