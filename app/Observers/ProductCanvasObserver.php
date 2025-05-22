<?php

namespace App\Observers;

use App\Models\ProductCanvas;
use App\Events\ProjectUpdated;


class ProductCanvasObserver
{
  public function updated(ProductCanvas $productCanvas): void
  {
    $this->updateProject($productCanvas);
  }

  private function updateProject(ProductCanvas $productCanvas)
  {
    if ($productCanvas->project) {
      broadcast(new ProjectUpdated($productCanvas->project));
    }
  }
}
