<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AgencyRegistrationRequestResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $requestId = $this->id;
        $documents = collect($this->documents ?? [])->map(static function (array $document, int $index) use ($requestId): array {
            $mimeType = (string) ($document['mime_type'] ?? 'application/octet-stream');
            $name = (string) ($document['name'] ?? 'document');
            $extension = pathinfo($name, PATHINFO_EXTENSION);
            $isPreviewable = str_starts_with($mimeType, 'image/') || $mimeType === 'application/pdf';

            return [
                'id' => $index,
                'name' => $name,
                'mime_type' => $mimeType,
                'size' => $document['size'] ?? 0,
                'extension' => $extension !== '' ? strtolower($extension) : null,
                'is_previewable' => $isPreviewable,
                'download_url' => "/administration/messages-demandes-agence/{$requestId}/documents/{$index}/telecharger",
                'preview_url' => "/administration/messages-demandes-agence/{$requestId}/documents/{$index}/telecharger",
            ];
        })->values()->all();
        $logoUrl = $this->resolveLogoUrl();

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
            'logo_url' => $logoUrl,
            'logo_download_url' => $logoUrl,
            'status' => $this->status,
            'is_read' => $this->read_at !== null,
            'documents_count' => count($documents),
            'documents' => $documents,
            'created_at' => $this->created_at,
            'read_at' => $this->read_at,
            'reviewed_at' => $this->reviewed_at,
        ];
    }

    private function resolveLogoUrl(): ?string
    {
        if (trim((string) $this->logo_url) === '') {
            return null;
        }

        return "/administration/messages-demandes-agence/{$this->id}/logo";
    }
}
