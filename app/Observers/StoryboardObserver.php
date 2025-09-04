<?php

namespace App\Observers;

use App\Events\ProjectUpdated;
use App\Models\Storyboard;

class StoryboardObserver
{
  /**
   * Handle the Storyboard "created" event.
   */
  public function created(Storyboard $storyboard): void
  {
    $this->updateProject($storyboard);
  }

  public function updated(Storyboard $storyboard): void
  {
    $this->updateProject($storyboard);
  }

  /**
   * Handle the Storyboard "deleted" event.
   */
  public function deleted(Storyboard $storyboard): void
  {
    $this->updateProject($storyboard);
  }

  /**
   * Handle the Storyboard "restored" event.
   */
  public function restored(Storyboard $storyboard): void
  {
    $this->updateProject($storyboard);
  }

  /**
   * Método privado para atualizar o projeto
   */
  private function updateProject(Storyboard $storyboard): void
  {
    // Verifica se a história está relacionada a um projeto
    if ($storyboard->project) {

      broadcast(new ProjectUpdated($storyboard->project));
    }
  }
}
