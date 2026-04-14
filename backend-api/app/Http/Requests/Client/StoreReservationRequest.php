<?php

namespace App\Http\Requests\Client;

use App\Enums\PaymentMethod;
use Illuminate\Foundation\Http\FormRequest;

class StoreReservationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'vehicle_id' => ['required', 'integer', 'exists:vehicles,id'],
            'pickup_location' => ['required', 'string', 'max:255'],
            'pickup_date' => ['required', 'date', 'after_or_equal:today'],
            'pickup_time' => ['required', 'date_format:H:i'],
            'return_date' => ['required', 'date', 'after:pickup_date'],
            'return_time' => ['required', 'date_format:H:i'],
            'payment_method' => ['required', 'string', 'in:'.implode(',', PaymentMethod::values())],
            'client_name' => ['required', 'string', 'max:255'],
            'client_phone' => ['required', 'string', 'max:30'],
            'identity_number' => ['required', 'string', 'max:100'],
            'driver_license_number' => ['required', 'string', 'max:100'],
            'accepted_terms' => ['required', 'accepted'],
            'accepted_agency_terms' => ['required', 'accepted'],
            'notes' => ['nullable', 'string'],
        ];
    }
}
