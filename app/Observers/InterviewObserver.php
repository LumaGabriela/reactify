<?php

namespace App\Observers;

use App\Events\ProjectUpdated;
use App\Models\Interview;

class InterviewObserver
{
    public function created(Interview $interview): void
    {
        $this->updateProject($interview);
    }

    public function deleted(Interview $interview): void
    {
        $this->updateProject($interview);
    }

    private function updateProject(Interview $interview): void
    {
        if ($interview->project) {
            broadcast(new ProjectUpdated($interview->project));
        }
    }
}