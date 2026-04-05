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
        Schema::table('schools', function (Blueprint $table) {
            $table->index('school_name');
            $table->index('target_group');
            $table->index('kitchen_id'); // Important for multi-tenant filtering
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('schools', function (Blueprint $table) {
            $table->dropIndex(['school_name']);
            $table->dropIndex(['target_group']);
            $table->dropIndex(['kitchen_id']);
        });
    }
};
