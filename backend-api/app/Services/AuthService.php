<?php

namespace App\Services;

use App\Enums\AgencyStatus;
use App\Enums\UserRole;
use App\Models\AgencyRegistrationRequest;
use App\Repository\AgencyRepository;
use App\Repository\UserRepository;
use App\Utils\GenererReference;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Schema;
use Illuminate\Validation\ValidationException;
use Throwable;

class AuthService
{
    public function __construct(
        private readonly UserRepository $users,
        private readonly AgencyRepository $agencies
    ) {}

    public function inscrireClient(array $data): array
    {
        $user = $this->users->create([
            'role' => UserRole::Client,
            'name' => $data['name'] ?: $this->genererNomParDefautDepuisIdentifiants($data['email'], $data['phone']),
            'email' => $data['email'],
            'phone' => $data['phone'],
            'city' => $data['city'],
            'password' => $data['password'],
            'status' => 'active',
        ]);

        return [
            'utilisateur' => $user,
            'token' => $user->createToken($data['device_name'] ?? 'client-web')->plainTextToken,
        ];
    }

    public function inscrireAgence(array $data): array
    {
        return DB::transaction(function () use ($data): array {
            $agency = $this->agencies->create([
                'name' => $data['company'],
                'slug' => GenererReference::slug($data['company']),
                'activity' => $data['activity'] ?? 'Location et vente',
                'city' => $data['city'],
                'contact_phone' => $data['phone'],
                'contact_email' => $data['email'],
                'status' => 'pending',
                'metadata' => [
                    'source' => 'public_agency_signup',
                ],
            ]);

            $user = $this->users->create([
                'agency_id' => $agency->id,
                'role' => UserRole::Agency,
                'name' => $data['company'],
                'email' => $data['email'],
                'phone' => $data['phone'],
                'city' => $data['city'],
                'password' => $data['password'],
                'status' => 'active',
            ]);

            return [
                'utilisateur' => $user->load('agency'),
                'agence' => $agency->loadCount('vehicles'),
                'token' => $user->createToken($data['device_name'] ?? 'agency-web')->plainTextToken,
            ];
        });
    }

    public function connecter(array $data): array
    {
        $user = $this->users->findByRoleAndIdentifier($data['role'], $data['identifier']);

        if (! $user || ! Hash::check($data['password'], $user->password)) {
            if ($data['role'] === UserRole::Agency->value && $this->isPendingAgencyRegistration($data['identifier'])) {
                throw ValidationException::withMessages([
                    'identifier' => ['Votre demande est en attente de validation par l administration.'],
                ]);
            }

            throw ValidationException::withMessages([
                'identifier' => ['Les identifiants fournis sont invalides.'],
            ]);
        }

        if ($data['role'] === UserRole::Agency->value) {
            $agencyStatus = $this->resolveAgencyStatusRaw($user->agency_id);

            if ($agencyStatus === AgencyStatus::Suspended->value) {
                throw ValidationException::withMessages([
                    'identifier' => ['Votre agence est suspendue. Contactez l administration.'],
                ]);
            }

            if ($user->agency_id !== null && $agencyStatus === AgencyStatus::Pending->value) {
                DB::table('agencies')
                    ->where('id', $user->agency_id)
                    ->update([
                        'status' => AgencyStatus::Active->value,
                        'updated_at' => now(),
                    ]);
            }

            if ($user->agency_id !== null && $agencyStatus !== null && ! in_array($agencyStatus, AgencyStatus::values(), true)) {
                throw ValidationException::withMessages([
                    'identifier' => ['Le statut de votre agence est invalide. Contactez l administration.'],
                ]);
            }
        }

        $user->forceFill(['last_login_at' => now()])->save();

        return [
            'utilisateur' => $this->safeLoadAgency($user),
            'token' => $user->createToken($data['device_name'] ?? 'web-app')->plainTextToken,
        ];
    }

    private function genererNomParDefautDepuisIdentifiants(string $email, string $phone): string
    {
        $emailPrefix = trim((string) strstr($email, '@', true));
        $candidate = $emailPrefix !== '' ? $emailPrefix : $phone;
        $candidate = trim(str_replace(['.', '_', '-'], ' ', $candidate));

        return $candidate !== ''
            ? ucwords($candidate)
            : 'Client Car Express';
    }

    private function isPendingAgencyRegistration(string $identifier): bool
    {
        try {
            if (! Schema::hasTable('agency_registration_requests')) {
                return false;
            }

            return AgencyRegistrationRequest::query()
                ->where('status', 'pending')
                ->where(function ($query) use ($identifier): void {
                    $query->where('email', $identifier)
                        ->orWhere('phone', $identifier);
                })
                ->exists();
        } catch (Throwable) {
            return false;
        }
    }

    private function resolveAgencyStatusRaw(?int $agencyId): ?string
    {
        if ($agencyId === null || ! Schema::hasTable('agencies')) {
            return null;
        }

        try {
            $status = DB::table('agencies')
                ->where('id', $agencyId)
                ->value('status');

            return is_string($status) ? $status : null;
        } catch (QueryException) {
            return null;
        }
    }

    private function safeLoadAgency($user)
    {
        try {
            return $user->load('agency');
        } catch (Throwable) {
            return $user;
        }
    }
}
