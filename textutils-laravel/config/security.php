<?php
return [
    'password' => [
        'history_limit' => 5, // last 5 passwords reuse not allowed
    ],
    'login' => [
        'max_attempts' => 5,
        'lock_minutes' => 30,
        'track_ip' => true,
    ],
];
