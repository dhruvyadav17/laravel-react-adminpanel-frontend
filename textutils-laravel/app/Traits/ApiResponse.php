<?php

namespace App\Traits;

use Illuminate\Http\JsonResponse;

trait ApiResponse
{
    protected function success(
        string $message,
        $data = null,
        int $code = 200,
        array $meta = []
    ): JsonResponse {
        return response()->json([
            'success' => true,
            'code'    => $code,
            'message' => $message,
            'data'    => $data,
            'meta'    => (object) $meta,
        ], $code);
    }

    protected function error(
        string $message,
        $errors = null,
        int $code = 400
    ): JsonResponse {
        return response()->json([
            'success' => false,
            'code'    => $code,
            'message' => $message,
            'errors'  => $errors,
        ], $code);
    }
}
