<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Artisan;

class RefreshSwaggerDocumentation extends Command
{
    protected $signature = 'carexpress:swagger:refresh {--with-cache-clear : Nettoie le cache avant generation}';

    protected $description = 'Regenerer la documentation Swagger/OpenAPI du projet.';

    public function handle(): int
    {
        if ($this->option('with-cache-clear')) {
            Artisan::call('optimize:clear');
            $this->components->info('Caches Laravel nettoyes.');
        }

        Artisan::call('l5-swagger:generate');

        $this->components->info('Documentation Swagger regeneree avec succes.');

        return self::SUCCESS;
    }
}
