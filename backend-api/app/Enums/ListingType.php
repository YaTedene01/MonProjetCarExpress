<?php

namespace App\Enums;

enum ListingType: string
{
    case Rental = 'rental';
    case Sale = 'sale';

    public static function values(): array
    {
        return array_map(static fn (self $type) => $type->value, self::cases());
    }
}
