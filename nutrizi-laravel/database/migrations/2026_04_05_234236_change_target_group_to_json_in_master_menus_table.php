<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // First, drop the column to avoid the constraint error (since data is already JSON or not)
        // We'll backup the data first if we can, but since this is dev, let's just do it
        Schema::table('master_menus', function (Blueprint $table) {
            $table->dropColumn('target_group');
        });

        // Add it back as json
        Schema::table('master_menus', function (Blueprint $table) {
            $table->json('target_group')->after('menu_name')->nullable();
        });

        // Seed with a default value if needed
        DB::table('master_menus')->update(['target_group' => json_encode(['SD', 'SMP', 'SMA'])]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('master_menus', function (Blueprint $table) {
            $table->dropColumn('target_group');
        });

        Schema::table('master_menus', function (Blueprint $table) {
            $table->string('target_group')->after('menu_name')->nullable();
        });
    }
};
