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
    Schema::create('invest_cards', function (Blueprint $table) {
      $table->id();
      $table->boolean('independent')->default(false);
      $table->boolean('negotiable')->default(false);
      $table->boolean('valuable')->default(false);
      $table->boolean('estimable')->default(false);
      $table->boolean('small')->default(false);
      $table->boolean('testable')->default(false);

      $table->foreignId('story_id')
        ->constrained()->onDelete('cascade');
      $table->foreignId('project_id')
        ->constrained()
        ->onDelete('cascade');

      $table->unique('story_id');
      $table->timestamps();
      $table->softDeletes();
    });
  }

  /**
   * Reverse the migrations.
   */
  public function down(): void
  {
    Schema::dropIfExists('invest_cards');
  }
};
