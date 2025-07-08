<?php

namespace App\Http\Requests\Plan;

use Illuminate\Foundation\Http\FormRequest;

namespace App\Http\Requests\Plan;

use Illuminate\Foundation\Http\FormRequest;

class StorePlanRequest extends FormRequest
{
    public function authorize()
    {
        return auth()->user()->role === 'admin';
    }

    public function rules()
    {
        return [
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:50|unique:plans,code',
            'description' => 'required|string',
            'monthly_price' => 'required|numeric|min:0',
            'collections_per_week' => 'required|integer|min:1|max:7',
            'features' => 'nullable|array',
            'max_bins' => 'required|integer|min:1',
            'terms_conditions' => 'nullable|string',
        ];
    }
}

