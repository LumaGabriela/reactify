<?php

use App\Http\Controllers\ProjectController;

Route::prefix('projects')->group(function () {
    Route::get('/', ProjectController::class, 'index')->name('projects.index')->name('projects.index');
    
})->middleware(['auth', 'verified']);