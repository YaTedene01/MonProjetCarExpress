<?php

namespace App\Enums;

enum PaymentMethod: string
{
    case Card = 'card';
    case MobileMoney = 'mobile_money';
    case Cash = 'cash';

    public static function values(): array
    {
        return array_map(static fn (self $method) => $method->value, self::cases());
    }
}
