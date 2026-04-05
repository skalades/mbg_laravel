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
        Schema::create('schools', function (Blueprint $table) {
            $table->id();
            $table->string('school_name');
            $table->string('target_group'); // SD, SMP, SMA, etc
            $table->integer('total_beneficiaries')->default(0);
            $table->integer('total_teachers')->default(0);
            $table->integer('large_portion_count')->default(0);
            $table->integer('small_portion_count')->default(0);
            $table->text('location_address')->nullable();
            $table->foreignId('kitchen_id')->nullable();
            
            // Gender stats
            $table->integer('siswa_laki_laki')->default(0);
            $table->integer('siswa_perempuan')->default(0);
            $table->integer('guru_laki_laki')->default(0);
            $table->integer('guru_perempuan')->default(0);

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('schools');
    }
};
