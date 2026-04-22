<?php

use App\Http\Controllers\Api\Admin\AgencyController as AdminAgencyController;
use App\Http\Controllers\Api\Admin\AgencyRegistrationRequestController as AdminAgencyRegistrationRequestController;
use App\Http\Controllers\Api\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Api\Admin\SystemController as AdminSystemController;
use App\Http\Controllers\Api\Admin\UserController as AdminUserController;
use App\Http\Controllers\Api\Admin\VehicleController as AdminVehicleController;
use App\Http\Controllers\Api\Agency\AlertController as AgencyAlertController;
use App\Http\Controllers\Api\Agency\ConversationController as AgencyConversationController;
use App\Http\Controllers\Api\Agency\DashboardController as AgencyDashboardController;
use App\Http\Controllers\Api\Agency\ProfileController as AgencyProfileController;
use App\Http\Controllers\Api\Agency\PurchaseRequestController as AgencyPurchaseRequestController;
use App\Http\Controllers\Api\Agency\ReservationController as AgencyReservationController;
use App\Http\Controllers\Api\Agency\VehicleController as AgencyVehicleController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\Client\AlertController as ClientAlertController;
use App\Http\Controllers\Api\Client\ConversationController as ClientConversationController;
use App\Http\Controllers\Api\Client\ProfileController;
use App\Http\Controllers\Api\Client\PurchaseRequestController;
use App\Http\Controllers\Api\Client\ReservationController;
use App\Http\Controllers\Api\Client\VehicleReviewController as ClientVehicleReviewController;
use App\Http\Controllers\Api\Public\AgencyController;
use App\Http\Controllers\Api\Public\AgencyRegistrationRequestController;
use App\Http\Controllers\Api\Public\VehicleController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Route;

Route::get('/docs/openapi.json', function (Request $request) {
    $paths = [
        storage_path('api-docs/api-docs.json'),
        base_path('docs/swagger.json'),
    ];

    $path = collect($paths)->first(fn (string $candidate) => File::exists($candidate));

    abort_unless($path !== null, 404, 'Documentation OpenAPI introuvable.');

    $content = json_decode(File::get($path), true);

    abort_unless(is_array($content), 500, 'Documentation OpenAPI invalide.');

    $serverUrl = $request->getSchemeAndHttpHost();

    if ($serverUrl === '' || $serverUrl === 'http://localhost') {
        $serverUrl = rtrim(config('app.url'), '/');
    }

    $content['servers'] = [[
        'url' => rtrim($serverUrl, '/'),
        'description' => 'Serveur API',
    ]];

    return response()->json($content, 200, [
        'Content-Type' => 'application/json; charset=UTF-8',
        'Cache-Control' => 'public, max-age=60',
    ]);
})->name('swagger.openapi');

Route::prefix('v1')->group(function (): void {
    Route::prefix('catalogue')->group(function (): void {
        Route::get('/vehicules/filtres', [VehicleController::class, 'listCatalogueVehicleFilters']);
        Route::get('/vehicules', [VehicleController::class, 'listCatalogueVehicles']);
        Route::get('/vehicules/{vehicle}', [VehicleController::class, 'showCatalogueVehicle']);
        Route::get('/vehicules/{vehicle}/verifier-disponibilite', [VehicleController::class, 'checkCatalogueVehicleAvailability']);
        Route::get('/agences', [AgencyController::class, 'listCatalogueAgencies']);
        Route::get('/agences/{agency:slug}', [AgencyController::class, 'showCatalogueAgency']);
    });

    Route::post('/authentification/client/inscription', [AuthController::class, 'registerClient']);
    Route::post('/authentification/client/connexion', [AuthController::class, 'loginClient']);
    Route::post('/authentification/agence/inscription', [AuthController::class, 'registerAgency']);
    Route::post('/authentification/agence/connexion', [AuthController::class, 'loginAgency']);
    Route::post('/authentification/superadmin/connexion', [AuthController::class, 'loginSuperAdmin']);
    Route::post('/demandes-enregistrement-agence', [AgencyRegistrationRequestController::class, 'store']);

    Route::middleware('auth:sanctum')->group(function (): void {
        Route::get('/authentification/utilisateur-connecte', [AuthController::class, 'authenticatedUser']);
        Route::post('/authentification/deconnexion', [AuthController::class, 'logout']);

        Route::middleware('role:client')->prefix('client')->group(function (): void {
            Route::get('/profil', [ProfileController::class, 'show']);
            Route::put('/profil', [ProfileController::class, 'update']);
            Route::get('/reservations', [ReservationController::class, 'index']);
            Route::post('/reservations', [ReservationController::class, 'store']);
            Route::get('/demandes-achat', [PurchaseRequestController::class, 'index']);
            Route::post('/demandes-achat', [PurchaseRequestController::class, 'store']);
            Route::post('/vehicules/{vehicle}/avis', [ClientVehicleReviewController::class, 'store']);
            Route::get('/alertes', [ClientAlertController::class, 'index']);
            Route::patch('/alertes/{alert}/lire', [ClientAlertController::class, 'markAsRead']);
            Route::get('/conversations', [ClientConversationController::class, 'index']);
            Route::post('/conversations', [ClientConversationController::class, 'store']);
            Route::post('/conversations/{conversation}/messages', [ClientConversationController::class, 'sendMessage']);
        });

        Route::middleware('role:agency')->prefix('agence')->group(function (): void {
            Route::get('/tableau-de-bord', AgencyDashboardController::class);
            Route::get('/alertes', [AgencyAlertController::class, 'index']);
            Route::patch('/alertes/{alert}/lire', [AgencyAlertController::class, 'markAsRead']);
            Route::get('/conversations', [AgencyConversationController::class, 'index']);
            Route::post('/conversations', [AgencyConversationController::class, 'store']);
            Route::post('/conversations/{conversation}/messages', [AgencyConversationController::class, 'sendMessage']);
            Route::get('/vehicules', [AgencyVehicleController::class, 'index']);
            Route::post('/vehicules', [AgencyVehicleController::class, 'store']);
            Route::put('/vehicules/{vehicle}', [AgencyVehicleController::class, 'update']);
            Route::get('/reservations', [AgencyReservationController::class, 'index']);
            Route::patch('/reservations/{reservation}/statut', [AgencyReservationController::class, 'updateStatus']);
            Route::get('/demandes-achat', [AgencyPurchaseRequestController::class, 'index']);
            Route::patch('/demandes-achat/{purchaseRequest}/statut', [AgencyPurchaseRequestController::class, 'updateStatus']);
            Route::get('/profil', [AgencyProfileController::class, 'show']);
            Route::put('/profil', [AgencyProfileController::class, 'update']);
        });

        Route::middleware('role:admin')->prefix('administration')->group(function (): void {
            Route::get('/tableau-de-bord', AdminDashboardController::class);
            Route::get('/agences', [AdminAgencyController::class, 'index']);
            Route::get('/agences/{agency}', [AdminAgencyController::class, 'show']);
            Route::post('/agences', [AdminAgencyController::class, 'store']);
            Route::patch('/agences/{agency}/statut', [AdminAgencyController::class, 'updateStatus']);
            Route::patch('/vehicules/{vehicle}/valider', [AdminVehicleController::class, 'approve']);
            Route::get('/utilisateurs', [AdminUserController::class, 'index']);
            Route::get('/messages-demandes-agence', [AdminAgencyRegistrationRequestController::class, 'index']);
            Route::get('/messages-demandes-agence/{agencyRegistrationRequest}', [AdminAgencyRegistrationRequestController::class, 'show']);
            Route::get('/messages-demandes-agence/{agencyRegistrationRequest}/logo', [AdminAgencyRegistrationRequestController::class, 'showLogo'])
                ->name('agency-registration-requests.logo');
            Route::get('/messages-demandes-agence/{agencyRegistrationRequest}/documents/{documentIndex}/telecharger', [AdminAgencyRegistrationRequestController::class, 'downloadDocument'])
                ->whereNumber('documentIndex')
                ->name('agency-registration-requests.documents.download');
            Route::post('/messages-demandes-agence/{agencyRegistrationRequest}/enregistrer', [AdminAgencyRegistrationRequestController::class, 'approve']);
            Route::get('/systeme', AdminSystemController::class);
        });
    });
});
