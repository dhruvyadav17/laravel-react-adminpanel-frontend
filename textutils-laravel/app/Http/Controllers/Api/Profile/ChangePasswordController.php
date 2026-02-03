<?php

namespace App\Http\Controllers\Api\Profile;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Traits\ApiResponse;
use App\Services\Profile\ProfileService;
use DomainException;

class ChangePasswordController extends Controller
{
    use ApiResponse;

    /**
     * POST /api/profile/change-password
     */
    public function __invoke(
        Request $request,
        ProfileService $profileService
    ) {
        $data = $request->validate([
            'password' => 'required|min:8|confirmed',
        ]);

        try {
            $profileService->changePassword(
                $request->user(),
                $data['password']
            );
        } catch (DomainException $e) {
            return $this->error(
                $e->getMessage(),
                [],
                422
            );
        }

        return $this->success(
            null,
            'Password updated successfully'
        );
    }
}
