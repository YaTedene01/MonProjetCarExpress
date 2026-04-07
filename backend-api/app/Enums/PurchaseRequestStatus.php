<?php

namespace App\Enums;

enum PurchaseRequestStatus: string
{
    case Pending = 'pending';
    case Contacted = 'contacted';
    case Negotiating = 'negotiating';
    case Closed = 'closed';
    case Cancelled = 'cancelled';

    public static function values(): array
    {
        return array_map(static fn (self $status) => $status->value, self::cases());
    }
}
