<?php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;

class LoginRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        $identifier = trim((string) $this->input('identifier', ''));

        $this->merge([
            'identifier' => filter_var($identifier, FILTER_VALIDATE_EMAIL) ? mb_strtolower($identifier) : $identifier,
            'device_name' => trim((string) $this->input('device_name', '')),
        ]);
    }

    public function rules(): array
    {
        return [
            'identifier' => ['required', 'string', 'max:255'],
            'password' => ['required', 'string'],
            'device_name' => ['nullable', 'string', 'max:255'],
        ];
    }
}
