<?php

namespace App\Http\Requests\Expense;

use Illuminate\Foundation\Http\FormRequest;

namespace App\Http\Requests\Expense;

use Illuminate\Foundation\Http\FormRequest;

class StoreExpenseRequest extends FormRequest
{
    public function authorize()
    {
        return auth()->user()->role === 'admin';
    }

    public function rules()
    {
        return [
            'expense_category' => 'required|in:fuel,vehicle_maintenance,driver_wages,equipment_purchase,office_supplies,insurance,licenses_permits,utilities,marketing,repairs,training,other',
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'amount' => 'required|numeric|min:0.01',
            'expense_date' => 'required|date',
            'vendor_supplier' => 'nullable|string|max:255',
            'invoice_reference' => 'nullable|string|max:255',
            'vehicle_id' => 'nullable|exists:vehicles,id',
            'driver_id' => 'nullable|exists:drivers,id',
            'route_id' => 'nullable|exists:routes,id',
            'payment_method' => 'required|in:cash,bank_transfer,mpesa,cheque,card,petty_cash',
            'payment_reference' => 'nullable|string|max:255',
            'payment_due_date' => 'nullable|date|after_or_equal:expense_date',
            'budget_category' => 'nullable|string|max:255',
            'is_recurring' => 'boolean',
            'recurring_frequency' => 'nullable|in:weekly,monthly,quarterly,annually',
            'is_reimbursable' => 'boolean',
            'receipts' => 'nullable|array',
            'receipts.*' => 'file|mimes:jpeg,png,jpg,pdf|max:5120',
            'notes' => 'nullable|string',
        ];
    }
}