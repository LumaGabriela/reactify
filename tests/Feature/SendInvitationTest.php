<?php

use App\Models\User;
use App\Models\Project;
use App\Models\ProjectInvitation;
use App\Notifications\UserInvitedToProject;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Notification;

test('sending project invitation notification', function () {

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

  //testa o armazenamento do convite no banco de dados
  $this
    ->assertDatabaseHas('notifications', [
      'notifiable_id' => $userToInvite->id,
      'type' => UserInvitedToProject::class,
    ])
    ->assertDatabaseHas('project_invitations', [
      'email' => $userToInvite->email,
      'project_id' => $project->id,
      'role' => 'member',
    ]);
});

test('sending project invitation notification ', function () {
  Notification::fake();

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
  //testa o envio do e-mail
  Notification::assertSentTo(
    $userToInvite,
    UserInvitedToProject::class,
    function ($notification, $channels) use ($userToInvite, $project) {
      $this->assertContains('mail', $channels, 'o canal de email nao foi usado');
      $this->assertContains('database', $channels, 'o canal de banco de dados nao foi usado');

      $mailData = $notification->toMail($userToInvite);
      // dump($mailData);

      $dbData = $notification->toArray($userToInvite);
      // dump($dbData);

      return true;
    }
  );

  $response
    ->assertSessionHas('status', 'success')
    ->assertSessionHas('message', 'Invitation sent successfully')
    ->assertRedirect(route('dashboard'));

  //testa o armazenamento do convite no banco de dados
  $this
    ->assertDatabaseHas('project_invitations', [
      'email' => $userToInvite->email,
      'project_id' => $project->id,
      'role' => 'member',
    ]);
});
