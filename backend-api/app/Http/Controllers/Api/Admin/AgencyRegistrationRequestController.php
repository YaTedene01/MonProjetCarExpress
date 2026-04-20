<?php

namespace App\Http\Controllers\Api\Admin;

use App\Enums\UserRole;
use App\Http\Controllers\Controller;
use App\Http\Resources\AgencyRegistrationRequestResource;
use App\Models\Agency;
use App\Models\AgencyRegistrationRequest;
use App\Repository\AgencyRepository;
use App\Repository\UserRepository;
use App\Utils\GenererReference;
use Illuminate\Database\QueryException;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;
use Throwable;

class AgencyRegistrationRequestController extends Controller
{
    public function __construct(
        private readonly AgencyRepository $agencies,
        private readonly UserRepository $users
    ) {}

    public function index(): JsonResponse
    {
        $requests = AgencyRegistrationRequest::query()
            ->latest()
            ->get();

        return $this->successResponse(
            'Demandes d enregistrement agence recuperees avec succes.',
            AgencyRegistrationRequestResource::collection($requests)
        );
    }

    public function show(AgencyRegistrationRequest $agencyRegistrationRequest): JsonResponse
    {
        if ($agencyRegistrationRequest->read_at === null) {
            $agencyRegistrationRequest->forceFill([
                'read_at' => now(),
            ])->save();
        }

        return $this->successResponse(
            'Demande d enregistrement agence recuperee avec succes.',
            new AgencyRegistrationRequestResource($agencyRegistrationRequest)
        );
    }

    public function downloadDocument(AgencyRegistrationRequest $agencyRegistrationRequest, int $documentIndex)
    {
        $document = $agencyRegistrationRequest->documents[$documentIndex] ?? null;

        abort_unless(is_array($document) && isset($document['path']), 404, 'Document introuvable.');
        [$disk, $path] = $this->resolveStoredFile((string) $document['path'], ['local', 'public']);

        abort_unless($disk !== null && $path !== null, 404, 'Fichier introuvable.');

        return Storage::disk($disk)->response($path, $document['name'] ?? basename($path));
    }

    public function showLogo(AgencyRegistrationRequest $agencyRegistrationRequest)
    {
        [$disk, $logoPath] = $this->resolveStoredFile((string) $agencyRegistrationRequest->logo_url, ['public', 'local']);

        abort_unless($disk !== null && $logoPath !== null, 404, 'Logo introuvable.');

        return Storage::disk($disk)->response($logoPath);
    }

    public function approve(AgencyRegistrationRequest $agencyRegistrationRequest): JsonResponse
    {
        $existingAgencyFromRequest = $this->findExistingAgencyFromRequest($agencyRegistrationRequest);

        if ($existingAgencyFromRequest !== null) {
            if ($agencyRegistrationRequest->status !== 'approved') {
                $agencyRegistrationRequest->forceFill([
                    'status' => 'approved',
                    'reviewed_at' => $agencyRegistrationRequest->reviewed_at ?? now(),
                    'read_at' => $agencyRegistrationRequest->read_at ?? now(),
                ])->save();
            }

            return $this->successResponse(
                'Demande agence enregistree avec succes.',
                new AgencyRegistrationRequestResource($agencyRegistrationRequest->fresh())
            );
        }

        if ($agencyRegistrationRequest->status === 'approved') {
            return $this->successResponse(
                'Demande agence enregistree avec succes.',
                new AgencyRegistrationRequestResource($agencyRegistrationRequest->fresh())
            );
        }

        if ($agencyRegistrationRequest->status !== 'pending') {
            throw ValidationException::withMessages([
                'request' => ['Seules les demandes en attente peuvent etre enregistrees.'],
            ]);
        }

        if (! $agencyRegistrationRequest->password) {
            throw ValidationException::withMessages([
                'password' => ['Le mot de passe de cette demande est introuvable.'],
            ]);
        }

        $userColumns = $this->getTableColumns('users');

        if (isset($userColumns['email']) && $agencyRegistrationRequest->email !== null && $this->users->findByEmail($agencyRegistrationRequest->email) !== null) {
            throw ValidationException::withMessages([
                'email' => ['Cette adresse email est deja utilisee par un compte existant.'],
            ]);
        }

        if (isset($userColumns['phone']) && $agencyRegistrationRequest->phone !== null && $this->users->findByPhone($agencyRegistrationRequest->phone) !== null) {
            throw ValidationException::withMessages([
                'phone' => ['Ce numero de telephone est deja utilise par un compte existant.'],
            ]);
        }

        try {
            DB::transaction(function () use ($agencyRegistrationRequest): void {
                [$contactFirstName, $contactLastName] = $this->splitManagerName($agencyRegistrationRequest->manager_name);

                $agency = $this->agencies->create($this->filterColumns('agencies', [
                    'name' => $agencyRegistrationRequest->company,
                    'slug' => GenererReference::slug($agencyRegistrationRequest->company),
                    'activity' => $agencyRegistrationRequest->activity ?: 'Location et vente',
                    'city' => $agencyRegistrationRequest->city,
                    'district' => $agencyRegistrationRequest->district,
                    'address' => $agencyRegistrationRequest->address,
                    'contact_first_name' => $contactFirstName,
                    'contact_last_name' => $contactLastName,
                    'contact_phone' => $agencyRegistrationRequest->phone,
                    'contact_email' => $agencyRegistrationRequest->email,
                    'ninea' => $agencyRegistrationRequest->ninea,
                    'color' => $agencyRegistrationRequest->color ?: '#D40511',
                    'logo_url' => $agencyRegistrationRequest->logo_url,
                    'status' => 'pending',
                    'documents' => $agencyRegistrationRequest->documents,
                    'metadata' => [
                        'source' => 'agency_registration_request',
                        'registration_request_id' => $agencyRegistrationRequest->id,
                        'registration_request_snapshot' => [
                            'company' => $agencyRegistrationRequest->company,
                            'manager_name' => $agencyRegistrationRequest->manager_name,
                            'email' => $agencyRegistrationRequest->email,
                            'phone' => $agencyRegistrationRequest->phone,
                            'city' => $agencyRegistrationRequest->city,
                            'activity' => $agencyRegistrationRequest->activity,
                            'district' => $agencyRegistrationRequest->district,
                            'address' => $agencyRegistrationRequest->address,
                            'ninea' => $agencyRegistrationRequest->ninea,
                            'color' => $agencyRegistrationRequest->color,
                            'logo_url' => $agencyRegistrationRequest->logo_url,
                            'documents' => $agencyRegistrationRequest->documents,
                        ],
                    ],
                ]));

                $this->users->create($this->filterColumns('users', [
                    'agency_id' => $agency->id,
                    'role' => UserRole::Agency,
                    'name' => $agencyRegistrationRequest->manager_name ?: $agencyRegistrationRequest->company,
                    'email' => $agencyRegistrationRequest->email,
                    'phone' => $agencyRegistrationRequest->phone,
                    'city' => $agencyRegistrationRequest->city,
                    'password' => $agencyRegistrationRequest->password,
                    'status' => 'active',
                ]));

                $agencyRegistrationRequest->forceFill([
                    'status' => 'approved',
                    'reviewed_at' => now(),
                    'read_at' => $agencyRegistrationRequest->read_at ?? now(),
                ])->save();
            });
        } catch (QueryException $exception) {
            $sqlState = (string) ($exception->errorInfo[0] ?? '');

            if (in_array($sqlState, ['23000', '23505'], true)) {
                throw ValidationException::withMessages([
                    'request' => ['Une agence ou un utilisateur existe deja avec ces informations.'],
                ]);
            }

            throw $exception;
        } catch (Throwable $exception) {
            Log::error('Echec de l enregistrement d une demande agence.', [
                'request_id' => $agencyRegistrationRequest->id,
                'company' => $agencyRegistrationRequest->company,
                'email' => $agencyRegistrationRequest->email,
                'phone' => $agencyRegistrationRequest->phone,
                'error' => $exception->getMessage(),
            ]);

            throw $exception;
        }

        return $this->successResponse(
            'Demande agence enregistree avec succes.',
            new AgencyRegistrationRequestResource($agencyRegistrationRequest->fresh())
        );
    }

    private function splitManagerName(?string $managerName): array
    {
        $trimmedName = trim((string) $managerName);

        if ($trimmedName === '') {
            return [null, null];
        }

        $parts = preg_split('/\s+/', $trimmedName) ?: [];
        $firstName = array_shift($parts) ?: null;
        $lastName = $parts !== [] ? implode(' ', $parts) : null;

        return [$firstName, $lastName];
    }

    private function extractPublicStoragePath(?string $value): ?string
    {
        $path = trim((string) $value);

        if ($path === '') {
            return null;
        }

        $parsedPath = parse_url($path, PHP_URL_PATH);
        $normalizedPath = is_string($parsedPath) && $parsedPath !== '' ? $parsedPath : $path;

        if (! str_starts_with($normalizedPath, '/storage/')) {
            return null;
        }

        return ltrim(substr($normalizedPath, strlen('/storage/')), '/');
    }

    private function resolveStoredFile(string $value, array $preferredDisks): array
    {
        $path = trim($value);

        if ($path === '') {
            return [null, null];
        }

        $publicPath = $this->extractPublicStoragePath($path);
        $candidatePaths = array_values(array_unique(array_filter([
            $publicPath,
            ltrim($path, '/'),
        ])));

        foreach ($preferredDisks as $disk) {
            foreach ($candidatePaths as $candidatePath) {
                if (Storage::disk($disk)->exists($candidatePath)) {
                    return [$disk, $candidatePath];
                }
            }
        }

        return [null, null];
    }

    private function findExistingAgencyFromRequest(AgencyRegistrationRequest $agencyRegistrationRequest): ?Agency
    {
        $agencyColumns = $this->getTableColumns('agencies');

        if (isset($agencyColumns['metadata'])) {
            $agency = Agency::query()
                ->where('metadata->registration_request_id', $agencyRegistrationRequest->id)
                ->first();

            if ($agency !== null) {
                return $agency;
            }
        }

        $query = Agency::query();

        if (isset($agencyColumns['contact_email']) && $agencyRegistrationRequest->email) {
            $query->where('contact_email', $agencyRegistrationRequest->email);
        } elseif (isset($agencyColumns['contact_phone']) && $agencyRegistrationRequest->phone) {
            $query->where('contact_phone', $agencyRegistrationRequest->phone);
        } elseif (isset($agencyColumns['name'])) {
            $query->where('name', $agencyRegistrationRequest->company);
        } else {
            return null;
        }

        return $query->first();
    }

    private function filterColumns(string $table, array $payload): array
    {
        $columns = $this->getTableColumns($table);

        return array_filter(
            $payload,
            static fn (string $key): bool => isset($columns[$key]),
            ARRAY_FILTER_USE_KEY
        );
    }

    private function getTableColumns(string $table): array
    {
        static $cache = [];

        if (! array_key_exists($table, $cache)) {
            $cache[$table] = Schema::hasTable($table)
                ? array_flip(Schema::getColumnListing($table))
                : [];
        }

        return $cache[$table];
    }
}
