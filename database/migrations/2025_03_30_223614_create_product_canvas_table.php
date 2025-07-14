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
        Schema::create("product_canvas", function (Blueprint $table) {
            $table->id();
            $table->text("issues")->nullable();
            $table->text("solutions")->nullable();
            $table->text("personas")->nullable();
            $table->text("restrictions")->nullable();
            $table->text("product_is")->nullable();
            $table->text("product_is_not")->nullable();
            $table
                ->foreignId("project_id")
                ->constrained("projects")
                ->onDelete("cascade");
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists("product_canvas");
    }
};
