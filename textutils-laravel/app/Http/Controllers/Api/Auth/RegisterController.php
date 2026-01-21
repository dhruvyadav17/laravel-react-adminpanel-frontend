<?php

namespace App\Http\Controllers\Api\Auth;

use App\Models\User;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Traits\ApiResponse;
use App\Http\Requests\Auth\RegisterRequest;

class RegisterController extends Controller
{
    use ApiResponse;

    public function __invoke(RegisterRequest $request)
    {
        $user = User::create([
            ...$request->validated(),
            'password' => bcrypt($request->password)
        ]);

        $user->assignRole('user'); // ✅ Spatie way

        return $this->success(
            'Registered successfully',
            $user,
            [],
            201
        );
    }
}
