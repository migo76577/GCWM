<?php

namespace App\Http\Requests\Collection;

use Illuminate\Foundation\Http\FormRequest;

namespace App\Http\Requests\Collection;

use Illuminate\Foundation\Http\FormRequest;

class StoreCollectionRequest extends FormRequest
{
    public function authorize()
    {
        return auth()->user()->role === 'driver';
    }

    public function rules()
    {
        return [
            'customer_id' => 'required|exists:customers,id',
            'photos' => 'required|array|min:1',
            'photos.*' => 'image|mimes:jpeg,png,jpg|max:2048',
            'notes' => 'nullable|string',
            'latitude' => 'nullable|numeric|between:-90,90',
            'longitude' => 'nullable|numeric|between:-180,180',
            'status' => 'required|in:completed,missed,partial',
        ];
    }
}