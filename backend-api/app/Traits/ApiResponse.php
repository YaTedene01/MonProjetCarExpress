<?php

namespace App\Traits;

use Illuminate\Http\JsonResponse;

trait ApiResponse
{
    protected function successResponse(
        string $message,
        mixed $data = null,
        int $status = 200
    ): JsonResponse {
        $payload = [
            'status' => true,
            'message' => $message,
        ];

        if ($status !== 204) {
            $payload['data'] = $data;
        }

        return response()->json($payload, $status);
    }

    protected function errorResponse(
        string $message,
        int $status = 400,
        array $errors = []
    ): JsonResponse {
        $payload = [
            'status' => false,
            'message' => $message,
        ];

        if ($errors !== []) {
            $payload['errors'] = $errors;
        }

        return response()->json($payload, $status);
    }
}
