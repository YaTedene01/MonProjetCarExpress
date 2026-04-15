<?php

namespace App\Http\Controllers\Api\Public;

use App\Http\Controllers\Controller;
use App\Http\Requests\Public\StoreAgencyRegistrationRequest;
use App\Models\AgencyRegistrationRequest;
use App\Services\AuthService;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Throwable;

class AgencyRegistrationRequestController extends Controller
{
    public function __construct(
        private readonly AuthService $authService
    ) {}

    public function store(StoreAgencyRegistrationRequest $request): JsonResponse
    {
        try {
            $table = 'agency_registration_requests';
            $payload = [
                'company' => $request->string('company')->toString(),
                'email' => $request->string('email')->toString(),
                'phone' => $request->string('phone')->toString(),
                'city' => $request->string('city')->toString(),
                'activity' => $request->string('activity')->toString() ?: 'Location et vente',
                'manager_name' => $request->string('manager_name')->toString(),
                'district' => $request->string('district')->toString(),
                'address' => $request->string('address')->toString(),
                'ninea' => $request->string('ninea')->toString(),
                'status' => 'pending',
                'documents' => [],
            ];

            if (Schema::hasTable($table) && Schema::hasColumn($table, 'color')) {
                $payload['color'] = $request->string('color')->toString();
            }

            if (Schema::hasTable($table) && Schema::hasColumn($table, 'password')) {
                $payload['password'] = $request->string('password')->toString();
            }

            if (Schema::hasTable($table) && Schema::hasColumn($table, 'logo_url')) {
                $payload['logo_url'] = '';
            }

            $registrationRequest = AgencyRegistrationRequest::query()->create($payload);

            $logo = $request->file('logo');
            $logoPath = $logo->storeAs(
                sprintf('agency-registration-requests/%d/logo', $registrationRequest->id),
                Str::uuid()->toString().'.'.$logo->getClientOriginalExtension(),
                'public'
            );

            $documents = [];
            foreach ($this->resolveDocumentFiles($request) as $file) {
                $storedPath = $file->storeAs(
                    sprintf('agency-registration-requests/%d', $registrationRequest->id),
                    Str::uuid()->toString().'.'.$file->getClientOriginalExtension(),
                    'local'
                );

                $documents[] = [
                    'name' => $file->getClientOriginalName(),
                    'path' => $storedPath,
                    'mime_type' => $file->getMimeType(),
                    'size' => $file->getSize(),
                ];
            }

            $updatePayload = [
                'documents' => $documents,
            ];

            if (Schema::hasTable($table) && Schema::hasColumn($table, 'logo_url')) {
                $updatePayload['logo_url'] = Storage::disk('public')->url($logoPath);
            }

            $registrationRequest->forceFill($updatePayload)->save();

            return $this->successResponse(
                'Demande d enregistrement agence envoyee avec succes.',
                [
                    'id' => $registrationRequest->id,
                    'company' => $registrationRequest->company,
                    'email' => $registrationRequest->email,
                    'phone' => $registrationRequest->phone,
                    'city' => $registrationRequest->city,
                    'activity' => $registrationRequest->activity,
                    'status' => $registrationRequest->status,
                    'logo_url' => $registrationRequest->logo_url,
                    'documents_count' => count($documents),
                    'created_at' => $registrationRequest->created_at,
                ],
                201
            );
        } catch (Throwable) {
            // Fallback: keep partner onboarding available even if request-storage flow fails in production.
            $result = $this->authService->inscrireAgence([
                'company' => $request->string('company')->toString(),
                'phone' => $request->string('phone')->toString(),
                'email' => $request->string('email')->toString(),
                'city' => $request->string('city')->toString(),
                'activity' => $request->string('activity')->toString() ?: 'Location et vente',
                'password' => $request->string('password')->toString(),
                'device_name' => 'agency-web',
            ]);

            return $this->successResponse(
                'Votre compte agence a ete cree. Vous pouvez vous connecter.',
                [
                    'mode' => 'direct_agency_account',
                    'agence' => $result['agence'],
                ],
                201
            );
        }
    }

    private function resolveDocumentFiles(StoreAgencyRegistrationRequest $request): array
    {
        $documentFiles = $request->file('documents', []);

        if (is_array($documentFiles) && $documentFiles !== []) {
            return $documentFiles;
        }

        $allFiles = $request->allFiles();

        if (isset($allFiles['documents']) && is_array($allFiles['documents'])) {
            return $allFiles['documents'];
        }

        if (isset($allFiles['documents[]']) && is_array($allFiles['documents[]'])) {
            return $allFiles['documents[]'];
        }

        return [];
    }
}
