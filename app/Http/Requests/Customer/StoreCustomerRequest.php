<?php

// =============================================================================
// FORM REQUEST CLASSES FOR VALIDATION
// =============================================================================

// app/Http/Requests/Customer/StoreCustomerRequest.php
namespace App\Http\Requests\Customer;

use Illuminate\Foundation\Http\FormRequest;

class StoreCustomerRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'customer_number' => 'nullable|string|max:255|unique:customers,customer_number',
            'category_id' => 'required|exists:customer_categories,id',
            'route_id' => 'required|exists:routes,id',
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'phone' => 'required|string|max:20',
            'alternative_phone' => 'nullable|string|max:20',
            'address' => 'required|string',
            'city' => 'required|string|max:255',
            'area' => 'required|string|max:255',
            'latitude' => 'required|numeric|between:-90,90',
            'longitude' => 'required|numeric|between:-180,180',
            'notes' => 'nullable|string|max:1000',
        ];
    }
}