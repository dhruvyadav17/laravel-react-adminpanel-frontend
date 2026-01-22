<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;

class DashboardController extends Controller
{
    public function stats()
    {
        return response()->json([
            'success' => true,
            'data' => [
                'total_users' => User::count(),
            ],
        ]);
    }
}
