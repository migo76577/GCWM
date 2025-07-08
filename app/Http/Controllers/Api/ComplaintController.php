<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Complaint\StoreComplaintRequest;
use App\Models\Complaint;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ComplaintController extends Controller
{
    public function index(Request $request)
    {
        $complaints = Complaint::with(['customer.user', 'assignedTo'])
            ->when($request->user()->role === 'customer', fn($q) => $q->where('customer_id', $request->user()->customer->id))
            ->when($request->status, fn($q) => $q->where('status', $request->status))
            ->when($request->priority, fn($q) => $q->where('priority', $request->priority))
            ->when($request->complaint_type, fn($q) => $q->where('complaint_type', $request->complaint_type))
            ->orderBy('submitted_at', 'desc')
            ->paginate(20);

        return response()->json($complaints);
    }

    public function store(StoreComplaintRequest $request)
    {
        $customer = $request->user()->customer;

        // Upload attachments
        $attachmentPaths = [];
        if ($request->hasFile('attachments')) {
            foreach ($request->file('attachments') as $file) {
                $path = $file->store('complaints', 'public');
                $attachmentPaths[] = Storage::url($path);
            }
        }

        $complaint = Complaint::create([
            'complaint_number' => 'CMP-' . now()->format('YmdHis'),
            'customer_id' => $customer->id,
            'complaint_type' => $request->complaint_type,
            'subject' => $request->subject,
            'description' => $request->description,
            'priority' => $request->priority ?? 'medium',
            'attachments' => $attachmentPaths,
            'latitude' => $request->latitude,
            'longitude' => $request->longitude,
        ]);

        return response()->json($complaint, 201);
    }

    public function show(Complaint $complaint)
    {
        $this->authorize('view', $complaint);
        return response()->json($complaint->load(['customer.user', 'assignedTo']));
    }

    public function update(Request $request, Complaint $complaint)
    {
        $this->authorize('update', $complaint);

        $validated = $request->validate([
            'status' => 'sometimes|in:open,in_progress,resolved,closed',
            'assigned_to' => 'sometimes|exists:users,id',
            'admin_response' => 'sometimes|string',
            'resolution_notes' => 'sometimes|string',
        ]);

        if (isset($validated['status']) && $validated['status'] === 'resolved') {
            $validated['resolved_at'] = now();
        }

        $complaint->update($validated);

        return response()->json($complaint->fresh(['customer.user', 'assignedTo']));
    }
}