<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\ProjectInvitation;
use App\Models\User;
use App\Mail\ProjectInvitationMail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

class ProjectInvitationController extends Controller
{
  public function store(Request $request, Project $project)
  {

    $validated = $request->validate([
      'email' => 'required|email|exists:users,email',
      'role' => 'required|in:member,admin,viewer'
    ]);

    $user = $request->user();

    $currentProject = $user->projects()->where('projects.id', $project->id)->first();

    if (!$currentProject) {
      return back()->with(['message' => 'You are not participating in this project', 'status' => 'error']);
    };

    if ($currentProject->pivot->role !== 'admin') {
      return back()->with(['message' => 'You are not authorized to invite users', 'status' => 'error']);
    }
    if ($project->users()->where('email', $validated['email'])->exists()) {
      return back()->with(['message' => 'User already exists in project', 'status' => 'error']);
    }

    $isPending = ProjectInvitation::where('email', $validated['email'])
      ->where('status', 'pending')
      ->where('project_id', $project->id)
      ->where('expires_at', '>', now())
      ->exists();

    if ($isPending) {
      return back()->with(['message' => 'User already invited', 'status' => 'error']);
    }

    $invitation = ProjectInvitation::create([
      'email' => $validated['email'],
      'project_id' => $project->id,
      'inviter_id' => $user->id,
      'role' => $validated['role'],
      'status' => 'pending',
      'token' => Str::uuid(),
      'expires_at' => now()->addDays(7),
    ]);

    Mail::to($validated['email'])->send(new ProjectInvitationMail($invitation));

    return back()->with(['message' => 'Invitation sent successfully', 'status' => 'success']);
  }

  public function accept(ProjectInvitation $invitation) {}

  public function reject(ProjectInvitation $invitation) {}
}
