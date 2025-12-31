<?php

use Illuminate\Support\Facades\Route;
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
use App\Http\Controllers\Api\Admin\UserController;
use App\Http\Controllers\Api\{
    PermissionController,
    RoleController
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
| AUTHENTICATED ROUTES
|--------------------------------------------------------------------------
*/
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function () {
        return auth()->user();
    });
    /*
    |--------------------------------------------------------------------------
    | PROFILE
    |--------------------------------------------------------------------------
    */

    Route::get('/profile', ProfileController::class);
    Route::post('/logout', LogoutController::class);

    /*
    |--------------------------------------------------------------------------
    | USER MANAGEMENT (PERMISSION BASED)
    |--------------------------------------------------------------------------
    */
    Route::get('/admin/users', [UserController::class, 'index'])
        ->middleware('permission:user-view');

    Route::post('/admin/users', [UserController::class, 'store'])
        ->middleware('permission:user-create');

    Route::put('/admin/users/{user}', [UserController::class, 'update'])
        ->middleware('permission:user-edit');

    Route::delete('/admin/users/{user}', [UserController::class, 'destroy'])
        ->middleware('permission:user-delete');

    Route::get('/admin/users/{user}/roles', [UserController::class, 'roles'])
        ->middleware('permission:role-manage');

    Route::post('/admin/users/{user}/assign-role', [UserController::class, 'assignRole'])
        ->middleware('permission:role-manage');

    Route::get(
        '/admin/users/{id}/permissions',
        [UserController::class, 'permissions']
    );

    Route::post('/admin/users/{id}/permissions', [UserController::class, 'assignPermissions']);

    /*
    |--------------------------------------------------------------------------
    | ROLE & PERMISSION MANAGEMENT
    | Only ADMIN / SUPER-ADMIN
    |--------------------------------------------------------------------------
    */
    Route::prefix('admin')
        ->middleware('role:admin|super-admin')
        ->group(function () {

            /*
            |---------------- ROLES ----------------
            */
            Route::get('/roles', [RoleController::class, 'index']);          // list
            Route::post('/roles', [RoleController::class, 'store']);         // add
            Route::get('/roles/{role}', [RoleController::class, 'show']);    // detail
            Route::put('/roles/{role}', [RoleController::class, 'update']);  // edit
            Route::delete('/roles/{role}', [RoleController::class, 'destroy']); // delete
            Route::patch('/roles/{role}/toggle', [RoleController::class, 'toggle']); // enable/disable

            // Role permissions (checkbox popup)
            Route::get('/roles/{role}/permissions', [RoleController::class, 'permissions']);
            Route::post('/roles/{role}/permissions', [RoleController::class, 'assignPermissions']);

            /*
            |-------------- PERMISSIONS -------------
            */
            // Route::get('/permissions', [PermissionController::class, 'index']);
            // Route::post('/permissions', [PermissionController::class, 'store']);
            // Route::put('/permissions/{permission}', [PermissionController::class, 'update']);
            // Route::delete('/permissions/{permission}', [PermissionController::class, 'destroy']);
            // Route::patch('/permissions/{permission}/toggle', [PermissionController::class, 'toggle']);
            // Route::get('/permissions/{permission}', [PermissionController::class, 'show']);

            // Route::middleware(['auth:sanctum'])->group(function () {

            Route::prefix('permissions')->group(function () {

                Route::get('/', [PermissionController::class, 'index']);
                //->middleware('permission:permission-view');

                Route::get('/{permission}', [PermissionController::class, 'show']);
                //->middleware('permission:permission-view');

                Route::post('/', [PermissionController::class, 'store']);
                //->middleware('permission:permission-create');

                Route::put('/{permission}', [PermissionController::class, 'update']);
                //->middleware('permission:permission-edit');

                Route::delete('/{permission}', [PermissionController::class, 'destroy']);
                //->middleware('permission:permission-delete');

                Route::patch('/{permission}/toggle', [PermissionController::class, 'toggle']);
                //->middleware('permission:permission-toggle');

            });
            // });
        });
});
