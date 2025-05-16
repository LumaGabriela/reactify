<?php

use App\Http\Controllers\StoryController;
use App\Http\Controllers\GoalController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\PersonaController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::group(['middleware' => ['auth', 'verified']], function () {
  Route::get('/', [ProjectController::class, 'index'])->name('projects.index');

  Route::prefix('project')->group(function () {
    Route::post('/create', [ProjectController::class, 'store'])->name('project.store');
    Route::get('/{id}', [ProjectController::class, 'show'])->name('project.show');
    Route::put('/{id}/toggle-active', [ProjectController::class, 'toggleActive'])->name('project.toggle-active');
    Route::delete('/{id}', [ProjectController::class, 'destroy'])->name('project.destroy');
  });

  // Rotas para stories
  Route::prefix('story')->group(function () {
    Route::post('/', [StoryController::class, 'store'])->name('story.store');
    Route::patch('/{story}', [StoryController::class, 'update'])->name('story.update');
    Route::delete('/{story}', [StoryController::class, 'destroy'])->name('story.delete');
  });

  //Rotas para goals
  Route::prefix('goal')->group(function () {
    Route::post('/', [GoalController::class, 'store'])->name('goal.store');
    Route::patch('/{goal}', [GoalController::class, 'update'])->name('goal.update');
    Route::delete('/{goal}', [GoalController::class, 'destroy'])->name('goal.delete');
  });
  
  Route::prefix('persona')->group(function () {
    Route::post('/', [PersonaController::class, 'store'])->name('persona.store');
    Route::patch('/{persona}', [PersonaController::class, 'update'])->name('persona.update');
    Route::delete('/{persona}', [PersonaController::class, 'destroy'])->name('persona.delete');
  });

});







Route::middleware('auth')->group(function () {
  Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
  Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
  Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::get('/config', function () {
  return Inertia::render('Config');
})->middleware(['auth', 'verified'])->name('config');



require __DIR__ . '/auth.php';
