<?php

namespace Database\Seeders;

use App\Enums\UserRole;
use App\Models\Agency;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class AgencySeeder extends Seeder
{
    public function run(): void
    {
        $agencies = [
            ['name' => 'Agence Dakar Auto', 'activity' => 'Location', 'city' => 'Dakar', 'district' => 'Plateau', 'color' => '#D40511', 'status' => 'active'],
            ['name' => 'TransAfrica Location', 'activity' => 'Location', 'city' => 'Dakar', 'district' => 'Almadies', 'color' => '#A61E4D', 'status' => 'active'],
            ['name' => 'Premium Cars Dakar', 'activity' => 'Location & Vente', 'city' => 'Dakar', 'district' => 'Mermoz', 'color' => '#7A5C00', 'status' => 'active'],
            ['name' => 'Dakar Auto Services', 'activity' => 'Location & Vente', 'city' => 'Dakar', 'district' => 'Medina', 'color' => '#D40511', 'status' => 'active'],
            ['name' => 'Auto Plus SN', 'activity' => 'Vente', 'city' => 'Dakar', 'district' => 'Sacre-Coeur', 'color' => '#1F2937', 'status' => 'active'],
            ['name' => 'Elite Motors SN', 'activity' => 'Vente', 'city' => 'Dakar', 'district' => 'Plateau', 'color' => '#111111', 'status' => 'active'],
            ['name' => 'AutoSud SN', 'activity' => 'Location & Vente', 'city' => 'Thies', 'district' => 'Centre', 'color' => '#2563EB', 'status' => 'pending'],
            ['name' => 'MobileCar', 'activity' => 'Vente', 'city' => 'Dakar', 'district' => 'Grand-Yoff', 'color' => '#F59E0B', 'status' => 'active'],
        ];

        foreach ($agencies as $index => $data) {
            $agency = Agency::query()->updateOrCreate(
                ['slug' => Str::slug($data['name'])],
                [
                    ...$data,
                    'slug' => Str::slug($data['name']),
                    'contact_first_name' => 'Responsable',
                    'contact_last_name' => (string) ($index + 1),
                    'contact_phone' => '+2217700000'.str_pad((string) ($index + 1), 2, '0', STR_PAD_LEFT),
                    'contact_email' => 'contact+'.Str::slug($data['name']).'@carexpress.sn',
                    'ninea' => 'SN-AGENCY-'.str_pad((string) ($index + 1), 4, '0', STR_PAD_LEFT),
                    'metadata' => [
                        'rating' => 4.5,
                        'response_time_minutes' => 24,
                    ],
                ]
            );

            User::query()->updateOrCreate(
                ['email' => 'agency+'.Str::slug($data['name']).'@carexpress.sn'],
                [
                    'agency_id' => $agency->id,
                    'role' => UserRole::Agency,
                    'name' => $agency->name.' Manager',
                    'phone' => '+2217600000'.str_pad((string) ($index + 1), 2, '0', STR_PAD_LEFT),
                    'city' => $agency->city,
                    'password' => 'agency12345',
                    'status' => 'active',
                ]
            );
        }

        User::query()->updateOrCreate(
            ['email' => 'admin@carexpress.sn'],
            [
                'role' => UserRole::Admin,
                'name' => 'Car Express Admin',
                'phone' => '+221770001111',
                'city' => 'Dakar',
                'password' => 'admin12345',
                'status' => 'active',
            ]
        );

        User::query()->updateOrCreate(
            ['email' => 'client@carexpress.sn'],
            [
                'role' => UserRole::Client,
                'name' => 'Client Car Express',
                'phone' => '+221771234567',
                'city' => 'Dakar',
                'password' => 'client12345',
                'status' => 'active',
            ]
        );

        User::query()->updateOrCreate(
            ['email' => 'moussa@carexpress.sn'],
            [
                'role' => UserRole::Client,
                'name' => 'Moussa Diallo',
                'phone' => '+221769876543',
                'city' => 'Dakar',
                'password' => 'client12345',
                'status' => 'active',
            ]
        );
    }
}
