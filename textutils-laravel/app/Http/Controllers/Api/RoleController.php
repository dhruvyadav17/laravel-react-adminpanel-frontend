<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Role;
use App\Models\Permission;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use Spatie\Permission\PermissionRegistrar;

class RoleController extends Controller
{
    use ApiResponse;

    /**
     * 📄 GET /api/admin/roles
     * List all roles
     */
    public function index()
    {
        return $this->success(
            'Roles fetched successfully',
            Role::withCount('permissions')
                ->orderBy('name')
                ->get()
        );
    }

    /**
     * ➕ POST /api/admin/roles
     * Create role
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'unique:roles,name'],
        ]);

        $role = Role::create([
            'name'       => $data['name'],
            'guard_name' => 'api',
        ]);

        // 🔥 clear spatie cache
        app(PermissionRegistrar::class)->forgetCachedPermissions();

        return $this->success(
            'Role created successfully',
            $role,
            201
        );
    }

    /**
     * ✏️ PUT /api/admin/roles/{role}
     * Update role
     */
    public function update(Request $request, Role $role)
    {
        // 🔒 Protect super-admin
        if ($role->name === 'super-admin') {
            return $this->error(
                'Super admin role cannot be modified',
                null,
                403
            );
        }

        $data = $request->validate([
            'name' => [
                'required',
                'string',
                'unique:roles,name,' . $role->id
            ],
        ]);

        $role->update([
            'name' => $data['name'],
        ]);

        app(PermissionRegistrar::class)->forgetCachedPermissions();

        return $this->success(
            'Role updated successfully',
            $role
        );
    }

    /**
     * ❌ DELETE /api/admin/roles/{role}
     * Soft delete role
     */
    public function destroy(Role $role)
    {
        if ($role->name === 'super-admin') {
            return $this->error(
                'Super admin role cannot be deleted',
                null,
                403
            );
        }

        $role->delete();

        app(PermissionRegistrar::class)->forgetCachedPermissions();

        return $this->success(
            'Role deleted successfully'
        );
    }

    /**
     * 🔁 PATCH /api/admin/roles/{role}/toggle
     * Enable / Disable role
     */
    public function toggle(Role $role)
    {
        if ($role->name === 'super-admin') {
            return $this->error(
                'Super admin role cannot be disabled',
                null,
                403
            );
        }

        $role->update([
            'is_active' => ! $role->is_active,
        ]);

        return $this->success(
            'Role status updated',
            $role
        );
    }

    /**
     * 🔐 GET /api/admin/roles/{role}/permissions
     * Role permissions (for checkbox modal)
     */
    public function permissions(Role $role)
    {
        return $this->success(
            'Role permissions fetched',
            [
                'role'        => $role,
                'permissions' => Permission::select('id', 'name')
                    ->orderBy('name')
                    ->get(),
                'assigned'    => $role->permissions
                    ->pluck('name')
                    ->values(),
            ]
        );
    }

    /**
     * 🔄 POST /api/admin/roles/{role}/permissions
     * Assign permissions to role
     */
    public function assignPermissions(Request $request, Role $role)
    {
        if ($role->name === 'super-admin') {
            return $this->error(
                'Super admin permissions cannot be modified',
                null,
                403
            );
        }

        $data = $request->validate([
            'permissions'   => ['array'],
            'permissions.*' => ['string', 'exists:permissions,name'],
        ]);

        $role->syncPermissions($data['permissions'] ?? []);

        app(PermissionRegistrar::class)->forgetCachedPermissions();

        return $this->success(
            'Permissions updated successfully'
        );
    }
}
