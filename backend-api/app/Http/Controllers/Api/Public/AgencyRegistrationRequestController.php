<?php

namespace App\Http\Controllers\Api\Public;

use App\Http\Controllers\Controller;
use App\Http\Requests\Public\StoreAgencyRegistrationRequest;
use App\Http\Resources\AgencyRegistrationRequestResource;
use App\Models\AgencyRegistrationRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class AgencyRegistrationRequestController extends Controller
{
    public function store(StoreAgencyRegistrationRequest $request): JsonResponse
    {
        $registrationRequest = AgencyRegistrationRequest::query()->create([
            'company' => $request->string('company')->toString(),
            'email' => $request->string('email')->toString(),
            'phone' => $request->string('phone')->toString(),
            'city' => $request->string('city')->toString(),
            'activity' => $request->string('activity')->toString() ?: 'Location et vente',
            'manager_name' => $request->string('manager_name')->toString(),
            'district' => $request->string('district')->toString(),
            'address' => $request->string('address')->toString(),
            'ninea' => $request->string('ninea')->toString(),
            'color' => $request->string('color')->toString(),
            'password' => $request->string('password')->toString(),
            'status' => 'pending',
            'logo_url' => '',
            'documents' => [],
        ]);

        $logo = $request->file('logo');

        $logoPath = $logo->storeAs(
            sprintf('agency-registration-requests/%d/logo', $registrationRequest->id),
            Str::uuid()->toString().'.'.$logo->getClientOriginalExtension(),
            'public'
        );

        $documents = [];

        foreach ($request->file('documents', []) as $file) {
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

        $registrationRequest->forceFill([
            'logo_url' => Storage::disk('public')->url($logoPath),
            'documents' => $documents,
        ])->save();

        return $this->successResponse(
            'Demande d enregistrement agence envoyee avec succes.',
            new AgencyRegistrationRequestResource($registrationRequest),
            201
        );
    }
}
