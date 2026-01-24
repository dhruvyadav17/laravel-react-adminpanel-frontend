<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class ImpersonationController extends Controller
{
    /**
     * Start impersonation
     */
    public function impersonate(int $user)
    {
        try {
            $admin = auth()->user();

            if (!$admin) {
                return response()->json([
                    'message' => 'Unauthenticated'
                ], 401);
            }

            // 🔒 Only admin / super-admin
            if (!$admin->hasAnyRole(['admin', 'super-admin'])) {
                return response()->json([
                    'message' => 'Unauthorized'
                ], 403);
            }

            $target = User::where('id', $user)
                ->whereNull('deleted_at')
                ->first();

            if (!$target) {
                return response()->json([
                    'message' => 'User not found'
                ], 404);
            }

            if ($target->hasRole('super-admin')) {
                return response()->json([
                    'message' => 'Cannot impersonate super admin'
                ], 403);
            }

            // 🔥 Create impersonation token
            $token = $target
                ->createToken('impersonation')
                ->plainTextToken;

            return response()->json([
                'success' => true,
                'data' => [
                    'token' => $token,
                ],
            ]);
        } catch (\Throwable $e) {
            Log::error('Impersonation error', [
                'message' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
            ]);

            return response()->json([
                'message' => 'Impersonation failed'
            ], 500);
        }
    }
}
