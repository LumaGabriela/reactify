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
      $table->string('description');
      $table->string('issue');
      $table->string('solution');
      $table->string('persona');

      $table->string('restriction');
      $table->string('is');

      $table->foreignId('project_id')->constrained('projects');
      $table->timestamps();
    });

    //   Schema::create('canvas_personas', function (Blueprint $table) {
    //     $table->foreignId('product_canvas_id')->constrained('product_canvas');
    //   });

    //   Schema::create('canvas_solutions', function (Blueprint $table) {
    //     $table->foreignId('product_canvas_id')->constrained('product_canvas');
    //   });

    //   Schema::create('canvas_issues', function (Blueprint $table) {
    //     $table->foreignId('product_canvas_id')->constrained('product_canvas');
    //   });

    //   Schema::create('canvas_restrictions', function (Blueprint $table) {
    //     $table->foreignId('product_canvas_id')->constrained('product_canvas');
    //   });

    //   Schema::create('canvas_is', function (Blueprint $table) {
    //     $table->foreignId('product_canvas_id')->constrained('product_canvas');
    //   });

    //   Schema::create('canvas_is_not', function (Blueprint $table) {
    //     $table->foreignId('product_canvas_id')->constrained('product_canvas');
    //   });
  }



  /**
   * Reverse the migrations.
   */
  public function down(): void
  {
    Schema::dropIfExists('product_canvas');
    // Schema::dropIfExists('canvas_personas');
    // Schema::dropIfExists('canvas_solutions');
    // Schema::dropIfExists('canvas_issues');
    // Schema::dropIfExists('canvas_restrictions');
    // Schema::dropIfExists('canvas_is');
    // Schema::dropIfExists('canvas_is_not');
  }
};
