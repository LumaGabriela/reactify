<?php

namespace App\Observers;

use App\Events\ProjectUpdated;
use App\Models\UsageScenario;

class UsageScenarioObserver
{
  /**
   * Handle the UsageScenario "created" event.
   */
  public function created(UsageScenario $usageScenario): void
  {
    $this->updateProject($usageScenario);
  }

  public function updated(UsageScenario $usageScenario): void
  {
    $this->updateProject($usageScenario);
  }

  /**
   * Handle the UsageScenario "deleted" event.
   */
  public function deleted(UsageScenario $usageScenario): void
  {
    $this->updateProject($usageScenario);
  }

  /**
   * Handle the UsageScenario "restored" event.
   */
  public function restored(UsageScenario $usageScenario): void
  {
    $this->updateProject($usageScenario);
  }

  /**
   * Método privado para atualizar o projeto
   */
  private function updateProject(UsageScenario $usageScenario): void
  {
    // Verifica se a história está relacionada a um projeto
    if ($usageScenario->project) {

      broadcast(new ProjectUpdated($usageScenario->project));
    }
  }
}
