<?php

use App\Mail\ProjectInvitationMail;
use App\Models\User;
use App\Models\Project;
use App\Models\ProjectInvitation;
use Illuminate\Support\Facades\Mail;

test('sending project invitation', function () {
  Mail::fake();

  // 2. Crie os dados necessários para este teste específico.
  $owner = User::factory()->create();
  $userToInvite = User::factory()->create();
  $project = Project::factory()->create();
  $project->users()->attach($owner->id, ['role' => 'admin']);

  $response = $this
    ->actingAs($owner)
    ->from(route('dashboard'))
    ->post(route('projects.invitations.store', $project->id), [
      'email' => $userToInvite->email,
      'role' => 'member',
    ]);

  $invite = ProjectInvitation::where('email', $userToInvite->email)->first();

  $response
    ->assertSessionHas('status', 'success')
    ->assertSessionHas('message', 'Invitation sent successfully')
    ->assertRedirect(route('dashboard'));

  $this->assertDatabaseHas('project_invitations', [
    'email' => $userToInvite->email,
    'project_id' => $project->id,
    'role' => 'member',
  ]);

  Mail::assertSent(ProjectInvitationMail::class, function ($mail) use ($userToInvite) {
    return $mail->hasTo($userToInvite->email);
  });
});
