<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
// use Spatie\Permission\Models\Role;
// use Spatie\Permission\Models\Permission;
use App\Models\Permission;
use App\Traits\ApiResponse;

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
        $data = $request->validate([
            'name' => 'required|string|unique:permissions,name',
        ]);

        $permission = Permission::create([
            'name'       => $data['name'],
            'guard_name' => 'api', // 🔥 IMPORTANT
        ]);

        return $this->success(
            'Permission created successfully',
            $permission,
            201
        );
    }

    /**
     * PUT /api/admin/permissions/{id}
     */
    public function update(Request $request, $id)
    {
        $permission = Permission::findOrFail($id);

        $data = $request->validate([
            'name' => 'required|string|unique:permissions,name,' . $permission->id,
        ]);

        $permission->update([
            'name' => $data['name'],
        ]);

        return $this->success(
            'Permission updated successfully',
            $permission
        );
    }

    /**
     * DELETE /api/admin/permissions/{id}
     */
    public function destroy($id)
    {
        $permission = Permission::findOrFail($id);

        $permission->delete();

        return $this->success(
            'Permission deleted successfully'
        );
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
