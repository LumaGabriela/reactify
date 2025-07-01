<?php

namespace App\Observers;

use App\Events\ProjectUpdated;
use App\Models\Journey;

class JourneyObserver
{
  // public function created(Journey $journey): void
  // {
  //   $this->updateProject($journey);
  // }
  public function updated(Journey $journey): void
  {
    $this->updateProject($journey);
  }
  public function deleted(Journey $journey): void
  {
    $this->updateProject($journey);
  }
  public function restored(Journey $journey): void
  {
    $this->updateProject($journey);
  }

  private function updateProject(Journey $journey): void
  {
    if ($journey->project) {
      broadcast(new ProjectUpdated($journey->project));
    }
  }
}
