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
        Schema::create('story_sprint', function (Blueprint $table) {
            $table->id();
            $table->foreignId('story_id')->constrained()->onDelete('cascade');
            $table->foreignId('sprint_id')->constrained()->onDelete('cascade');
            $table->enum('kanban_status', ['todo', 'in_progress', 'testing', 'done'])->default('todo');
            $table->integer('position')->default(0);
            $table->timestamp('started_at')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->timestamps();


            // Índices compostos para performance
            $table->unique(['story_id', 'sprint_id']); 
            // $table->index(['sprint_id', 'kanban_status', 'position']);
            // $table->index(['story_id', 'kanban_status']); 
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('story_sprint');
    }
};
