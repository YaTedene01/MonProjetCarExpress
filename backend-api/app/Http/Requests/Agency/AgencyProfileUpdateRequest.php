<?php

namespace App\Http\Requests\Agency;

use Illuminate\Foundation\Http\FormRequest;

class AgencyProfileUpdateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['sometimes', 'string', 'max:255'],
            'activity' => ['sometimes', 'string', 'max:100'],
            'city' => ['sometimes', 'string', 'max:100'],
            'district' => ['nullable', 'string', 'max:100'],
            'address' => ['nullable', 'string', 'max:255'],
            'contact_first_name' => ['nullable', 'string', 'max:100'],
            'contact_last_name' => ['nullable', 'string', 'max:100'],
            'contact_phone' => ['sometimes', 'string', 'max:30'],
            'contact_email' => ['nullable', 'email', 'max:255'],
            'ninea' => ['nullable', 'string', 'max:100'],
            'color' => ['nullable', 'string', 'max:20'],
            'logo_url' => ['nullable', 'string', 'max:255'],
        ];
    }
}
