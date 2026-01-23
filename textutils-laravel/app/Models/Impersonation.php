<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Impersonation extends Model
{
    protected $fillable = [
        'admin_id',
        'user_id',
        'started_at',
        'ended_at',
    ];
}
