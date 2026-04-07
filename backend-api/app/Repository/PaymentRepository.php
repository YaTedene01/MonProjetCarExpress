<?php

namespace App\Repository;

use App\Models\Payment;

class PaymentRepository
{
    public function create(array $data): Payment
    {
        return Payment::query()->create($data);
    }
}
