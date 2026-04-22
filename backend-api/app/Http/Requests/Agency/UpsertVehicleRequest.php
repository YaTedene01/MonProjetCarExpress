<?php

namespace App\Http\Requests\Agency;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpsertVehicleRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'listing_type' => ['required', 'string', 'in:rental,sale'],
            'name' => ['required', 'string', 'max:255'],
            'brand' => ['required', 'string', 'max:100'],
            'model' => ['required', 'string', 'max:100'],
            'year' => ['required', 'integer', 'min:1990', 'max:2100'],
            'category' => ['required', 'string', 'max:100'],
            'class_name' => ['nullable', 'string', 'max:100'],
            'price' => ['required', 'numeric', 'min:0'],
            'price_unit' => ['nullable', 'string', Rule::in(['day', 'fixed'])],
            'service_fee' => ['nullable', 'numeric', 'min:0'],
            'city' => ['required', 'string', 'max:100'],
            'status' => ['required', 'string', 'in:pending,available,rented,for_sale,maintenance,sold,draft'],
            'is_featured' => ['nullable', 'boolean'],
            'summary' => ['nullable', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'seats' => ['nullable', 'integer', 'min:1'],
            'doors' => ['nullable', 'integer', 'min:1'],
            'transmission' => ['nullable', 'string', 'max:50'],
            'fuel_type' => ['nullable', 'string', 'max:50'],
            'mileage' => ['nullable', 'integer', 'min:0'],
            'engine' => ['nullable', 'string', 'max:100'],
            'consumption' => ['nullable', 'string', 'max:50'],
            'horsepower' => ['nullable', 'string', 'max:50'],
            'location_label' => ['nullable', 'string', 'max:255'],
            'gallery' => ['nullable', 'array'],
            'gallery.*' => ['string', 'max:255'],
            'gallery_files' => ['nullable', 'array', 'max:4'],
            'gallery_files.*' => ['file', 'image', 'mimes:jpg,jpeg,png,webp', 'max:5120'],
            'specifications' => ['nullable', 'array'],
            'equipment' => ['nullable', 'array'],
            'equipment.*' => ['string', 'max:100'],
            'tags' => ['nullable', 'array'],
            'tags.*' => ['string', 'max:100'],
        ];
    }
}
