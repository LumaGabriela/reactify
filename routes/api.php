<?php

use App\Http\Controllers\AIController;

Route::post('/ai/generate', [AIController::class, 'generateStory'])->name('story.generate');
