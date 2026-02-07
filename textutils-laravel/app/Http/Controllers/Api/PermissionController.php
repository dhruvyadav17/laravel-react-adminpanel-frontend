<?php

namespace App\Http\Controllers\Api;

use App\Models\Permission;
use Illuminate\Http\Request;
use App\Services\Permission\PermissionService;
use App\Http\Controllers\Controller;

class PermissionController extends Controller
{
    public function __construct(
        protected PermissionService $service
    ) {}

    public function index()
    {
        return $this->success(
            'Permissions fetched',
            $this->service->list()->map(fn ($p) => [
                'id'   => $p->id,
                'name' => $p->name,
            ])
        );
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'unique:permissions,name'],
        ]);

        $permission = $this->service->create($data);

        return $this->success('Permission created', [
            'id'   => $permission->id,
            'name' => $permission->name,
        ]);
    }

    public function update(Request $request, Permission $permission)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'unique:permissions,name,' . $permission->id],
        ]);

        $permission = $this->service->update($permission, $data);

        return $this->success('Permission updated', [
            'id'   => $permission->id,
            'name' => $permission->name,
        ]);
    }

    public function destroy(Permission $permission)
    {
        $this->service->delete($permission);

        return $this->success('Permission deleted', null);
    }
}
