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
        Schema::create('interviews', function (Blueprint $table) {
            $table->id();
            $table->foreignId('project_id')->constrained()->onDelete('cascade');
            $table->string('file_name'); // O nome original do ficheiro para exibição
            $table->string('file_path'); // A URL segura completa do Cloudinary
            $table->string('public_id')->nullable(); // O ID único do recurso no Cloudinary, usado para apagar
            $table->string('extraction_status')->default('pending');
            $table->longText('transcript')->nullable();
            $table->string('resource_type')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('interviews');
    }
};