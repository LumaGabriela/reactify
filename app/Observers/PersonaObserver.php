<?php

namespace App\Observers;

use App\Events\ProjectUpdated;
use App\Models\Persona;

class PersonaObserver
{
  public function created(Persona $persona): void
  {
    $this->updateProject($persona);
  }
  public function updated(Persona $persona): void
  {
    $this->updateProject($persona);
  }

  public function deleted(Persona $persona): void
  {
    $this->updateProject($persona);
  }

  public function restored(Persona $persona): void
  {
    $this->updateProject($persona);
  }
  private function updateProject(Persona $persona): void
  {
    if ($persona->project) {
      broadcast(new ProjectUpdated($persona->project));
    }
  }
}
