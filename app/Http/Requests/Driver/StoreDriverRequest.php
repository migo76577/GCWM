<?php

namespace App\Http\Requests\Driver;

use Illuminate\Foundation\Http\FormRequest;
namespace App\Http\Requests\Driver;

use Illuminate\Foundation\Http\FormRequest;

class StoreDriverRequest extends FormRequest
{
    public function authorize()
    {
        return auth()->user()->role === 'admin';
    }

    public function rules()
    {
        return [
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8|confirmed',
            'employee_number' => 'required|string|unique:drivers,employee_number',
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'phone' => 'required|string|max:20',
            'license_number' => 'required|string|max:50',
            'license_expiry' => 'required|date|after:today',
            'hire_date' => 'required|date',
            'address' => 'nullable|string',
        ];
    }
}