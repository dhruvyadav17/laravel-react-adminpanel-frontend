<?php

use Illuminate\Support\Facades\Route;

/* ================= AUTH CONTROLLERS ================= */
use App\Http\Controllers\Api\Auth\{
    RegisterController,
    LoginController,
    ProfileController,
    LogoutController
};

use App\Http\Controllers\Api\Password\{
    ForgotPasswordController,
    ResetPasswordController
};

/* ================= ADMIN CONTROLLERS ================= */
use App\Http\Controllers\Api\Admin\UserController;
use App\Http\Controllers\Api\Admin\SidebarController;
use App\Http\Controllers\Api\{
    RoleController,
    PermissionController
};

/*
|--------------------------------------------------------------------------
| PUBLIC ROUTES
|--------------------------------------------------------------------------
*/
Route::post('/register', RegisterController::class);
Route::post('/login', LoginController::class);
Route::post('/forgot-password', ForgotPasswordController::class);
Route::post('/reset-password', ResetPasswordController::class);

/*
|--------------------------------------------------------------------------
| AUTHENTICATED ROUTES (SANCTUM)
|--------------------------------------------------------------------------
*/
Route::middleware('auth:sanctum')->group(function () {

    /* ================= AUTH ================= */
    Route::get('/profile', ProfileController::class);
    Route::post('/logout', LogoutController::class);

    /* ================= SIDEBAR ================= */
    Route::prefix('admin')->group(function () {
        Route::get('/sidebar', SidebarController::class);
    });

    /*
    |--------------------------------------------------------------------------
    | USERS (Permission Hardened)
    |--------------------------------------------------------------------------
    */
    Route::prefix('admin/users')->group(function () {

        Route::middleware('permission:user-view')
            ->get('/', [UserController::class, 'index']);

        Route::middleware('permission:user-create')
            ->post('/', [UserController::class, 'store']);

        Route::middleware('permission:user-update')
            ->put('/{user}', [UserController::class, 'update']);

        Route::middleware('permission:user-delete')
            ->delete('/{user}', [UserController::class, 'destroy']);

        Route::middleware('permission:user-delete')
            ->post('/{id}/restore', [UserController::class, 'restore']);

        /* -------- ROLES -------- */
        Route::middleware('permission:user-assign-role')
            ->post('/{user}/assign-role', [UserController::class, 'assignRole']);

        /* -------- PERMISSIONS -------- */
        Route::middleware('permission:user-assign-permission')
            ->post('/{id}/permissions', [UserController::class, 'assignPermissions']);

        Route::middleware('permission:user-view')
            ->get('/{id}/permissions', [UserController::class, 'permissions']);
    });

    /*
    |--------------------------------------------------------------------------
    | ROLES (Permission Hardened)
    |--------------------------------------------------------------------------
    */
    Route::prefix('admin/roles')
        ->middleware('permission:role-manage')
        ->group(function () {

            Route::get('/', [RoleController::class, 'index']);
            Route::post('/', [RoleController::class, 'store']);
            Route::put('/{role}', [RoleController::class, 'update']);
            Route::delete('/{role}', [RoleController::class, 'destroy']);

            Route::get('/{role}/permissions', [RoleController::class, 'permissions']);
            Route::post('/{role}/permissions', [RoleController::class, 'assignPermissions']);
        });

    /*
    |--------------------------------------------------------------------------
    | PERMISSIONS (Permission Hardened)
    |--------------------------------------------------------------------------
    */
    Route::prefix('admin/permissions')
        ->middleware('permission:permission-manage')
        ->group(function () {

            Route::get('/', [PermissionController::class, 'index']);
            Route::post('/', [PermissionController::class, 'store']);
            Route::get('/{permission}', [PermissionController::class, 'show']);
            Route::put('/{permission}', [PermissionController::class, 'update']);
            Route::delete('/{permission}', [PermissionController::class, 'destroy']);
        });
});
