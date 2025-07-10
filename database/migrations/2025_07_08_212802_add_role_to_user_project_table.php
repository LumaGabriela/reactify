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
        Schema::table('user_project', function (Blueprint $table) {
            $table->string('role')->default('viewer'); // Adiciona a coluna 'role' com um valor padrão
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('user_project', function (Blueprint $table) {
            $table->dropColumn('role'); // Permite reverter a migration
        });
    }
};