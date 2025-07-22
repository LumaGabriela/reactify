<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\User;
use App\Notifications\ProjectInvitation;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Notification;

class ProjectPermissionController extends Controller
{
  /**
   * Display a listing of the resource.
   */
  public function index(Project $project)
  {
    // Futuramente, você deve adicionar uma Policy para garantir que o usuário atual tem permissão para ver as permissões
    // $this->authorize('viewPermissions', $project);

    $users = $project
      ->users()
      ->get()
      ->map(function ($user) {
        return [
          'id' => $user->id,
          'name' => $user->name,
          'email' => $user->email,
          'role' => $user->pivot->role, // 'role' é a coluna na tabela pivo 'user_project'
        ];
      });

    return response()->json($users);
  }

  /**
   * Update the specified resource in storage.
   */
  public function update(Request $request, Project $project)
  {


    $validated = $request->validate([
      'users' => 'required|array',
      'users.*.id' => 'required|exists:users,id',
      'users.*.role' => 'required|string|in:admin,editor,viewer', // Adapte os papéis conforme necessário
    ]);

    $syncData = [];

    foreach ($validated['users'] as $user) {
      $syncData[$user['id']] = ['role' => $user['role']];
    }

    $project->users()->sync($syncData);

    $users = User::all();

    Notification::send($users, new ProjectInvitation($project));

    return back()->with([
      'message' => 'Permissions updated successfully.',
      'status' => 'success',
    ]);
  }

  public function addMember(Request $request, Project $project)
  {
    $validated = $request->validate([
      'role' => 'required|string|in:admin,editor,viewer',
      'email' => 'required|email|exists:users,email',
    ]);

    $newMember = User::where('email', $request->email)->first();

    if (!$newMember) {
      return back()->with([
        'message' => 'User not found.',
        'status' => 'error',
      ]);
    }

    $project->users()->attach($newMember->id, ['role' => $validated['role']]);

    return back()->with([
      'message' => 'User added successfully.',
      'status' => 'success',
    ]);
  }

  public function removeMember(Request $request, Project $project)
  {
    $validated = $request->validate([
      'id' => 'required|exists:users,id',
    ]);

    $currentMember = User::find($validated['id']);

    $project->users()->detach($currentMember->id);

    return back()->with([
      'message' => 'User removed from the project successfully.',
      'status' => 'success',
    ]);
  }
}
