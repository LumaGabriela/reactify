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
        Schema::create('crc_card_system_interface', function (Blueprint $table) {
            $table->id();
            $table->foreignId('system_interface_id')->constrained()->onDelete('cascade');
            $table->foreignId('crc_card_id')->constrained()->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('crc_card_system_interface');
    }
};