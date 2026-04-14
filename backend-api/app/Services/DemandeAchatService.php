<?php

namespace App\Services;

use App\Enums\UserRole;
use App\Models\Alert;
use App\Models\User;
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

        $this->notifierAgenceEtAdministrationNouvelAchat($purchaseRequest, $vehicle, $data, $clientId, $serviceFee);

        return $purchaseRequest->load(['vehicle.agency', 'agency']);
    }

    private function notifierAgenceEtAdministrationNouvelAchat(
        object $purchaseRequest,
        object $vehicle,
        array $data,
        int $clientId,
        float|int|string $serviceFee
    ): void {
        $agencyUserIds = User::query()
            ->where('agency_id', $vehicle->agency_id)
            ->where('role', UserRole::Agency->value)
            ->pluck('id');

        $adminUserIds = User::query()
            ->where('role', UserRole::Admin->value)
            ->pluck('id');

        if ($agencyUserIds->isEmpty() && $adminUserIds->isEmpty()) {
            return;
        }

        $now = now();
        $clientName = (string) ($data['client_name'] ?? '');
        $vehicleName = (string) ($vehicle->name ?? 'Vehicule');
        $serviceFeeAmount = number_format((float) $serviceFee, 0, ',', ' ');
        $agencyName = (string) ($vehicle->agency->name ?? 'Agence');

        $agencyAlerts = $agencyUserIds->map(fn (int $userId): array => [
            'user_id' => $userId,
            'title' => 'Nouvelle demande d\'achat client',
            'message' => sprintf(
                '%s a confirme l\'achat de %s. Frais de service regles: %s F CFA.',
                $clientName !== '' ? $clientName : 'Un client',
                $vehicleName,
                $serviceFeeAmount
            ),
            'context' => [
                'type' => 'purchase_request_created',
                'purchase_request_id' => $purchaseRequest->id,
                'vehicle_id' => $vehicle->id,
                'agency_id' => $vehicle->agency_id,
                'client_id' => $clientId,
                'service_fee' => (float) $serviceFee,
            ],
            'is_read' => false,
            'created_at' => $now,
            'updated_at' => $now,
        ]);

        $adminAlerts = $adminUserIds->map(fn (int $userId): array => [
            'user_id' => $userId,
            'title' => 'Frais de service achat encaisses',
            'message' => sprintf(
                '%s a confirme l\'achat de %s chez %s. Frais de service a suivre: %s F CFA.',
                $clientName !== '' ? $clientName : 'Un client',
                $vehicleName,
                $agencyName,
                $serviceFeeAmount
            ),
            'context' => [
                'type' => 'purchase_service_fee_paid',
                'purchase_request_id' => $purchaseRequest->id,
                'vehicle_id' => $vehicle->id,
                'agency_id' => $vehicle->agency_id,
                'client_id' => $clientId,
                'service_fee' => (float) $serviceFee,
            ],
            'is_read' => false,
            'created_at' => $now,
            'updated_at' => $now,
        ]);

        Alert::query()->insert([
            ...$agencyAlerts->all(),
            ...$adminAlerts->all(),
        ]);
    }
}
