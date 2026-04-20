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
use Illuminate\Http\JsonResponse;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;

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

        abort_unless(Storage::disk('local')->exists($document['path']), 404, 'Fichier introuvable.');

        return Storage::disk('local')->response(
            $document['path'],
            $document['name'] ?? basename($document['path'])
        );
    }

    public function showLogo(AgencyRegistrationRequest $agencyRegistrationRequest)
    {
        $logoPath = $this->extractPublicStoragePath($agencyRegistrationRequest->logo_url);

        abort_unless($logoPath !== null, 404, 'Logo introuvable.');
        abort_unless(Storage::disk('public')->exists($logoPath), 404, 'Logo introuvable.');

        return Storage::disk('public')->response($logoPath);
    }

    public function approve(AgencyRegistrationRequest $agencyRegistrationRequest): JsonResponse
    {
        $existingAgencyFromRequest = Agency::query()
            ->where('metadata->registration_request_id', $agencyRegistrationRequest->id)
            ->first();

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

        if ($agencyRegistrationRequest->email !== null && $this->users->findByEmail($agencyRegistrationRequest->email) !== null) {
            throw ValidationException::withMessages([
                'email' => ['Cette adresse email est deja utilisee par un compte existant.'],
            ]);
        }

        if ($agencyRegistrationRequest->phone !== null && $this->users->findByPhone($agencyRegistrationRequest->phone) !== null) {
            throw ValidationException::withMessages([
                'phone' => ['Ce numero de telephone est deja utilise par un compte existant.'],
            ]);
        }

        try {
            DB::transaction(function () use ($agencyRegistrationRequest): void {
                [$contactFirstName, $contactLastName] = $this->splitManagerName($agencyRegistrationRequest->manager_name);

                $agency = $this->agencies->create([
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
                ]);

                $this->users->create([
                    'agency_id' => $agency->id,
                    'role' => UserRole::Agency,
                    'name' => $agencyRegistrationRequest->manager_name ?: $agencyRegistrationRequest->company,
                    'email' => $agencyRegistrationRequest->email,
                    'phone' => $agencyRegistrationRequest->phone,
                    'city' => $agencyRegistrationRequest->city,
                    'password' => $agencyRegistrationRequest->password,
                    'status' => 'active',
                ]);

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
}
