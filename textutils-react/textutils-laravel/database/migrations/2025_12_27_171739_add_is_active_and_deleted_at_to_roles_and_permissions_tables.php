<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        // Roles table
        Schema::table('roles', function (Blueprint $table) {
            $table->boolean('is_active')->default(true)->after('guard_name');
            $table->softDeletes(); // adds deleted_at
        });

        // Permissions table
        Schema::table('permissions', function (Blueprint $table) {
            $table->boolean('is_active')->default(true)->after('guard_name');
            $table->softDeletes(); // adds deleted_at
        });
    }

    public function down(): void
    {
        Schema::table('roles', function (Blueprint $table) {
            $table->dropColumn('is_active');
            $table->dropSoftDeletes();
        });

        Schema::table('permissions', function (Blueprint $table) {
            $table->dropColumn('is_active');
            $table->dropSoftDeletes();
        });
    }
};
