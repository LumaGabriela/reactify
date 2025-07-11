<?php

use App\Http\Controllers\ProjectController;

Route::prefix('projects')->group(function () {
  Route::get('/', ProjectController::class, 'index')->name('dashboard')->name('dashboard');
})->middleware(['auth', 'verified']);
