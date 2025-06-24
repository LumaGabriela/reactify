<?php

namespace App\Observers;

use App\Events\ProjectUpdated;
use App\Models\Goal;


class GoalSketchObserver
{
  public function created(Goal $goal): void
  {
    $this->updateProject($goal);
  }
  public function updated(Goal $goal): void
  {
    $this->updateProject($goal);
  }
  public function deleted(Goal $goal): void
  {
    $this->updateProject($goal);
  }
  public function restored(Goal $goal): void
  {
    $this->updateProject($goal);
  }

  private function updateProject(Goal $goal): void
  {
    if ($goal->project) {
      broadcast(new ProjectUpdated($goal->project));
    }
  }
}
