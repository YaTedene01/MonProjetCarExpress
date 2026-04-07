<?php

namespace App\Http\Requests\Client;

use Illuminate\Foundation\Http\FormRequest;

class StorePurchaseRequestRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'vehicle_id' => ['required', 'integer', 'exists:vehicles,id'],
            'payment_method' => ['required', 'string', 'in:card,mobile_money,cash'],
            'client_name' => ['required', 'string', 'max:255'],
            'client_phone' => ['required', 'string', 'max:30'],
            'client_email' => ['nullable', 'email', 'max:255'],
            'preferred_location' => ['nullable', 'string', 'max:255'],
            'notes' => ['nullable', 'string'],
            'accepted_terms' => ['required', 'accepted'],
            'accepted_non_refundable' => ['required', 'accepted'],
        ];
    }
}
