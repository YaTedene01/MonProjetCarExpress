<?php

namespace App\Http\Controllers\Api\Client;

use App\Enums\UserRole;
use App\Http\Controllers\Controller;
use App\Models\Alert;
use App\Models\Conversation;
use App\Models\User;
use App\Models\Vehicle;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ConversationController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();

        $conversations = Conversation::query()
            ->where('client_id', $user->id)
            ->with(['messages.sender', 'vehicle', 'agency', 'client'])
            ->latest('last_message_at')
            ->get();

        return response()->json([
            'status' => true,
            'data' => $conversations,
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $user = $request->user();

        $data = $request->validate([
            'vehicle_id' => 'required|integer|exists:vehicles,id',
            'type' => 'required|string|in:location,achat',
            'subject' => 'required|string|max:255',
            'initial_message' => 'required|string|max:2000',
        ]);

        $vehicle = Vehicle::findOrFail($data['vehicle_id']);

        $conversation = Conversation::firstOrCreate(
            [
                'vehicle_id' => $vehicle->id,
                'client_id' => $user->id,
                'agency_id' => $vehicle->agency_id,
            ],
            [
                'subject' => $data['subject'],
                'type' => $data['type'],
                'last_message_at' => now(),
            ]
        );

        if ($conversation->wasRecentlyCreated || $conversation->messages()->count() === 0) {
            $conversation->messages()->create([
                'sender_id' => $user->id,
                'sender_role' => 'client',
                'content' => $data['initial_message'],
            ]);

            $conversation->update(['last_message_at' => now()]);

            $this->notifyAgency($conversation, $user);
        }

        $conversation->load(['messages.sender', 'vehicle', 'agency', 'client']);

        return response()->json([
            'status' => true,
            'data' => $conversation,
        ], 201);
    }

    public function sendMessage(Request $request, Conversation $conversation): JsonResponse
    {
        $user = $request->user();

        if ((int) $conversation->client_id !== (int) $user->id) {
            return response()->json(['status' => false, 'message' => 'Acces non autorise.'], 403);
        }

        $data = $request->validate([
            'content' => 'required|string|max:2000',
        ]);

        $message = $conversation->messages()->create([
            'sender_id' => $user->id,
            'sender_role' => 'client',
            'content' => $data['content'],
        ]);

        $conversation->update(['last_message_at' => now()]);

        $this->notifyAgency($conversation, $user);

        return response()->json([
            'status' => true,
            'data' => $message->load('sender'),
        ]);
    }

    private function notifyAgency(Conversation $conversation, User $user): void
    {
        $agencyUserIds = User::query()
            ->where('agency_id', $conversation->agency_id)
            ->where('role', UserRole::Agency->value)
            ->pluck('id');

        if ($agencyUserIds->isEmpty()) {
            return;
        }

        $now = now();
        $alerts = $agencyUserIds->map(fn (int $userId): array => [
            'user_id' => $userId,
            'title' => 'Nouveau message client',
            'message' => sprintf('%s vous a envoye un message : %s.', $user->name, $conversation->subject),
            'context' => json_encode([
                'type' => 'new_message',
                'conversation_id' => $conversation->id,
                'sender_id' => $user->id,
            ]),
            'is_read' => false,
            'created_at' => $now,
            'updated_at' => $now,
        ])->all();

        Alert::query()->insert($alerts);
    }
}
