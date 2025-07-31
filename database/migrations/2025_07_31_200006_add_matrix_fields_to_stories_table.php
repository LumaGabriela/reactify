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
        Schema::table('stories', function (Blueprint $table) {
            // Represents the Y-axis (Value). Can be an integer for sorting.
            // Nullable for stories not yet placed on the matrix.
            $table->integer('value')->nullable()->after('status');

            // Represents the X-axis (Complexity). String for 'low', 'medium', 'high'.
            $table->string('complexity')->nullable()->after('value');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('stories', function (Blueprint $table) {
            $table->dropColumn(['value', 'complexity']);
        });
    }
};