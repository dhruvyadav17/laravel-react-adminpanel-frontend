<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class LoginAttempt extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'ip_address',
        'user_agent',
        'attempted_at',
    ];

    public $timestamps = false;

    protected $casts = [
        'attempted_at' => 'datetime',
    ];

    /* 🔗 RELATION */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
