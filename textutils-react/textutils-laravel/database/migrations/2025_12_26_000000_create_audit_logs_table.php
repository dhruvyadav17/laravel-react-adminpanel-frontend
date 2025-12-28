<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('audit_logs', function (Blueprint $table) {
            $table->id();

            // User who performed the action
            $table->foreignId('user_id')
                ->nullable()
                ->constrained()
                ->nullOnDelete();

            // Action name (created, updated, deleted, login, logout, etc.)
            $table->string('action');

            // Model name (User, Post, Order, etc.)
            $table->string('model')->nullable();

            // Affected model ID
            $table->unsignedBigInteger('model_id')->nullable();

            // Old values before update
            $table->json('old_values')->nullable();

            // New values after update
            $table->json('new_values')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('audit_logs');
    }
};
