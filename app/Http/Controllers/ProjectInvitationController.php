<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\ProjectInvitation;
use App\Mail\ProjectInvitationMail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class ProjectInvitationController extends Controller
{
  public function store(Request $request, Project $project)
  {
    $user = $request->user();
    $validated = $request->validate([
      'email' => 'required|email|exists:users,email',
      'role' => 'required|in:member,admin,viewer'
    ]);
    // dd($user->role->name);

    if ($user->role->name != 'admin') {
      return back()->with(['message' => 'You are not authorized to invite users', 'status' => 'error']);
    }
    if ($project->users()->where('email', $validated['email'])->exists()) {
      return back()->with(['message' => 'User already exists in project', 'status' => 'error']);
    }


    // Mail::to($validated['email'])->send(new ProjectInvitationMail($project, $validated['role']));
  }

  public function accept(ProjectInvitation $invitation) {}

  public function reject(ProjectInvitation $invitation) {}
}
