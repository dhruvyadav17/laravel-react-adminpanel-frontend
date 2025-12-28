<?php

namespace App\Http\Controllers\Api\Auth;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Traits\ApiResponse;

class LogoutController extends Controller
{
    use ApiResponse;

    public function __invoke(Request $request)
    {
        // Revoke current access token
        $request->user()->currentAccessToken()->delete();

        return $this->success('Logged out successfully');
    }
}
