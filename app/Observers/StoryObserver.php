<?php

namespace App\Observers;

use App\Events\ProjectUpdated;
use App\Models\Story;
use App\Models\InvestCard;

class StoryObserver
{
  /**
   * Handle the Story "created" event.
   */
  public function created(Story $story): void
  {
    $this->updateProject($story);
    InvestCard::create([
      'story_id' => $story->id,
      'project_id' => $story->project_id,
      'independent' => false,
      'negotiable' => false,
      'valuable' => false,
      'estimable' => false,
      'small' => false,
      'testable' => false,
    ]);
  }

  public function updated(Story $story): void
  {
    $this->updateProject($story);
  }

  /**
   * Handle the Story "deleted" event.
   */
  public function deleted(Story $story): void
  {
    $this->updateProject($story);
  }

  /**
   * Handle the Story "restored" event.
   */
  public function restored(Story $story): void
  {
    $this->updateProject($story);
  }

  /**
   * Método privado para atualizar o projeto
   */
  private function updateProject(Story $story): void
  {
    // Verifica se a história está relacionada a um projeto
    if ($story->project) {

      broadcast(new ProjectUpdated($story->project));
    }
  }
}
