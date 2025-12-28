<?php

namespace App\Helpers;

use App\Models\AuditLog;

class AuditLogger
{
    public static function log($action, $model = null, $old = null, $new = null)
    {
        AuditLog::create([
            'user_id'   => auth()->id(),
            'action'    => $action,
            'model'     => $model ? get_class($model) : null,
            'model_id'  => $model?->id,
            'old_values'=> $old,
            'new_values'=> $new,
        ]);
    }
}
