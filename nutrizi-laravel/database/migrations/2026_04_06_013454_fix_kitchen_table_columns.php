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
        Schema::table('kitchens', function (Blueprint $table) {
            if (Schema::hasColumn('kitchens', 'address')) {
                $table->renameColumn('address', 'location_address');
            }
            if (!Schema::hasColumn('kitchens', 'capacity')) {
                $table->integer('capacity')->nullable()->after('location_address');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('kitchens', function (Blueprint $table) {
            if (Schema::hasColumn('kitchens', 'location_address')) {
                $table->renameColumn('location_address', 'address');
            }
            if (Schema::hasColumn('kitchens', 'capacity')) {
                $table->dropColumn('capacity');
            }
        });
    }
};
