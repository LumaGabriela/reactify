<?php

use App\Http\Controllers\StoryController;
use App\Http\Controllers\GoalController;
use App\Http\Controllers\JourneyController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\PersonaController;
use App\Http\Controllers\ProductCanvasController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::group(['middleware' => ['auth', 'verified']], function () {
  Route::get('/dashboard', [ProjectController::class, 'index'])->name('projects.index');

  Route::prefix('project')->group(function () {
    Route::post('/create', [ProjectController::class, 'store'])->name('project.store');
    Route::get('/{project}/{page?}', [ProjectController::class, 'show'])->name('project.show');
    Route::patch('/{project}', [ProjectController::class, 'update'])->name('project.update');
    Route::patch('/{project}/toggle-active', [ProjectController::class, 'toggleActive'])->name('project.toggle-active');
    Route::delete('/{project}', [ProjectController::class, 'destroy'])->name('project.destroy');
  });

  // Rotas para stories
  Route::prefix('story')->group(function () {
    Route::post('/', [StoryController::class, 'store'])->name('story.store');
    Route::post('/bulk-store', [StoryController::class, 'bulk'])->name('story.bulk-store');
    Route::patch('/{story}', [StoryController::class, 'update'])->name('story.update');
    Route::delete('/{story}', [StoryController::class, 'destroy'])->name('story.delete');
  });

  //Rotas para goals
  Route::prefix('goal')->group(function () {
    Route::post('/', [GoalController::class, 'store'])->name('goal.store');
    Route::patch('/{goal}', [GoalController::class, 'update'])->name('goal.update');
    Route::delete('/{goal}', [GoalController::class, 'destroy'])->name('goal.delete');
  });
  //Rotas para journeys
  Route::prefix('journey')->group(function () {
    Route::post('/', [JourneyController::class, 'store'])->name('journey.store');
    Route::patch('/{journey}', [JourneyController::class, 'update'])->name('journey.update');
    Route::delete('/{journey}', [JourneyController::class, 'destroy'])->name('journey.delete');
    Route::post('/bulk-store', [JourneyController::class, 'bulk'])->name('journey.bulk-store');
  });
  Route::prefix('persona')->group(function () {
    Route::post('/', [PersonaController::class, 'store'])->name('persona.store');
    Route::patch('/{persona}', [PersonaController::class, 'update'])->name('persona.update');
    Route::delete('/{persona}', [PersonaController::class, 'destroy'])->name('persona.delete');
  });

  Route::prefix('product-canvas')->group(function () {
    Route::post('/', [ProductCanvasController::class, 'store'])->name('product-canvas.store');
    Route::patch('/{productCanvas}', [ProductCanvasController::class, 'update'])->name('product-canvas.update');
    Route::delete('/{productCanvas}', [ProductCanvasController::class, 'destroy'])->name('product-canvas.delete');
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

Route::get('/', function () {
    return Inertia::render('Welcome');
})->middleware('guest')->name('welcome');


require __DIR__ . '/auth.php';
