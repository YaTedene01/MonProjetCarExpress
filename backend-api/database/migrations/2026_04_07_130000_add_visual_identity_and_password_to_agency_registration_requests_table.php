<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('agency_registration_requests')) {
            return;
        }

        Schema::table('agency_registration_requests', function (Blueprint $table): void {
            if (! Schema::hasColumn('agency_registration_requests', 'color')) {
                $table->string('color', 20)->default('#D40511')->after('ninea');
            }

            if (! Schema::hasColumn('agency_registration_requests', 'logo_url')) {
                $table->string('logo_url')->nullable()->after('color');
            }

            if (! Schema::hasColumn('agency_registration_requests', 'password')) {
                $table->string('password')->nullable()->after('logo_url');
            }
        });
    }

    public function down(): void
    {
        if (! Schema::hasTable('agency_registration_requests')) {
            return;
        }

        Schema::table('agency_registration_requests', function (Blueprint $table): void {
            $columnsToDrop = [];

            foreach (['color', 'logo_url', 'password'] as $column) {
                if (Schema::hasColumn('agency_registration_requests', $column)) {
                    $columnsToDrop[] = $column;
                }
            }

            if ($columnsToDrop !== []) {
                $table->dropColumn($columnsToDrop);
            }
        });
    }
};
