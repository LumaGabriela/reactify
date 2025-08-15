<?php

namespace App\Observers;

use App\Events\ProjectUpdated;
use App\Models\InvestCard;

class InvestCardObserver
{
  /**
   * Handle the InvestCard "created" event.
   */
  public function created(InvestCard $investCard): void
  {
    $this->updateProject($investCard);
  }

  public function updated(InvestCard $investCard): void
  {
    $this->updateProject($investCard);
  }

  /**
   * Handle the InvestCard "deleted" event.
   */
  public function deleted(InvestCard $investCard): void
  {
    $this->updateProject($investCard);
  }

  /**
   * Handle the InvestCard "restored" event.
   */
  public function restored(InvestCard $investCard): void
  {
    $this->updateProject($investCard);
  }

  /**
   * Método privado para atualizar o projeto
   */
  private function updateProject(InvestCard $investCard): void
  {
    // Verifica se a história está relacionada a um projeto
    if ($investCard->project) {

      broadcast(new ProjectUpdated($investCard->project));
    }
  }
}
