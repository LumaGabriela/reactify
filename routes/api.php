<?php

use App\Http\Controllers\StoryGeneratorController;
use App\Http\Controllers\StoryGeneratorControllerGemini;
use App\Http\Controllers\JourneyGeneratorController;
use App\Http\Controllers\ProjectController;

//Route::post('/stories/generate', [StoryGeneratorController::class, 'generateStories'])->name('story.generate');
Route::post('/stories/generate', [StoryGeneratorControllerGemini::class, 'generateStories'])->name('story.generate');

Route::post('/journeys/generate', [JourneyGeneratorController::class, 'generateJourneys'])->name('journey.generate');

Route::get('/project/{project}', [ProjectController::class, 'getUpdatedProject'])->name('project.updated');

Route::get('/projects', [ProjectController::class, 'getUpdatedProjects'])->name('projects.updated');
