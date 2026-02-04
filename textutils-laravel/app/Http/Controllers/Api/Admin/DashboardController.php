<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Api\BaseApiController;
use App\Models\User;

class DashboardController extends BaseApiController
{
    public function stats()
    {
        return $this->success(
            'Dashboard stats',
            [
                'total_users' => User::count(),
            ]
        );
    }
}
