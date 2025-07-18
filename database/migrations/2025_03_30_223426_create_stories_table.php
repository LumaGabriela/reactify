<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create("stories", function (Blueprint $table) {
            $table->id();
            $table->text("title");
            $table->enum("type", ["user", "system"]); // Tipo fixo
            $table
                ->foreignId("project_id")
                ->constrained("projects")
                ->onDelete("cascade"); // Chave estrangeira
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists("stories");
    }
};
