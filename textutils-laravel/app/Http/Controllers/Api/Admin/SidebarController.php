<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Api\BaseApiController;
use App\Services\Sidebar\SidebarService;

class SidebarController extends BaseApiController
{
    public function __construct(
        protected SidebarService $service
    ) {}

    /**
     * GET /api/v1/admin/sidebar
     */
    public function __invoke()
    {
        return $this->success(
            'Sidebar loaded',
            $this->service->get()
        );
    }
}
