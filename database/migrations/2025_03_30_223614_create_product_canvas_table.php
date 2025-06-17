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
    Schema::create('product_canvas', function (Blueprint $table) {
      $table->id();
      $table->string('issues')->nullable();
      $table->string('solutions')->nullable();
      $table->string('personas')->nullable();
      $table->string('restrictions')->nullable();
      $table->string('product_is')->nullable();
      $table->string('product_is_not')->nullable();
      $table->foreignId('project_id')->constrained('projects')->onDelete('cascade');
      $table->timestamps();
    });
  }



  /**
   * Reverse the migrations.
   */
  public function down(): void
  {
    Schema::dropIfExists('product_canvas');
  }
};
