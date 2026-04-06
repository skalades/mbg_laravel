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
            $table->integer('buffer_count')->default(0)->after('small_portion_count');
            $table->integer('sample_count')->default(0)->after('buffer_count');
        });

        Schema::table('kitchens', function (Blueprint $table) {
            $table->integer('default_buffer_count')->default(0)->after('address');
            $table->integer('default_sample_count')->default(0)->after('default_buffer_count');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('schools', function (Blueprint $table) {
            $table->dropColumn(['buffer_count', 'sample_count']);
        });

        Schema::table('kitchens', function (Blueprint $table) {
            $table->dropColumn(['default_buffer_count', 'default_sample_count']);
        });
    }
};
