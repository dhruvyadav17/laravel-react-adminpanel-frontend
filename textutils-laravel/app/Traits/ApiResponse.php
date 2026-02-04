<?php

namespace App\Traits;

use Illuminate\Http\JsonResponse;

trait ApiResponse
{
    protected function success(
        string $message,
        mixed $data = null,
        array $meta = [],
        int $status = 200
    ): JsonResponse {
        return response()->json([
            'success' => true,
            'message' => $message,
            'data'    => $data,
            'meta'    => (object) $meta,
            'errors'  => null,
        ], $status);
    }

    protected function error(
        string $message,
        mixed $errors = null,
        int $status = 400
    ): JsonResponse {
        return response()->json([
            'success' => false,
            'message' => $message,
            'data'    => null,
            'meta'    => (object) [],
            'errors'  => $errors,
        ], $status);
    }
}
