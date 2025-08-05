<?php

namespace App\Observers;

use App\Events\ProjectUpdated;
use App\Models\Priorization;
use Illuminate\Support\Facades\Log;

class PriorizationObserver
{
  /**
   * Handle the Story "created" event.
   */
  public function created(Priorization $matrix): void
  {
    $this->updateProject($matrix);
  }

  public function updated(Priorization $matrix): void
  {
    $this->updateProject($matrix);
  }

  /**
   * Handle the Story "deleted" event.
   */
  public function deleted(Priorization $matrix): void
  {
    $this->updateProject($matrix);
  }

  /**
   * Handle the Story "restored" event.
   */
  public function restored(Priorization $matrix): void
  {
    $this->updateProject($matrix);
  }

  /**
   * Método privado para atualizar o projeto
   */
  private function updateProject(Priorization $matrix): void
  {
    // Verifica se a história está relacionada a um projeto
    if ($matrix->project) {

      broadcast(new ProjectUpdated($matrix->project));
    }
  }
}
