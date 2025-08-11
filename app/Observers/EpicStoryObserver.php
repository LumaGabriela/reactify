<?php

namespace App\Observers;

use App\Events\ProjectUpdated;
use App\Models\EpicStory;

class EpicStoryObserver
{
  /**
   * Handle the EpicStory "created" event.
   */
  public function created(EpicStory $epicStory): void
  {
    $this->updateProject($epicStory);
  }

  public function updated(EpicStory $epicStory): void
  {
    $this->updateProject($epicStory);
  }

  /**
   * Handle the EpicStory "deleted" event.
   */
  public function deleted(EpicStory $epicStory): void
  {
    $this->updateProject($epicStory);
  }

  /**
   * Handle the EpicStory "restored" event.
   */
  public function restored(EpicStory $epicStory): void
  {
    $this->updateProject($epicStory);
  }

  /**
   * Método privado para atualizar o projeto
   */
  private function updateProject(EpicStory $epicStory): void
  {
    // Verifica se a história está relacionada a um projeto
    if ($epicStory->project) {

      broadcast(new ProjectUpdated($epicStory->project));
    }
  }
}
