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
        Schema::table('food_items', function (Blueprint $table) {
            $table->string('base_unit')->default('gram')->after('category');
            $table->decimal('base_quantity', 10, 2)->default(100.00)->after('base_unit');
            $table->string('image_url')->nullable()->after('yield_factor');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('food_items', function (Blueprint $table) {
            $table->dropColumn(['base_unit', 'base_quantity', 'image_url']);
        });
    }
};
