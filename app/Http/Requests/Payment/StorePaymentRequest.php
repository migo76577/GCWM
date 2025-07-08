<?php

namespace App\Http\Requests\Payment;

use Illuminate\Foundation\Http\FormRequest;

namespace App\Http\Requests\Payment;

use Illuminate\Foundation\Http\FormRequest;

class StorePaymentRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'invoice_id' => 'required|exists:invoices,id',
            'amount' => 'required|numeric|min:0.01',
            'payment_method' => 'required|in:mpesa,bank_transfer,cash,card,airtel_money',
            'transaction_reference' => 'nullable|string|max:255',
            'payment_details' => 'nullable|array',
        ];
    }
}