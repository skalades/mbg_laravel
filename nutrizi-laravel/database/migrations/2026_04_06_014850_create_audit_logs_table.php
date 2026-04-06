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
            $table->foreignId('kitchen_id')->constrained();
            $table->date('audit_date');
            $table->string('photo_path')->nullable();
            $table->unsignedTinyInteger('taste_score')->default(0);
            $table->unsignedTinyInteger('appearance_score')->default(0);
            $table->unsignedTinyInteger('aroma_score')->default(0);
            $table->unsignedTinyInteger('texture_score')->default(0);
            $table->text('notes')->nullable();
            $table->foreignId('audited_by')->constrained('users');
            $table->timestamps();
            
            $table->unique(['kitchen_id', 'audit_date']);
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
