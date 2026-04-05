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
        Schema::create('portion_configs', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->decimal('multiplier', 5, 2);
            $table->decimal('meal_energy', 10, 2);
            $table->decimal('meal_protein', 10, 2);
            $table->decimal('meal_fat', 10, 2);
            $table->decimal('meal_carbs', 10, 2);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('portion_configs');
    }
};
