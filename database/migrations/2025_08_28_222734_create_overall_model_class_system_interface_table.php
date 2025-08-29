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
    Schema::create('overall_model_class_system_interface', function (Blueprint $table) {
      $table->primary(['overall_model_class_id', 'system_interface_id']);
      $table->foreignId('overall_model_class_id')->constrained()->onDelete('cascade');
      $table->foreignId('system_interface_id')->constrained()->onDelete('cascade');
      $table->timestamps();
    });
  }

  /**
   * Reverse the migrations.
   */
  public function down(): void
  {
    Schema::dropIfExists('overall_model_class_system_interface');
  }
};
