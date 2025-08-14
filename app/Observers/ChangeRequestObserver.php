<?php

namespace App\Observers;

use App\Events\ProjectUpdated;
use App\Models\ChangeRequest;

class ChangeRequestObserver
{
    /**
     * Handle the ChangeRequest "created" event.
     */
    public function created(ChangeRequest $changeRequest): void
    {
        $this->updateProject($changeRequest);
    }

    public function updated(ChangeRequest $changeRequest): void
    {
        $this->updateProject($changeRequest);
    }

    /**
     * Handle the ChangeRequest "deleted" event.
     */
    public function deleted(ChangeRequest $changeRequest): void
    {
        $this->updateProject($changeRequest);
    }

    /**
     * Handle the ChangeRequest "restored" event.
     */
    public function restored(ChangeRequest $changeRequest): void
    {
        $this->updateProject($changeRequest);
    }

    /**
     * Método privado para atualizar o projeto
     */
    private function updateProject(ChangeRequest $changeRequest): void
    {
        // Verifica se a solicitação está relacionada a um projeto
        if ($changeRequest->project) {
            broadcast(new ProjectUpdated($changeRequest->project));
        }
    }
}