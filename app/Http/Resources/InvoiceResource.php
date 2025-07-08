<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class InvoiceResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'invoice_number' => $this->invoice_number,
            'invoice_type' => $this->invoice_type,
            'invoice_date' => $this->invoice_date,
            'due_date' => $this->due_date,
            'amount' => $this->amount,
            'tax_amount' => $this->tax_amount,
            'total_amount' => $this->total_amount,
            'status' => $this->status,
            'description' => $this->description,
            'notes' => $this->notes,
            'is_overdue' => $this->due_date < now() && $this->status === 'pending',
            'days_overdue' => $this->when(
                $this->due_date < now() && $this->status === 'pending',
                fn() => now()->diffInDays($this->due_date)
            ),
            'created_at' => $this->created_at,
            'customer' => new CustomerResource($this->whenLoaded('customer')),
            'customer_plan' => new CustomerPlanResource($this->whenLoaded('customerPlan')),
            'payments' => PaymentResource::collection($this->whenLoaded('payments')),
            'payments_total' => $this->when(
                $this->relationLoaded('payments'),
                fn() => $this->payments->where('status', 'completed')->sum('amount')
            ),
        ];
    }
}