<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Home');
});
Route::get('/projects/{id}', function () {
  return Inertia::render('projects/Project', [ "id" => 1]);
});