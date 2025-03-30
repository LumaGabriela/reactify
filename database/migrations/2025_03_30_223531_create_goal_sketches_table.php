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
        Schema::create('goal_sketches', function (Blueprint $table) {
            $table->id();
            $table->string(column: 'title');
            $table->string(column:'type');
            $table->foreignId('project_id')->constrained('projects');
            $table->foreignId('priority_id')->constrained('priorities');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('goal_sketches');
    }
};
