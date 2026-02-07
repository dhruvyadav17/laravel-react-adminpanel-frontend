<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class RoleRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $roleId = $this->route('role');

        /*
        |--------------------------------------------------------------------------
        | ASSIGN PERMISSIONS (POST /roles/{role}/permissions)
        |--------------------------------------------------------------------------
        */
        if ($this->routeIs('roles.permissions.assign')) {
            return [
                'permissions' => ['required', 'array'],
                'permissions.*' => [
                    'string',
                    Rule::exists('permissions', 'name')
                        ->whereNull('deleted_at')
                        ->where('guard_name', 'api'),
                ],
            ];
        }

        /*
        |--------------------------------------------------------------------------
        | STORE / UPDATE ROLE
        |--------------------------------------------------------------------------
        */
        return [
            'name' => [
                'required',
                'string',
                'max:100',
                Rule::unique('roles', 'name')->ignore($roleId),
            ],
        ];
    }
}
