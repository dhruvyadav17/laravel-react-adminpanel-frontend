<?php

namespace App\Http\Controllers\Api;

use App\Models\Role;
use Illuminate\Http\Request;
use App\Services\Role\RoleService;
use App\Http\Resources\RoleResource;
use App\Http\Resources\PermissionResource;
use App\Http\Controllers\Api\BaseApiController;

class RoleController extends BaseApiController
{
    public function __construct(
        protected RoleService $service
    ) {}

    /**
     * 📄 GET /api/v1/admin/roles
     */
    public function index()
    {
        $roles = $this->service->list();

        return $this->success(
            'Roles fetched successfully',
            RoleResource::collection($roles)
        );
    }

    /**
     * ➕ POST /api/v1/admin/roles
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:100', 'unique:roles,name'],
        ]);

        $role = $this->service->create($data);

        return $this->success(
            'Role created successfully',
            RoleResource::make($role),
            [],
            201
        );
    }

    /**
     * ✏️ PUT /api/v1/admin/roles/{role}
     */
    public function update(Request $request, Role $role)
    {
        $data = $request->validate([
            'name' => [
                'required',
                'string',
                'max:100',
                'unique:roles,name,' . $role->id,
            ],
        ]);

        $updated = $this->service->update($role, $data);

        return $this->success(
            'Role updated successfully',
            RoleResource::make($updated)
        );
    }

    /**
     * ❌ DELETE /api/v1/admin/roles/{role}
     */
    public function destroy(Role $role)
    {
        $this->service->delete($role);

        return $this->success('Role deleted successfully');
    }

    /**
     * 🔁 PATCH /api/v1/admin/roles/{role}/toggle
     */
    public function toggle(Role $role)
    {
        $role = $this->service->toggle($role);

        return $this->success(
            'Role status updated',
            RoleResource::make($role)
        );
    }

    /**
     * 🔐 GET /api/v1/admin/roles/{role}/permissions
     */
    public function permissions(Role $role)
    {
        $data = $this->service->permissions($role);

        return $this->success('Role permissions fetched', [
            'role'        => RoleResource::make($data['role']),
            'permissions' => PermissionResource::collection($data['permissions']),
            'assigned'    => $data['assigned'],
        ]);
    }

    /**
     * 🔄 POST /api/v1/admin/roles/{role}/permissions
     */
    public function assignPermissions(Request $request, Role $role)
    {
        $data = $request->validate([
            'permissions'   => ['array'],
            'permissions.*' => ['string', 'exists:permissions,name'],
        ]);

        $this->service->syncPermissions(
            $role,
            $data['permissions'] ?? []
        );

        return $this->success('Permissions updated successfully');
    }
}
