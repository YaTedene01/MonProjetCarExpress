<?php

namespace Database\Seeders;

use App\Models\Payment;
use App\Models\PurchaseRequest;
use App\Models\Reservation;
use Illuminate\Database\Seeder;

class PaymentSeeder extends Seeder
{
    public function run(): void
    {
        $reservation = Reservation::query()->first();

        if ($reservation) {
            Payment::query()->updateOrCreate(
                ['reservation_id' => $reservation->id],
                [
                    'amount' => $reservation->total_amount,
                    'currency' => 'XOF',
                    'method' => $reservation->payment_method,
                    'status' => 'paid',
                    'paid_at' => now()->subDay(),
                    'reference' => 'PAY-SEEDED-RES-001',
                ]
            );
        }

        $purchaseRequest = PurchaseRequest::query()->first();

        if ($purchaseRequest) {
            Payment::query()->updateOrCreate(
                ['purchase_request_id' => $purchaseRequest->id],
                [
                    'amount' => $purchaseRequest->service_fee,
                    'currency' => 'XOF',
                    'method' => $purchaseRequest->payment_method,
                    'status' => 'paid',
                    'paid_at' => now()->subHours(6),
                    'reference' => 'PAY-SEEDED-SALE-001',
                ]
            );
        }
    }
}
