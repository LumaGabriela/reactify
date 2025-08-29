<?php

namespace App\Http\Controllers;

use App\Events\ProjectDeleted;
use App\Events\ProjectUpdated;
use App\Http\Requests\ProjectRequest;
use App\Http\Requests\UpdateProjectRequest;
use App\Models\ProductCanvas;
use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;

class ProjectController extends Controller
{
  public function getUpdatedProject(Project $project)
  {
    return response()->json([
      'project' => $project->load([
        'stories',
        'goal_sketches',
        'journeys',
        'personas',
        'product_canvas',
        'crc_cards',
        'overall_model_classes',
        'prioritizations',
        'matrix_priorities',
        'sprints.stories',
        'epic_stories',
        'business_rules',
        'change_requests',
        'invest_cards',
        'usage_scenarios',
        'system_interfaces'
      ]),
    ]);
  }

  public function getUpdatedProjects(Request $request): JsonResponse
  {
    $validated = $request->validate([
      'ids' => 'required|array',
      'ids.*' => 'integer|exists:projects,id',
    ]);

    $projects = Project::whereIn('id', $validated['ids'])->get();

    return response()->json([
      'projects' => $projects->load([
        'stories',
        'goal_sketches',
        'journeys',
        'personas',
        'product_canvas',
        'crc_cards',
        'overall_model_classes',
        'prioritizations',
        'matrix_priorities',
        'sprints.stories',
        'epic_stories',
        'business_rules',
        'change_requests',
        'invest_cards',
        'usage_scenarios',
        'system_interfaces'
      ]),
      'message' => 'Projects updated successfully.',
      'status' => 'success',
    ]);
  }
  public function index()
  {
    return Inertia::render('Home');
  }
  public function show(Project $project, string $page = 'inception')
  {
    $user = Auth::user();

    if (!$project->users()->where('users.id', $user->id)->exists()) {
      abort(403, 'Acesso não autorizado a este projeto.');
    }

    $project->load([
      'stories',
      'goal_sketches',
      'journeys',
      'personas',
      'product_canvas',
      'crc_cards',
      'overall_model_classes',
      'prioritizations',
      'matrix_priorities',
      'sprints.stories',
      'epic_stories',
      'business_rules',
      'change_requests',
      'invest_cards',
      'usage_scenarios',
      'system_interfaces',
      'users' => function ($query) {
        $query->select(['user_id', 'name', 'email', 'provider_avatar']);
      }
    ]);

    return Inertia::render('projects/Project', [
      'project' => $project,
      'page' => $page,
    ]);
  }

  public function store(ProjectRequest $request)
  {
    $validatedData = $request->validated();

    $project = Project::create($validatedData);

    $user = Auth::user();
    // Associa o usuário autenticado como o "dono" (admin) do projeto.
    if ($project && $user) {
      // Vincula o usuário ao projeto com o papel de 'admin'
      $project->users()->attach($user->id, ['role' => 'admin']);
    }

    $productCanvas = ProductCanvas::create([
      'project_id' => $project->id,
    ]);

    $project->active = true;

    $project->save();

    Log::info('Project created successfully: ' . $project->id . ' - ' . $project->title);

    broadcast(new ProjectUpdated($project));

    Log::info('Project created successfully: ' . $productCanvas->id . ' for Project: ' . $project->id);

    return redirect()
      ->route('project.show', $project->id)
      ->with([
        'status' => 'success',
        'message' => 'Project created successfully. Project id: ' . $project->id,
      ]);
  }

  public function update(UpdateProjectRequest $request, Project $project)
  {
    $validated = $request->validated();

    $project->update($validated);

    broadcast(new ProjectUpdated($project));

    Log::info('Project updated successfully: ' . $project->id . ' - ' . $project->title);

    return back();
  }

  /**
   * Remove the specified resource from storage.
   */
  public function destroy(string $id)
  {
    $project = Project::findOrFail($id);

    broadcast(new ProjectDeleted($project));

    // Excluir o projeto
    $project->delete();

    Log::info('Project deleted successfully: ' . $project->id . ' - ' . $project->title);

    return redirect()
      ->route('dashboard')
      ->with([
        'status' => 'success',
        'message' => 'Projeto excluído com sucesso.',
      ]);
  }

  public function toggleActive(string $id)
  {
    $project = Project::findOrFail($id);

    $project->active = !$project->active;
    $project->save();

    $statusMessage = $project->active ? 'Projeto ativado com sucesso.' : 'Projeto desativado com sucesso.';

    broadcast(new ProjectUpdated($project));

    Log::info(
      'Project ' .
        ($project->active ? 'activated' : 'deactivated') .
        ' successfully: ' .
        $project->id .
        ' - ' .
        $project->title
    );

    return redirect()->back();
  }
}
