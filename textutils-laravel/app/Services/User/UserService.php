<?php

namespace App\Services\User;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class UserService
{
    /**
     * Paginated user listing with search & soft deletes
     */
    public function paginate(Request $request): array
    {
        $users = User::withTrashed()
            ->with('roles')
            ->when(
                $request->filled('search'),
                fn($q) =>
                $q->where('name', 'like', "%{$request->search}%")
                    ->orWhere('email', 'like', "%{$request->search}%")
            )
            ->latest()
            ->paginate(10);

        return [
            'data' => $users->items(),
            'meta' => [
                'current_page' => $users->currentPage(),
                'last_page'    => $users->lastPage(),
                'per_page'     => $users->perPage(),
                'total'        => $users->total(),
            ],
        ];
    }

    /**
     * Create new user
     */
    public function create(array $data): User
    {
        return DB::transaction(function () use ($data) {

            return User::create([
                'name'     => $data['name'],
                'email'    => $data['email'],
                'password' => Hash::make($data['password']),
            ]);
        });
    }

    /**
     * Update user
     */
    public function update(User $user, array $data): User
    {
        $user->update($data);
        return $user;
    }

    /**
     * Soft delete user
     */
    public function delete(User $user): void
    {
        $user->delete();
    }


    /**
     * Restore soft deleted user
     */
    public function restore(User $user): User
    {
        $user->restore();
        return $user;
    }
}
