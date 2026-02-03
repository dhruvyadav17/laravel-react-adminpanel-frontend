<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Role Hierarchy
    |--------------------------------------------------------------------------
    | child => parent
    */

    'hierarchy' => [
        'super-admin' => null,
        'admin'       => 'super-admin',
        'manager'     => 'admin',
        'user'        => 'manager',
    ],

];
