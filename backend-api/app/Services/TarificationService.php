<?php

namespace App\Services;

use App\Enums\ListingType;
use App\Exceptions\ApiException;

class TarificationService
{
    /**
     * @return array{
     *   percentage:int,
     *   amount:float,
     *   listing_type:string,
     *   price:float
     * }
     */
    public function calculate(float $price, string $listingType): array
    {
        $normalizedType = $listingType instanceof ListingType ? $listingType->value : $listingType;
        $percentage = $this->resolvePercentage($price, $normalizedType);

        if ($percentage === null) {
            throw new ApiException($this->buildOutOfRangeMessage($normalizedType), 422, [
                'price' => [$this->buildOutOfRangeMessage($normalizedType)],
            ]);
        }

        return [
            'percentage' => $percentage,
            'amount' => round($price * ($percentage / 100), 2),
            'listing_type' => $normalizedType,
            'price' => $price,
        ];
    }

    /**
     * @return array{
     *   percentage:int,
     *   amount:float,
     *   listing_type:string,
     *   price:float
     * }|null
     */
    public function describe(float $price, string $listingType): ?array
    {
        try {
            return $this->calculate($price, $listingType);
        } catch (ApiException) {
            return null;
        }
    }

    private function resolvePercentage(float $price, string $listingType): ?int
    {
        $bands = match ($listingType) {
            ListingType::Rental->value => [
                ['min' => 20000, 'max' => 29999.99, 'percentage' => 15],
                ['min' => 30000, 'max' => 39999.99, 'percentage' => 20],
                ['min' => 40000, 'max' => 49999.99, 'percentage' => 25],
                ['min' => 50000, 'max' => 99999.99, 'percentage' => 30],
                ['min' => 100000, 'max' => null, 'percentage' => 35],
            ],
            ListingType::Sale->value => [
                ['min' => 500000, 'max' => 999999.99, 'percentage' => 15],
                ['min' => 1000000, 'max' => 1999999.99, 'percentage' => 20],
                ['min' => 2000000, 'max' => 2999999.99, 'percentage' => 25],
                ['min' => 3000000, 'max' => 4999999.99, 'percentage' => 30],
                ['min' => 5000000, 'max' => null, 'percentage' => 35],
            ],
            default => [],
        };

        foreach ($bands as $band) {
            $matchesMin = $price >= $band['min'];
            $matchesMax = $band['max'] === null || $price <= $band['max'];

            if ($matchesMin && $matchesMax) {
                return $band['percentage'];
            }
        }

        return null;
    }

    private function buildOutOfRangeMessage(string $listingType): string
    {
        return $listingType === ListingType::Rental->value
            ? 'Le prix location doit respecter la grille tarifaire Car Express a partir de 20 000 F CFA par jour.'
            : 'Le prix achat doit respecter la grille tarifaire Car Express a partir de 500 000 F CFA.';
    }
}
