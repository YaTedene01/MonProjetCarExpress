<?php

namespace App\Services;

use App\Enums\UserRole;
use App\Models\Agency;
use App\Repository\AgencyRepository;
use App\Repository\UserRepository;
use App\Utils\GenererReference;

class AgenceService
{
    public function __construct(
        private readonly AgencyRepository $agencies,
        private readonly UserRepository $users
    ) {}

    public function creerDepuisAdministration(array $data): Agency
    {
        $agency = $this->agencies->create([
            ...collect($data)->except(['manager_name', 'manager_email', 'manager_phone', 'manager_password'])->all(),
            'slug' => GenererReference::slug($data['name']),
            'status' => $data['status'] ?? 'pending',
        ]);

        $this->users->create([
            'agency_id' => $agency->id,
            'role' => UserRole::Agency,
            'name' => $data['manager_name'],
            'email' => $data['manager_email'],
            'phone' => $data['manager_phone'],
            'city' => $data['city'],
            'password' => $data['manager_password'] ?? 'agency12345',
            'status' => 'active',
        ]);

        return $agency->loadCount('vehicles');
    }
}
