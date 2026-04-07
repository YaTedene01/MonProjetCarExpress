<?php

namespace App\Repository;

use App\Models\PurchaseRequest;

class PurchaseRequestRepository
{
    public function getClientRequests(int $clientId)
    {
        return PurchaseRequest::query()
            ->with(['vehicle.agency', 'agency'])
            ->where('client_id', $clientId)
            ->latest()
            ->get();
    }

    public function getAgencyRequests(int $agencyId)
    {
        return PurchaseRequest::query()
            ->with(['vehicle', 'client'])
            ->where('agency_id', $agencyId)
            ->latest()
            ->get();
    }

    public function create(array $data): PurchaseRequest
    {
        return PurchaseRequest::query()->create($data);
    }

    public function updateStatus(PurchaseRequest $purchaseRequest, string $status): PurchaseRequest
    {
        $purchaseRequest->update(['status' => $status]);

        return $purchaseRequest->load(['vehicle', 'client']);
    }
}
