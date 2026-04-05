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
        Schema::create('master_menu_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('master_menu_id')->constrained('master_menus')->onDelete('cascade');
            $table->foreignId('food_item_id')->constrained('food_items')->onDelete('cascade');
            $table->string('portion_name');
            $table->decimal('weight_small', 10, 2)->default(0);
            $table->decimal('weight_large', 10, 2)->default(0);
            $table->string('unit_name')->default('gram');
            $table->decimal('unit_quantity', 10, 2)->default(1.00);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('master_menu_items');
    }
};
