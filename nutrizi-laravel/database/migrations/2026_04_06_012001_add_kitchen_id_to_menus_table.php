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
        Schema::table('master_menus', function (Blueprint $table) {
            $table->foreignId('kitchen_id')->nullable()->after('id')->constrained()->cascadeOnDelete();
        });

        Schema::table('daily_menus', function (Blueprint $table) {
            $table->foreignId('kitchen_id')->nullable()->after('id')->constrained()->cascadeOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('master_menus', function (Blueprint $table) {
            $table->dropForeign(['kitchen_id']);
            $table->dropColumn('kitchen_id');
        });

        Schema::table('daily_menus', function (Blueprint $table) {
            $table->dropForeign(['kitchen_id']);
            $table->dropColumn('kitchen_id');
        });
    }
};
