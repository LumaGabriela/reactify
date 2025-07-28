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
        Schema::create('crc_card_collaborator', function (Blueprint $table) {
            $table->foreignId('crc_card_id')->constrained('crc_cards')->onDelete('cascade');
            $table->foreignId('collaborator_id')->constrained('crc_cards')->onDelete('cascade');
            $table->primary(['crc_card_id', 'collaborator_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('crc_card_collaborator');
    }
};
