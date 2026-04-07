<?php

namespace App\Http;

use App\Http\Middleware\EnsureUserRole;
use Illuminate\Foundation\Http\Kernel as HttpKernel;

class Kernel extends HttpKernel
{
    /**
     * Middleware globaux conserves ici pour rendre l'architecture explicite.
     * La configuration active du projet reste centralisee dans bootstrap/app.php.
     *
     * @var array<int, class-string|string>
     */
    protected $middleware = [];

    /**
     * Groupes de middleware HTTP.
     *
     * @var array<string, array<int, class-string|string>>
     */
    protected $middlewareGroups = [
        'web' => [],
        'api' => [],
    ];

    /**
     * Alias lisibles utilises dans les routes.
     *
     * @var array<string, class-string|string>
     */
    protected $middlewareAliases = [
        'role' => EnsureUserRole::class,
    ];
}
