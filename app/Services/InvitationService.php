<?php

namespace App\Services;

use App\Models\ProjectInvitation;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class InvitationService
{
  /**
   * Processa a aceitação de um convite, incluindo todas as validações.
   *
   * @param ProjectInvitation $invitation
   * @return array{'user': User, 'project': \App\Models\Project}
   * @throws Exeption
   */

  public function acceptInvitation(ProjectInvitation $invitation): array
  {
    $project = $invitation->project;

    if ($invitation->isExpired()) {
      return ['message' => 'Invitation expired', 'status' => 'error'];
    }
    if (!$invitation->isPending()) {
      return ['message' => 'This invitation is not active', 'status' => 'error'];
    }
    if ($project->users()->where('email', $invitation->email)->exists()) {
      $invitation->accept(); // Marca como aceito, pois a ação foi concluída
      return ['status' => 'info', 'message' => 'You are already a member of this project.'];
    }

    $user = User::where('email', $invitation->email)->first();
    if (!$user) {
      return ['message' => 'User not found, please register', 'status' => 'error',  'redirect_to' => 'register'];
    }

    $invitation->accept();

    $project->users()->attach($user->id, ['role' => $invitation->role]);

    return ['message' => 'Invitation accepted successfully', 'status' => 'success', 'data' => ['user' => $user, 'project' => $project]];
  }

  public function declineInvitation(ProjectInvitation $invitation): array
  {
    if (!$invitation->isPending()) {
      return ['message' => 'This invitation is not active', 'status' => 'error'];
    }
    if ($invitation->isExpired()) {
      return ['message' => 'Invitation expired', 'status' => 'error'];
    }

    $invitation->decline();

    return ['message' => 'Invitation declined successfully', 'status' => 'success'];
  }
}
