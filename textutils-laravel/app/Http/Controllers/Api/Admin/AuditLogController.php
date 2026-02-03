<?php

namespace App\Http\Controllers\Api\Admin;

use App\Models\AuditLog;
use App\Http\Controllers\Api\BaseApiController;
use Illuminate\Http\Request;

class AuditLogController extends BaseApiController
{
    public function index(Request $request)
    {
        $logs = AuditLog::with('user')
            ->when($request->filled('action'),
                fn ($q) => $q->where('action', $request->action)
            )
            ->latest()
            ->paginate(15);

        return $this->success(
            'Audit logs fetched',
            $logs->items(),
            [
                'current_page' => $logs->currentPage(),
                'last_page'    => $logs->lastPage(),
                'total'        => $logs->total(),
            ]
        );
    }
}
