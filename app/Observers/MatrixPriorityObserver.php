<?php

namespace App\Observers;

use App\Events\ProjectUpdated;
use App\Models\MatrixPriority;

class MatrixPriorityObserver
{
  /**
   * Handle the MatrixPriority "created" event.
   */
  public function created(MatrixPriority $matrixPriority): void
  {
    $this->updateProject($matrixPriority);
  }

  public function updated(MatrixPriority $matrixPriority): void
  {
    $this->updateProject($matrixPriority);
  }

  /**
   * Handle the MatrixPriority "deleted" event.
   */
  public function deleted(MatrixPriority $matrixPriority): void
  {
    $this->updateProject($matrixPriority);
  }

  /**
   * Handle the MatrixPriority "restored" event.
   */
  public function restored(MatrixPriority $matrixPriority): void
  {
    $this->updateProject($matrixPriority);
  }

  /**
   * Método privado para atualizar o projeto
   */
  private function updateProject(MatrixPriority $matrixPriority): void
  {
    // Verifica se a história está relacionada a um projeto
    if ($matrixPriority->project) {

      broadcast(new ProjectUpdated($matrixPriority->project));
    }
  }
}
