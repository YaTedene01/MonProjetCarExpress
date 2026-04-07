<?php

namespace App\Console;

use App\Console\Commands\RefreshSwaggerDocumentation;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;

class Kernel extends ConsoleKernel
{
    /**
     * Commandes metier exposees par le projet.
     *
     * @var array<int, class-string>
     */
    protected $commands = [
        RefreshSwaggerDocumentation::class,
    ];
}
