<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Expense\StoreExpenseRequest;
use App\Models\Expense;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ExpenseController extends Controller
{
    public function index(Request $request)
    {
        $expenses = Expense::with(['vehicle', 'driver', 'route', 'submittedBy', 'approvedBy'])
            ->when($request->expense_category, fn($q) => $q->where('expense_category', $request->expense_category))
            ->when($request->approval_status, fn($q) => $q->where('approval_status', $request->approval_status))
            ->when($request->budget_year, fn($q) => $q->where('budget_year', $request->budget_year))
            ->orderBy('expense_date', 'desc')
            ->paginate(20);

        return response()->json($expenses);
    }

    public function store(StoreExpenseRequest $request)
    {
        // Upload receipts
        $receiptPaths = [];
        if ($request->hasFile('receipts')) {
            foreach ($request->file('receipts') as $receipt) {
                $path = $receipt->store('expenses/receipts', 'public');
                $receiptPaths[] = Storage::url($path);
            }
        }

        $expense = Expense::create([
            'expense_number' => 'EXP-' . now()->format('YmdHis'),
            'expense_category' => $request->expense_category,
            'title' => $request->title,
            'description' => $request->description,
            'amount' => $request->amount,
            'expense_date' => $request->expense_date,
            'vendor_supplier' => $request->vendor_supplier,
            'invoice_reference' => $request->invoice_reference,
            'vehicle_id' => $request->vehicle_id,
            'driver_id' => $request->driver_id,
            'route_id' => $request->route_id,
            'payment_method' => $request->payment_method,
            'payment_reference' => $request->payment_reference,
            'payment_due_date' => $request->payment_due_date,
            'budget_category' => $request->budget_category,
            'budget_year' => $request->budget_year ?? now()->year,
            'is_recurring' => $request->is_recurring ?? false,
            'recurring_frequency' => $request->recurring_frequency,
            'is_reimbursable' => $request->is_reimbursable ?? false,
            'receipts' => $receiptPaths,
            'notes' => $request->notes,
            'submitted_by' => $request->user()->id,
            'submitted_at' => now(),
            'approval_status' => 'pending_approval',
        ]);

        return response()->json($expense->load(['vehicle', 'driver', 'route', 'submittedBy']), 201);
    }

    public function show(Expense $expense)
    {
        return response()->json($expense->load(['vehicle', 'driver', 'route', 'submittedBy', 'approvedBy', 'approvals.user']));
    }

    public function approve(Request $request, Expense $expense)
    {
        $request->validate([
            'action' => 'required|in:approved,rejected',
            'notes' => 'nullable|string',
        ]);

        $expense->update([
            'approval_status' => $request->action,
            'approved_by' => $request->user()->id,
            'approved_at' => now(),
            'approval_notes' => $request->notes,
        ]);

        // Create approval record
        $expense->approvals()->create([
            'user_id' => $request->user()->id,
            'action' => $request->action,
            'comments' => $request->notes,
            'action_date' => now(),
        ]);

        return response()->json($expense->fresh(['vehicle', 'driver', 'route', 'submittedBy', 'approvedBy']));
    }
}