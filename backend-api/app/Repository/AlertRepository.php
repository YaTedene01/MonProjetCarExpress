<?php

namespace App\Repository;

use App\Models\Alert;

class AlertRepository
{
    public function getByUser(int $userId)
    {
        return Alert::query()->where('user_id', $userId)->latest()->get();
    }

    public function markAsRead(Alert $alert): Alert
    {
        $alert->update([
            'is_read' => true,
            'read_at' => now(),
        ]);

        return $alert;
    }
}
