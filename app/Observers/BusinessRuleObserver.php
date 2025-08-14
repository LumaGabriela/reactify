<?php

namespace App\Observers;

use App\Events\ProjectUpdated;
use App\Models\BusinessRule;

class BusinessRuleObserver
{
  /**
   * Handle the BusinessRule "created" event.
   */
  public function created(BusinessRule $businessRule): void
  {
    $this->updateProject($businessRule);
  }

  public function updated(BusinessRule $businessRule): void
  {
    $this->updateProject($businessRule);
  }

  /**
   * Handle the BusinessRule "deleted" event.
   */
  public function deleted(BusinessRule $businessRule): void
  {
    $this->updateProject($businessRule);
  }

  /**
   * Handle the BusinessRule "restored" event.
   */
  public function restored(BusinessRule $businessRule): void
  {
    $this->updateProject($businessRule);
  }

  /**
   * Método privado para atualizar o projeto
   */
  private function updateProject(BusinessRule $businessRule): void
  {
    // Verifica se a história está relacionada a um projeto
    if ($businessRule->project) {

      broadcast(new ProjectUpdated($businessRule->project));
    }
  }
}
