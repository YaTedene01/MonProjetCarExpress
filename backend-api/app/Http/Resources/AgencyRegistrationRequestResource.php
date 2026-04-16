<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AgencyRegistrationRequestResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'company' => $this->company,
            'email' => $this->email,
            'phone' => $this->phone,
            'city' => $this->city,
            'activity' => $this->activity,
            'manager_name' => $this->manager_name,
            'district' => $this->district,
            'address' => $this->address,
            'ninea' => $this->ninea,
            'color' => $this->color,
            'logo_url' => $this->resolveLogoUrl($request),
            'status' => $this->status,
            'is_read' => $this->read_at !== null,
            'documents' => collect($this->documents ?? [])->map(function (array $document, int $index) use ($request): array {
                return [
                    'id' => $index,
                    'name' => $document['name'] ?? 'document',
                    'mime_type' => $document['mime_type'] ?? 'application/octet-stream',
                    'size' => $document['size'] ?? 0,
                    'download_url' => $request->getSchemeAndHttpHost().route('agency-registration-requests.documents.download', [
                        'agencyRegistrationRequest' => $this->id,
                        'documentIndex' => $index,
                    ], absolute: false),
                ];
            })->values(),
            'created_at' => $this->created_at,
            'read_at' => $this->read_at,
            'reviewed_at' => $this->reviewed_at,
        ];
    }

    private function resolveLogoUrl(Request $request): ?string
    {
        if (trim((string) $this->logo_url) === '') {
            return null;
        }

        return $request->getSchemeAndHttpHost().route('agency-registration-requests.logo', [
            'agencyRegistrationRequest' => $this->id,
        ], absolute: false);
    }
}
