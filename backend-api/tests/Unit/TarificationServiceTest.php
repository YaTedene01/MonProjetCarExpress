<?php

namespace Tests\Unit;

use App\Exceptions\ApiException;
use App\Services\TarificationService;
use PHPUnit\Framework\TestCase;

class TarificationServiceTest extends TestCase
{
    public function test_it_calculates_rental_pricing_percentage(): void
    {
        $service = new TarificationService();

        $pricing = $service->calculate(85000, 'rental');

        $this->assertSame(30, $pricing['percentage']);
        $this->assertSame(25500.0, $pricing['amount']);
    }

    public function test_it_calculates_sale_pricing_percentage(): void
    {
        $service = new TarificationService();

        $pricing = $service->calculate(7200000, 'sale');

        $this->assertSame(35, $pricing['percentage']);
        $this->assertSame(2520000.0, $pricing['amount']);
    }

    public function test_it_rejects_prices_below_minimum_band(): void
    {
        $this->expectException(ApiException::class);

        (new TarificationService())->calculate(15000, 'rental');
    }
}
