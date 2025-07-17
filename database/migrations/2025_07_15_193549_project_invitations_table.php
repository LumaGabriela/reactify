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
    Schema::create("project_invitations", function (Blueprint $table) {
      $table->id();
      $table->foreignId('project_id')->constrained();
      $table->foreignId('inviter_id')->constrained('users')->onDelete('cascade');
      $table->string('email');
      $table->string('role');
      $table->string('token');
      $table->string('status');
      $table->timestamp('expires_at');
      $table->timestamps();
      $table->softDeletes();
    });
  }

  /**
   * Reverse the migrations.
   */
  public function down(): void
  {
    Schema::dropIfExists('projecct_invitations');
  }
};
