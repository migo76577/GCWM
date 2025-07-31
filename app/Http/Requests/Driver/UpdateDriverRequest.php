<?php

namespace App\Http\Requests\Driver;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateDriverRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return auth()->user()->role === 'admin';
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $driverId = $this->route('driver')->id;
        
        return [
            'employee_number' => [
                'required',
                'string',
                Rule::unique('drivers', 'employee_number')->ignore($driverId)
            ],
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'phone' => 'required|string|max:20',
            'license_number' => 'required|string|max:50',
            'license_expiry' => 'required|date',
            'hire_date' => 'required|date',
            'address' => 'nullable|string',
            'status' => 'required|in:active,inactive,suspended',
        ];
    }
}
