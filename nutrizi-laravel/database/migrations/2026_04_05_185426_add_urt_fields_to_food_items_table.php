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
            $table->string('urt_unit')->nullable()->after('base_quantity')->comment('Ukuran Rumah Tangga (Sdm, Piring, dll)');
            $table->decimal('urt_weight', 5, 2)->nullable()->after('urt_unit')->comment('Berat dalam gram per 1 unit URT');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('food_items', function (Blueprint $table) {
            $table->dropColumn(['urt_unit', 'urt_weight']);
        });
    }
};
