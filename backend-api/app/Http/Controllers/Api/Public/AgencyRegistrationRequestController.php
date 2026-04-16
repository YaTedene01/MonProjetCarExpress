<?php

namespace App\Http\Controllers\Api\Public;

use App\Http\Controllers\Controller;
use App\Http\Requests\Public\StoreAgencyRegistrationRequest;
use App\Models\AgencyRegistrationRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Throwable;

class AgencyRegistrationRequestController extends Controller
{
    public function store(StoreAgencyRegistrationRequest $request): JsonResponse
    {
        try {
            $table = 'agency_registration_requests';
            if (! Schema::hasTable($table)) {
                return $this->errorResponse(
                    'Le module de demandes agence n est pas encore disponible. Veuillez contacter l administration.',
                    503
                );
            }

            $columns = array_flip(Schema::getColumnListing($table));
            $payload = [];
            $set = static function (string $key, mixed $value) use (&$payload, $columns): void {
                if (isset($columns[$key])) {
                    $payload[$key] = $value;
                }
            };

            $set('company', $request->string('company')->toString());
            $set('email', $request->string('email')->toString());
            $set('phone', $request->string('phone')->toString());
            $set('city', $request->string('city')->toString());
            $set('activity', $request->string('activity')->toString() ?: 'Location et vente');
            $set('manager_name', $request->string('manager_name')->toString());
            $set('district', $request->string('district')->toString());
            $set('address', $request->string('address')->toString());
            $set('ninea', $request->string('ninea')->toString());
            $set('status', 'pending');
            // Query Builder does not apply model casts during insert.
            // Encode JSON payload explicitly for PostgreSQL JSON/JSONB columns.
            $set('documents', json_encode([], JSON_UNESCAPED_UNICODE));
            $set('color', $request->string('color')->toString());
            $set('password', $request->string('password')->toString());
            $set('logo_url', '');

            if (isset($columns['created_at'])) {
                $payload['created_at'] = now();
            }
            if (isset($columns['updated_at'])) {
                $payload['updated_at'] = now();
            }

            if (! isset($columns['company'], $columns['email'], $columns['phone'], $columns['city'])) {
                return $this->errorResponse(
                    'Schema base de donnees incompatible pour les demandes agence. Veuillez lancer les migrations.',
                    500
                );
            }

            $requestId = DB::table($table)->insertGetId($payload);
            $registrationRequest = AgencyRegistrationRequest::query()->findOrFail($requestId);

            $documents = [];
            $logoUrl = null;

            try {
                $logo = $request->file('logo');
                $logoPath = $logo->storeAs(
                    sprintf('agency-registration-requests/%d/logo', $registrationRequest->id),
                    Str::uuid()->toString().'.'.$logo->getClientOriginalExtension(),
                    'public'
                );
                $logoUrl = Storage::disk('public')->url($logoPath);

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
            } catch (Throwable) {
                // Keep request as pending even if files cannot be persisted.
            }

            $updatePayload = [];
            if (isset($columns['documents'])) {
                $updatePayload['documents'] = $documents;
            }
            if ($logoUrl !== null && isset($columns['logo_url'])) {
                $updatePayload['logo_url'] = $logoUrl;
            }
            if ($updatePayload !== []) {
                $registrationRequest->forceFill($updatePayload)->save();
            }

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
            return $this->errorResponse(
                'Impossible d envoyer la demande agence pour le moment. Veuillez reessayer.',
                422
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
