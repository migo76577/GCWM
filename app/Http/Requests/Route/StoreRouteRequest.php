<?php

namespace App\Http\Requests\Route;

use Illuminate\Foundation\Http\FormRequest;

namespace App\Http\Requests\Route;

use Illuminate\Foundation\Http\FormRequest;

class StoreRouteRequest extends FormRequest
{
    public function authorize()
    {
        return auth()->user()->role === 'admin';
    }

    public function rules()
    {
        return [
            'route_code' => 'required|string|unique:routes,route_code',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'areas_covered' => 'required|array|min:1',
            'areas_covered.*' => 'string|max:255',
            'collection_days' => 'required|array|min:1',
            'collection_days.*' => 'in:monday,tuesday,wednesday,thursday,friday,saturday,sunday',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i|after:start_time',
            'max_customers' => 'required|integer|min:1',
        ];
    }
}