<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class ExpenseResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'expense_number' => $this->expense_number,
            'expense_category' => $this->expense_category,
            'title' => $this->title,
            'description' => $this->description,
            'amount' => $this->amount,
            'expense_date' => $this->expense_date,
            'vendor_supplier' => $this->vendor_supplier,
            'invoice_reference' => $this->invoice_reference,
            'payment_method' => $this->payment_method,
            'payment_reference' => $this->payment_reference,
            'payment_status' => $this->payment_status,
            'payment_due_date' => $this->payment_due_date,
            'paid_at' => $this->paid_at,
            'approval_status' => $this->approval_status,
            'submitted_at' => $this->submitted_at,
            'approved_at' => $this->approved_at,
            'approval_notes' => $this->approval_notes,
            'rejection_reason' => $this->rejection_reason,
            'receipts' => $this->receipts,
            'supporting_documents' => $this->supporting_documents,
            'budget_category' => $this->budget_category,
            'budget_year' => $this->budget_year,
            'budget_quarter' => $this->budget_quarter,
            'is_recurring' => $this->is_recurring,
            'recurring_frequency' => $this->recurring_frequency,
            'next_due_date' => $this->next_due_date,
            'is_reimbursable' => $this->is_reimbursable,
            'notes' => $this->notes,
            'created_at' => $this->created_at,
            'vehicle' => new VehicleResource($this->whenLoaded('vehicle')),
            'driver' => new DriverResource($this->whenLoaded('driver')),
            'route' => new RouteResource($this->whenLoaded('route')),
            'submitted_by' => new UserResource($this->whenLoaded('submittedBy')),
            'approved_by' => new UserResource($this->whenLoaded('approvedBy')),
        ];
    }
}
