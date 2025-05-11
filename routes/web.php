<?php
use App\Http\Controllers\StoryController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ProjectController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use SebastianBergmann\CodeCoverage\Report\Xml\Project;

Route::get('/', function () {
  return Inertia::render('Welcome', [
    'canLogin' => Route::has('login'),
    'canRegister' => Route::has('register'),
    'laravelVersion' => Application::VERSION,
    'phpVersion' => PHP_VERSION,
  ]);
});


Route::prefix('projects')->group(function () {
  Route::get('/', [ProjectController::class, 'index'])
  ->name('projects.index');

  Route::post('create', [ProjectController::class, 'store'])
  ->name('projects.store');
  
  Route::get('/{id}',[ProjectController::class, 'show'])->name('projects.show');
})->middleware(['auth', 'verified']);


Route::middleware('auth')->group(function () {
  Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
  Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
  Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::get('/config', function () {
  return Inertia::render('Config');
})->middleware(['auth', 'verified'])->name('config');

Route::put('/stories/{story}', [StoryController::class, 'update'])->name('story.update');
Route::delete('/stories/{story}', [StoryController::class, 'destroy'])->name('story.delete');
Route::post('/stories', [StoryController::class, 'store']);

require __DIR__ . '/auth.php';
