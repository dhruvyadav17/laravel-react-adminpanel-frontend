<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
// use Spatie\Permission\Models\Role;
// use Spatie\Permission\Models\Permission;
use App\Models\Permission;
use App\Traits\ApiResponse;
use Spatie\Permission\PermissionRegistrar;

class PermissionController extends Controller
{
    use ApiResponse;

    /**
     * GET /api/admin/permissions
     */
    public function index()
    {

        $permissions = Permission::all();

        return $this->success(
            'Permissions list fetched successfully',
            $permissions
        );
    }

    /**
     * POST /api/admin/permissions
     */
    public function store(Request $request)
    {
        $permission = Permission::create([
            'name' => $request->name,
            'guard_name' => 'api',
        ]);

        app(PermissionRegistrar::class)->forgetCachedPermissions();

        return $this->success('Permission created', $permission, 201);
    }

    public function update(Request $request, Permission $permission)
    {
        $permission->update(['name' => $request->name]);

        app(PermissionRegistrar::class)->forgetCachedPermissions();

        return $this->success('Permission updated', $permission);
    }

    public function destroy(Permission $permission)
    {
        $permission->delete();

        app(PermissionRegistrar::class)->forgetCachedPermissions();

        return $this->success('Permission deleted');
    }

    public function show(Permission $permission)
    {
        return $this->success(
            'Permission detail',
            $permission
        );
    }

    // Enable / Disable
    public function toggle(Permission $permission)
    {
        $permission->update([
            'is_active' => !$permission->is_active
        ]);

        return $this->success(
            'Permission status updated',
            $permission
        );
    }
}
