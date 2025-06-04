<?php

use App\Http\Controllers\AIController;
use App\Http\Controllers\JourneyGeneratorController;

Route::post('/ai/generate', [AIController::class, 'generateStory'])->name('story.generate');

Route::post('/journeys/generate', [JourneyGeneratorController::class, 'generateJourneys']);