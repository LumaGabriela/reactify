<?php

use Illuminate\Support\Facades\Broadcast;
use App\Models\Project;
use Illuminate\Support\Facades\Auth;

Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
  return (int) $user->id === (int) $id;
});

Broadcast::channel('project.{id}', function ($user, $id) {

  $project = Project::find($id);

  return Auth::check();
});
