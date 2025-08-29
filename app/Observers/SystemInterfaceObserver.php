<?php

namespace App\Observers;

use App\Events\ProjectUpdated;
use App\Models\SystemInterface;

class SystemInterfaceObserver
{
  /**
   * Handle the SystemInterface "created" event.
   */
  public function created(SystemInterface $systemInterface): void
  {
    $this->updateProject($systemInterface);
  }

  public function updated(SystemInterface $systemInterface): void
  {
    $this->updateProject($systemInterface);
  }

  /**
   * Handle the SystemInterface "deleted" event.
   */
  public function deleted(SystemInterface $systemInterface): void
  {
    $this->updateProject($systemInterface);
  }

  /**
   * Handle the SystemInterface "restored" event.
   */
  public function restored(SystemInterface $systemInterface): void
  {
    $this->updateProject($systemInterface);
  }

  /**
   * Método privado para atualizar o projeto
   */
  private function updateProject(SystemInterface $systemInterface): void
  {
    // Verifica se a história está relacionada a um projeto
    if ($systemInterface->project) {

      broadcast(new ProjectUpdated($systemInterface->project));
    }
  }
}
