<?php

use Illuminate\Support\Facades\Route;

/* ================= AUTH ================= */
use App\Http\Controllers\Api\Auth\{
    RegisterController,
    LoginController,
    ProfileController,
    LogoutController,
    EmailVerificationController,
    RefreshTokenController
};

use App\Http\Controllers\Api\Password\{
    ForgotPasswordController,
    ResetPasswordController
};

/* ================= ADMIN ================= */
use App\Http\Controllers\Api\Admin\{
    UserController,
    SidebarController,
    DashboardController,
    AdminUserController
};

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
Route::post('/refresh-token', RefreshTokenController::class);



/*
|--------------------------------------------------------------------------
| AUTHENTICATED ROUTES
|--------------------------------------------------------------------------
*/
Route::middleware('auth:sanctum')->group(function () {

    /* ================= AUTH ================= */
    Route::get('/profile', ProfileController::class);
    Route::post('/logout', LogoutController::class);

    /* ================= EMAIL VERIFICATION ================= */
    Route::get(
        '/email/verify/{id}/{hash}',
        [EmailVerificationController::class, 'verify']
    )->name('verification.verify');

    Route::post(
        '/email/resend',
        [EmailVerificationController::class, 'resend']
    );

    /*
    |--------------------------------------------------------------------------
    | ADMIN ROUTES
    |--------------------------------------------------------------------------
    */
    Route::prefix('admin')->group(function () {

        /* ================= DASHBOARD ================= */
        Route::get('/sidebar', SidebarController::class);
        Route::get('/dashboard/stats', [DashboardController::class, 'stats']);


        /* ================= CREATE ADMIN ================= */
        Route::post(
            '/admins',
            [AdminUserController::class, 'store']
        )->middleware('permission:role-manage');

        /* ================= USERS ================= */
        Route::prefix('users')->group(function () {

            Route::middleware('permission:user-view')
                ->get('/', [UserController::class, 'index']);

            Route::middleware('permission:user-create')
                ->post('/', [UserController::class, 'store']);

            Route::middleware('permission:user-update')
                ->put('/{user}', [UserController::class, 'update']);

            Route::middleware('permission:user-delete')
                ->delete('/{user}', [UserController::class, 'destroy']);

            Route::middleware('permission:user-delete')
                ->post('/{user}/restore', [UserController::class, 'restore'])
                ->withTrashed();

            Route::middleware('permission:user-assign-role')
                ->post('/{user}/assign-role', [UserController::class, 'assignRole']);

            Route::middleware('permission:user-assign-permission')
                ->post('/{user}/permissions', [UserController::class, 'assignPermissions']);

            Route::middleware('permission:user-view')
                ->get('/{user}/permissions', [UserController::class, 'permissions']);
        });

        /* ================= ROLES ================= */
        Route::prefix('roles')
            ->middleware('permission:role-manage')
            ->group(function () {

                Route::get('/', [RoleController::class, 'index']);
                Route::post('/', [RoleController::class, 'store']);
                Route::put('/{role}', [RoleController::class, 'update']);
                Route::delete('/{role}', [RoleController::class, 'destroy']);

                Route::get('/{role}/permissions', [RoleController::class, 'permissions']);
                Route::post('/{role}/permissions', [RoleController::class, 'assignPermissions']);
            });

        /* ================= PERMISSIONS ================= */
        Route::prefix('permissions')
            ->middleware('permission:permission-manage')
            ->group(function () {

                Route::get('/', [PermissionController::class, 'index']);
                Route::post('/', [PermissionController::class, 'store']);
                Route::get('/{permission}', [PermissionController::class, 'show']);
                Route::put('/{permission}', [PermissionController::class, 'update']);
                Route::delete('/{permission}', [PermissionController::class, 'destroy']);
            });
    });
});
