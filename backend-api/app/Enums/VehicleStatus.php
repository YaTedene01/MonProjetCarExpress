<?php

namespace App\Enums;

enum VehicleStatus: string
{
    case Pending = 'pending';
    case Available = 'available';
    case Rented = 'rented';
    case ForSale = 'for_sale';
    case Maintenance = 'maintenance';
    case Sold = 'sold';
    case Draft = 'draft';

    public static function values(): array
    {
        return array_map(static fn (self $status) => $status->value, self::cases());
    }
}
