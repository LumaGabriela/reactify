<?php

namespace App\Observers;

use App\Models\CrcCard;
use App\Events\ProjectUpdated;


class CrcCardObserver
{
  public function created(CrcCard $card): void
  {
    $this->updateProject($card);
  }
  public function updated(CrcCard $card): void
  {
    $this->updateProject($card);
  }
  public function deleted(CrcCard $card): void
  {
    $this->updateProject($card);
  }
  private function updateProject(CrcCard $card)
  {
    if ($card->project) {
      broadcast(new ProjectUpdated($card->project));
    }
  }
}
