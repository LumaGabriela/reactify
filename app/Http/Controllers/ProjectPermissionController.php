<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ProjectPermissionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Project $project)
    {
        // Futuramente, você deve adicionar uma Policy para garantir que o usuário atual tem permissão para ver as permissões
        // $this->authorize('viewPermissions', $project);

        $users = $project->users()->get()->map(function ($user) {
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
        // Futuramente, você deve adicionar uma Policy para garantir que o usuário atual tem permissão para atualizar
        // $this->authorize('updatePermissions', $project);

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

        return response()->json(['message' => 'Permissions updated successfully.']);
    }
}