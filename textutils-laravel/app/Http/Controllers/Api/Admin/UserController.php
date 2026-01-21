<?php

namespace App\Http\Controllers\Api\Admin;

use App\Models\User;
use Illuminate\Http\Request;
use App\Services\User\UserService;
use App\Http\Resources\UserResource;
use App\Http\Requests\Admin\StoreUserRequest;
use App\Http\Controllers\Api\BaseApiController;

class UserController extends BaseApiController
{
    public function __construct(
        protected UserService $service
    ) {}
    public function index(Request $request)
    {
        $result = $this->service->paginate($request);

        return $this->success(
            'Users fetched successfully',
            UserResource::collection($result['data']),
            $result['meta']
        );
    }




    public function store(StoreUserRequest $request)
    {
        $user = $this->service->create($request->validated());

        return $this->success(
            'User created successfully',
            new UserResource($user)
        );
    }


    public function destroy(User $user)
    {
        $this->service->delete($user);

        return $this->success('User archived successfully');
    }

    public function restore(User $user)
    {
        $this->service->restore($user);
        return $this->success('User restored successfully');
    }
}
