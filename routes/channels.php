<?php

use Illuminate\Support\Facades\Broadcast;
use Illuminate\Support\Facades\Auth;

Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
  return (int) $user->id === (int) $id;
});

Broadcast::channel('project.{id}', function ($user, $id) {

  return Auth::check();
});

// Broadcast::channel('projects', function ($user, $id) {

//   return Auth::check();
// });