<?php

namespace App\Http\Requests\Vehicle;

use Illuminate\Foundation\Http\FormRequest;

class StoreVehicleRequest extends FormRequest
{
    public function authorize()
    {
        return auth()->user()->role === 'admin';
    }

    public function rules()
    {
        return [
            'vehicle_number' => 'required|string|unique:vehicles,vehicle_number',
            'license_plate' => 'required|string|unique:vehicles,license_plate',
            'make' => 'required|string|max:255',
            'model' => 'required|string|max:255',
            'year' => 'nullable|integer|min:1900|max:' . (date('Y') + 1),
            'vehicle_type' => 'required|in:truck,van,pickup',
            'capacity_kg' => 'nullable|numeric|min:0',
            'status' => 'required|in:active,maintenance,inactive',
            'notes' => 'nullable|string',
        ];
    }
}