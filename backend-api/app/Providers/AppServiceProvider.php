<?php

namespace App\Providers;

use App\Repository\AgencyRepository;
use App\Repository\AlertRepository;
use App\Repository\PaymentRepository;
use App\Repository\PurchaseRequestRepository;
use App\Repository\ReservationRepository;
use App\Repository\UserRepository;
use App\Repository\VehicleRepository;
use App\Services\AgenceService;
use App\Services\AuthService;
use App\Services\DemandeAchatService;
use App\Services\ReservationService;
use App\Services\TarificationService;
use App\Services\VehiculeService;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->singleton(UserRepository::class);
        $this->app->singleton(AgencyRepository::class);
        $this->app->singleton(VehicleRepository::class);
        $this->app->singleton(ReservationRepository::class);
        $this->app->singleton(PurchaseRequestRepository::class);
        $this->app->singleton(PaymentRepository::class);
        $this->app->singleton(AlertRepository::class);

        $this->app->singleton(AuthService::class);
        $this->app->singleton(AgenceService::class);
        $this->app->singleton(VehiculeService::class);
        $this->app->singleton(ReservationService::class);
        $this->app->singleton(DemandeAchatService::class);
        $this->app->singleton(TarificationService::class);
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}
