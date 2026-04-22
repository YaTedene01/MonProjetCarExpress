<?php

namespace App\Http\Controllers\Api\Agency;

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
            ->where('agency_id', $user->agency_id)
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
            'client_id' => 'required|integer|exists:users,id',
            'type' => 'required|string|in:location,achat',
            'subject' => 'required|string|max:255',
            'initial_message' => 'nullable|string|max:2000',
        ]);

        $vehicle = Vehicle::query()->findOrFail($data['vehicle_id']);
        $client = User::query()
            ->whereKey($data['client_id'])
            ->where('role', UserRole::Client->value)
            ->firstOrFail();

        if ((int) $vehicle->agency_id !== (int) $user->agency_id) {
            return response()->json(['status' => false, 'message' => 'Vehicule non autorise pour cette agence.'], 403);
        }

        $conversation = Conversation::firstOrCreate(
            [
                'vehicle_id' => $vehicle->id,
                'client_id' => $client->id,
                'agency_id' => $user->agency_id,
            ],
            [
                'subject' => $data['subject'],
                'type' => $data['type'],
                'last_message_at' => now(),
            ]
        );

        $initialMessage = trim((string) ($data['initial_message'] ?? ''));

        if ($initialMessage !== '' && ($conversation->wasRecentlyCreated || $conversation->messages()->count() === 0)) {
            $conversation->messages()->create([
                'sender_id' => $user->id,
                'sender_role' => 'agency',
                'content' => $initialMessage,
            ]);

            $conversation->update(['last_message_at' => now()]);

            Alert::query()->create([
                'user_id' => $conversation->client_id,
                'title' => 'Nouveau message de l\'agence',
                'message' => sprintf('L\'agence vous a contacte a propos de : %s.', $conversation->subject),
                'context' => [
                    'type' => 'new_message',
                    'conversation_id' => $conversation->id,
                    'sender_id' => $user->id,
                ],
                'is_read' => false,
            ]);
        }

        $conversation->load(['messages.sender', 'vehicle', 'agency', 'client']);

        return response()->json([
            'status' => true,
            'data' => $conversation,
        ], $conversation->wasRecentlyCreated ? 201 : 200);
    }

    public function sendMessage(Request $request, Conversation $conversation): JsonResponse
    {
        $user = $request->user();

        if ((int) $conversation->agency_id !== (int) $user->agency_id) {
            return response()->json(['status' => false, 'message' => 'Acces non autorise.'], 403);
        }

        $data = $request->validate([
            'content' => 'required|string|max:2000',
        ]);

        $message = $conversation->messages()->create([
            'sender_id' => $user->id,
            'sender_role' => 'agency',
            'content' => $data['content'],
        ]);

        $conversation->update(['last_message_at' => now()]);

        Alert::query()->create([
            'user_id' => $conversation->client_id,
            'title' => 'Reponse de l\'agence',
            'message' => sprintf('L\'agence a repondu a votre message : %s.', $conversation->subject),
            'context' => json_encode([
                'type' => 'new_message',
                'conversation_id' => $conversation->id,
                'sender_id' => $user->id,
            ]),
            'is_read' => false,
        ]);

        return response()->json([
            'status' => true,
            'data' => $message->load('sender'),
        ]);
    }
}
