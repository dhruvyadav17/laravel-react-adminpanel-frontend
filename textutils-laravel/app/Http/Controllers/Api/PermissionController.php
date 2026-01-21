<?php

namespace App\Http\Controllers\Api;

use App\Models\Permission;
use App\Http\Controllers\Api\BaseApiController;
use App\Services\Permission\PermissionService;
use App\Http\Requests\Permission\StorePermissionRequest;
use App\Http\Requests\Permission\UpdatePermissionRequest;
use App\Http\Resources\PermissionResource;

class PermissionController extends BaseApiController
{
    public function __construct(
        protected PermissionService $service
    ) {}

    /**
     * 📄 GET /api/v1/admin/permissions
     */
    public function index()
    {
        $permissions = $this->service->list();

        return $this->success(
            'Permissions fetched successfully',
            PermissionResource::collection($permissions)
        );
    }

    /**
     * 🔍 GET /api/v1/admin/permissions/{permission}
     */
    public function show(Permission $permission)
    {
        return $this->success(
            'Permission details',
            PermissionResource::make($permission)
        );
    }

    /**
     * ➕ POST /api/v1/admin/permissions
     */
    public function store(StorePermissionRequest $request)
    {
        $permission = $this->service->create($request->validated());

        return $this->success(
            'Permission created successfully',
            PermissionResource::make($permission),
            [],
            201
        );
    }

    /**
     * ✏️ PUT /api/v1/admin/permissions/{permission}
     */
    public function update(
        UpdatePermissionRequest $request,
        Permission $permission
    ) {
        $permission = $this->service->update(
            $permission,
            $request->validated()
        );

        return $this->success(
            'Permission updated successfully',
            PermissionResource::make($permission)
        );
    }

    /**
     * ❌ DELETE /api/v1/admin/permissions/{permission}
     */
    public function destroy(Permission $permission)
    {
        $this->service->delete($permission);

        return $this->success('Permission deleted successfully');
    }

    /**
     * 🔁 PATCH /api/v1/admin/permissions/{permission}/toggle
     */
    public function toggle(Permission $permission)
    {
        $permission = $this->service->toggle($permission);

        return $this->success(
            'Permission status updated',
            PermissionResource::make($permission)
        );
    }
}
