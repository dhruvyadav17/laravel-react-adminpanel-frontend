<?php

namespace App\Http\Controllers\Api;

use App\Models\Role;
use Illuminate\Http\Request;
use App\Services\Role\RoleService;
use App\Http\Resources\RoleResource;
use App\Http\Resources\PermissionResource;
use App\Http\Controllers\Controller;
use App\Http\Requests\RoleRequest;
class RoleController extends Controller
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
    public function store(RoleRequest $request)
    {
        $role = $this->service->create(
            $request->validated()
        );

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
    public function update(RoleRequest $request, Role $role)
    {
        $role = $this->service->update(
            $role,
            $request->validated()
        );

        return $this->success(
            'Role updated successfully',
            RoleResource::make($role)
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
