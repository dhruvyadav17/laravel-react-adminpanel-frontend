<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Http\Request;

class UserService
{
    public function paginate(Request $request): array
    {
        $users = User::withTrashed()
            ->with('roles')
            ->when(
                $request->filled('search'),
                fn ($q) =>
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

    public function create(array $data): User
    {
        return User::create($data);
    }

    public function delete(int $id): void
    {
        User::findOrFail($id)->delete();
    }

    public function restore(int $id): void
    {
        User::withTrashed()->findOrFail($id)->restore();
    }
}
