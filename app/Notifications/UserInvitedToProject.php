<?php

namespace App\Notifications;

use App\Models\Project;
use App\Models\ProjectInvitation;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class UserInvitedToProject extends Notification
{
  use Queueable;

  /**
   * Create a new notification instance.
   */
  public Project $project;
  public User $inviter;
  public function __construct(public ProjectInvitation $invitation)
  {
    $this->invitation = $invitation;
    $this->project = $invitation->project;
    $this->inviter = $invitation->inviter;
  }

  /**
   * Get the notification's delivery channels.
   *
   * @return array<int, string>
   */
  public function via(object $notifiable): array
  {
    return ['database', 'mail'];
  }

  /**
   * Get the mail representation of the notification.
   */
  public function toMail(object $notifiable): MailMessage
  {
    return (new MailMessage)
      ->subject('You have been invited to join the project.')
      ->markdown('emails.project-invitation', [
        'invitation' => $this->invitation,
      ]);
  }

  /**
   * Get the array representation of the notification.
   *
   * @return array<string, mixed>
   */
  public function toArray(object $notifiable): array
  {
    return [
      'message' => 'You have been invited by ' . $this->inviter->name . ' to join the project: ' . $this->invitation->project->title . '.',
      'project_id' => $this->invitation->project->id,
      'invitation_id' => $this->invitation->id,
      'inviter_name' => $this->inviter->name,
      'project_invitation_token' => $this->invitation->token,
    ];
  }
}
