<?php

namespace App\Http\Controllers\Api\Admin;

use App\Enums\UserRole;
use App\Http\Controllers\Controller;
use App\Http\Resources\AgencyRegistrationRequestResource;
use App\Models\AgencyRegistrationRequest;
use App\Repository\AgencyRepository;
use App\Repository\UserRepository;
use App\Utils\GenererReference;
use Illuminate\Http\JsonResponse;
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

        return Storage::disk('local')->download(
            $document['path'],
            $document['name'] ?? basename($document['path'])
        );
    }

    public function approve(AgencyRegistrationRequest $agencyRegistrationRequest): JsonResponse
    {
        if ($agencyRegistrationRequest->status === 'approved') {
            throw ValidationException::withMessages([
                'request' => ['Cette demande a deja ete enregistree.'],
            ]);
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

        DB::transaction(function () use ($agencyRegistrationRequest): void {
            $agency = $this->agencies->create([
                'name' => $agencyRegistrationRequest->company,
                'slug' => GenererReference::slug($agencyRegistrationRequest->company),
                'activity' => $agencyRegistrationRequest->activity ?: 'Location et vente',
                'city' => $agencyRegistrationRequest->city,
                'district' => $agencyRegistrationRequest->district,
                'address' => $agencyRegistrationRequest->address,
                'contact_phone' => $agencyRegistrationRequest->phone,
                'contact_email' => $agencyRegistrationRequest->email,
                'ninea' => $agencyRegistrationRequest->ninea,
                'color' => $agencyRegistrationRequest->color ?: '#D40511',
                'logo_url' => $agencyRegistrationRequest->logo_url,
                'status' => 'active',
                'documents' => $agencyRegistrationRequest->documents,
                'metadata' => [
                    'source' => 'agency_registration_request',
                    'registration_request_id' => $agencyRegistrationRequest->id,
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

        return $this->successResponse(
            'Demande agence enregistree avec succes.',
            new AgencyRegistrationRequestResource($agencyRegistrationRequest->fresh())
        );
    }
}
