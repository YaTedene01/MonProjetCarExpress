<?php

namespace App\Utils;

use Illuminate\Support\Str;

class GenererReference
{
    public static function vehicule(): string
    {
        return 'VHC-'.Str::upper(Str::random(8));
    }

    public static function paiementReservation(): string
    {
        return 'PAY-RES-'.Str::upper(Str::random(10));
    }

    public static function paiementAchat(): string
    {
        return 'PAY-ACH-'.Str::upper(Str::random(10));
    }

    public static function slug(string $value): string
    {
        return Str::slug($value.'-'.Str::lower(Str::random(5)));
    }
}
