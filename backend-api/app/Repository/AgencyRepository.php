<?php

namespace App\Repository;

use App\Models\Agency;

class AgencyRepository
{
    public function getActiveWithCount()
    {
        return Agency::query()
            ->withCount('vehicles')
            ->where('status', 'active')
            ->latest()
            ->get();
    }

    public function getAllWithCount()
    {
        return Agency::query()->withCount('vehicles')->latest()->get();
    }

    public function findForAdminShow(Agency $agency): Agency
    {
        return $agency->load([
            'vehicles' => fn ($query) => $query->latest(),
        ])->loadCount('vehicles');
    }

    public function create(array $data): Agency
    {
        return Agency::query()->create($data);
    }

    public function updateStatus(Agency $agency, string $status): Agency
    {
        $agency->update(['status' => $status]);

        return $agency->fresh()->loadCount('vehicles');
    }
}
