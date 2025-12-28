<?php

namespace App\Http\Controllers\Api\Auth;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Traits\ApiResponse;

class ProfileController extends Controller
{
    use ApiResponse;

    public function __invoke(Request $request)
    {
        return $this->success('Profile', [
            'user' => $request->user(),
            'roles' => $request->user()->getRoleNames(),
            'permissions' =>
            $request->user()->getAllPermissions()->pluck('name'),
        ]);
    }
}
