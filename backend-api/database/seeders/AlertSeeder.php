<?php

namespace Database\Seeders;

use App\Models\Alert;
use App\Models\User;
use Illuminate\Database\Seeder;

class AlertSeeder extends Seeder
{
    public function run(): void
    {
        $client = User::query()->where('email', 'client@carexpress.sn')->firstOrFail();

        $alerts = [
            ['title' => 'Reservation confirmee', 'message' => 'Votre reservation Toyota Land Cruiser a ete confirmee.', 'is_read' => false],
            ['title' => 'Paiement recu', 'message' => 'Votre paiement Mobile Money a bien ete recu.', 'is_read' => true, 'read_at' => now()->subHours(5)],
            ['title' => 'Nouveau vehicule disponible', 'message' => 'Des SUV automatiques sont maintenant disponibles a Dakar.', 'is_read' => false],
        ];

        foreach ($alerts as $index => $alert) {
            Alert::query()->updateOrCreate(
                ['user_id' => $client->id, 'title' => $alert['title']],
                [
                    ...$alert,
                    'context' => ['channel' => 'in_app', 'position' => $index + 1],
                ]
            );
        }
    }
}
