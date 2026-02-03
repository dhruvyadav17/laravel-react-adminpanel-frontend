<?php

namespace App\Services\Audit;

use App\Models\AuditLog;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;

class AuditService
{
    public static function log(
        string $action,
        ?Model $subject = null,
        array $meta = []
    ): void {
        AuditLog::create([
            'user_id'      => Auth::id(),
            'action'       => $action,
            'subject_type' => $subject ? get_class($subject) : null,
            'subject_id'   => $subject?->getKey(),
            'ip_address'   => request()->ip(),
            'user_agent'   => request()->userAgent(),
            'meta'         => $meta,
        ]);
    }
}
