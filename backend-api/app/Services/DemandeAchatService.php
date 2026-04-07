<?php

namespace App\Services;

use App\Repository\PaymentRepository;
use App\Repository\PurchaseRequestRepository;
use App\Utils\GenererReference;

class DemandeAchatService
{
    public function __construct(
        private readonly PurchaseRequestRepository $purchaseRequests,
        private readonly PaymentRepository $payments
    ) {}

    public function creer(array $data, object $vehicle, int $clientId)
    {
        $serviceFee = $vehicle->service_fee ?: 95000;

        $purchaseRequest = $this->purchaseRequests->create([
            ...$data,
            'agency_id' => $vehicle->agency_id,
            'client_id' => $clientId,
            'service_fee' => $serviceFee,
            'status' => 'pending',
        ]);

        $this->payments->create([
            'purchase_request_id' => $purchaseRequest->id,
            'amount' => $serviceFee,
            'method' => $purchaseRequest->payment_method,
            'status' => 'paid',
            'paid_at' => now(),
            'reference' => GenererReference::paiementAchat(),
        ]);

        return $purchaseRequest->load(['vehicle.agency', 'agency']);
    }
}
