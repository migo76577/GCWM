<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Customer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function register(StoreCustomerRequest $request)
    {
        // Create user account
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => 'customer',
            'status' => 'active',
        ]);

        // Create customer profile
        $customer = Customer::create([
            'user_id' => $user->id,
            'customer_number' => 'CUST-' . str_pad($user->id, 6, '0', STR_PAD_LEFT),
            'first_name' => $request->first_name,
            'last_name' => $request->last_name,
            'phone' => $request->phone,
            'alternative_phone' => $request->alternative_phone,
            'address' => $request->address,
            'city' => $request->city,
            'area' => $request->area,
            'latitude' => $request->latitude,
            'longitude' => $request->longitude,
            'registration_fee' => SystemSetting::get('registration_fee', 500),
            'registration_status' => 'pending',
        ]);

        // Generate registration invoice
        $invoice = $customer->invoices()->create([
            'invoice_number' => 'INV-REG-' . now()->format('YmdHis'),
            'invoice_type' => 'registration',
            'invoice_date' => now(),
            'due_date' => now()->addDays(7),
            'amount' => $customer->registration_fee,
            'tax_amount' => 0,
            'total_amount' => $customer->registration_fee,
            'description' => 'Registration Fee',
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'user' => $user->load('customer'),
            'token' => $token,
            'registration_invoice' => $invoice,
        ], 201);
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        if (!Auth::attempt($request->only('email', 'password'))) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        $user = Auth::user();
        $user->update(['last_login_at' => now()]);
        
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'user' => $user->load(['customer', 'driver']),
            'token' => $token,
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Logged out successfully']);
    }

    public function me(Request $request)
    {
        return response()->json($request->user()->load(['customer', 'driver']));
    }
}