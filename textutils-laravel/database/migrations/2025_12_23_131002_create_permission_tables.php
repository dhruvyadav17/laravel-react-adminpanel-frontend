<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        $teams        = config('permission.teams');
        $tableNames  = config('permission.table_names');
        $columnNames = config('permission.column_names');

        $pivotRole       = $columnNames['role_pivot_key'] ?? 'role_id';
        $pivotPermission = $columnNames['permission_pivot_key'] ?? 'permission_id';

        if (empty($tableNames)) {
            throw new Exception('config/permission.php not loaded');
        }

        /*
        |--------------------------------------------------------------------------
        | PERMISSIONS
        |--------------------------------------------------------------------------
        */
        Schema::create($tableNames['permissions'], function (Blueprint $table) {
            $table->bigIncrements('id');

            $table->string('name');

            // ✅ Permission Group (UX Category)
            $table->string('group_name')->index();

            $table->string('guard_name');
            $table->boolean('is_active')->default(true);

            $table->softDeletes();
            $table->timestamps();

            $table->unique(['name', 'guard_name']);
        });

        /*
        |--------------------------------------------------------------------------
        | ROLES (WITH HIERARCHY)
        |--------------------------------------------------------------------------
        */
        Schema::create($tableNames['roles'], function (Blueprint $table) use ($teams, $columnNames) {
            $table->bigIncrements('id');

            if ($teams || config('permission.testing')) {
                $table->unsignedBigInteger($columnNames['team_foreign_key'])->nullable();
                $table->index($columnNames['team_foreign_key']);
            }

            $table->string('name');
            $table->string('guard_name');

            // ✅ Role Hierarchy (parent role)
            $table->unsignedBigInteger('parent_id')->nullable()->index();

            $table->boolean('is_active')->default(true);

            $table->softDeletes();
            $table->timestamps();

            if ($teams || config('permission.testing')) {
                $table->unique([
                    $columnNames['team_foreign_key'],
                    'name',
                    'guard_name',
                ]);
            } else {
                $table->unique(['name', 'guard_name']);
            }
        });

        /*
        |--------------------------------------------------------------------------
        | MODEL HAS PERMISSIONS
        |--------------------------------------------------------------------------
        */
        Schema::create($tableNames['model_has_permissions'], function (Blueprint $table) use (
            $tableNames,
            $columnNames,
            $pivotPermission
        ) {
            $table->unsignedBigInteger($pivotPermission);

            $table->string('model_type');
            $table->unsignedBigInteger($columnNames['model_morph_key']);

            $table->foreign($pivotPermission)
                ->references('id')
                ->on($tableNames['permissions'])
                ->onDelete('cascade');

            $table->primary([
                $pivotPermission,
                $columnNames['model_morph_key'],
                'model_type',
            ]);
        });

        /*
        |--------------------------------------------------------------------------
        | MODEL HAS ROLES
        |--------------------------------------------------------------------------
        */
        Schema::create($tableNames['model_has_roles'], function (Blueprint $table) use (
            $tableNames,
            $columnNames,
            $pivotRole
        ) {
            $table->unsignedBigInteger($pivotRole);

            $table->string('model_type');
            $table->unsignedBigInteger($columnNames['model_morph_key']);

            $table->foreign($pivotRole)
                ->references('id')
                ->on($tableNames['roles'])
                ->onDelete('cascade');

            $table->primary([
                $pivotRole,
                $columnNames['model_morph_key'],
                'model_type',
            ]);
        });

        /*
        |--------------------------------------------------------------------------
        | ROLE HAS PERMISSIONS
        |--------------------------------------------------------------------------
        */
        Schema::create($tableNames['role_has_permissions'], function (Blueprint $table) use (
            $tableNames,
            $pivotRole,
            $pivotPermission
        ) {
            $table->unsignedBigInteger($pivotPermission);
            $table->unsignedBigInteger($pivotRole);

            $table->foreign($pivotPermission)
                ->references('id')
                ->on($tableNames['permissions'])
                ->onDelete('cascade');

            $table->foreign($pivotRole)
                ->references('id')
                ->on($tableNames['roles'])
                ->onDelete('cascade');

            $table->primary([$pivotPermission, $pivotRole]);
        });
    }

    public function down(): void
    {
        $tableNames = config('permission.table_names');

        Schema::dropIfExists($tableNames['role_has_permissions']);
        Schema::dropIfExists($tableNames['model_has_roles']);
        Schema::dropIfExists($tableNames['model_has_permissions']);
        Schema::dropIfExists($tableNames['roles']);
        Schema::dropIfExists($tableNames['permissions']);
    }
};
