<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Models\Permission;
use App\Services\Permission\PermissionService;
use App\Http\Controllers\Api\BaseApiController;

class PermissionController extends BaseApiController
{
    public function __construct(
        protected PermissionService $service
    ) {}

    /**
     * ✅ flat=1 → Permissions Page (table)
     * ❌ no flag → Role/User Modal (grouped)
     */
    public function index(Request $request)
    {
        if ($request->boolean('flat')) {
            return $this->success(
                'Permissions fetched',
                $this->service->flat()
            );
        }

        return $this->success(
            'Permissions fetched',
            [
                'permissions' => $this->service->grouped(),
            ]
        );
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name'       => ['required', 'string', 'unique:permissions,name'],
            'group_name' => ['required', 'string'],
        ]);

        $permission = $this->service->create($data);

        return $this->success(
            'Permission created',
            [
                'id'         => $permission->id,
                'name'       => $permission->name,
                'group_name' => $permission->group_name,
            ]
        );
    }

    public function update(Request $request, Permission $permission)
    {
        $data = $request->validate([
            'name'       => ['required', 'string', 'unique:permissions,name,' . $permission->id],
            'group_name' => ['required', 'string'],
        ]);

        $permission = $this->service->update($permission, $data);

        return $this->success(
            'Permission updated',
            [
                'id'         => $permission->id,
                'name'       => $permission->name,
                'group_name' => $permission->group_name,
            ]
        );
    }

    public function destroy(Permission $permission)
    {
        $this->service->delete($permission);

        return $this->success('Permission deleted');
    }
}
