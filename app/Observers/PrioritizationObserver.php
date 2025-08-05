<?php

namespace App\Observers;

use App\Events\ProjectUpdated;
use App\Models\Prioritization;

class PrioritizationObserver
{
  /**
   * Handle the Story "created" event.
   */
  public function created(Prioritization $matrix): void
  {
    $this->updateProject($matrix);
  }

  public function updated(Prioritization $matrix): void
  {
    $this->updateProject($matrix);
  }

  /**
   * Handle the Story "deleted" event.
   */
  public function deleted(Prioritization $matrix): void
  {
    $this->updateProject($matrix);
  }

  /**
   * Handle the Story "restored" event.
   */
  public function restored(Prioritization $matrix): void
  {
    $this->updateProject($matrix);
  }

  /**
   * Método privado para atualizar o projeto
   */
  private function updateProject(Prioritization $matrix): void
  {
    // Verifica se a história está relacionada a um projeto
    if ($matrix->project) {

      broadcast(new ProjectUpdated($matrix->project));
    }
  }
}
