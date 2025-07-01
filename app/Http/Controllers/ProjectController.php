<?php

namespace App\Http\Controllers;

use App\Events\ProjectDeleted;
use App\Events\ProjectUpdated;
use App\Http\Requests\ProjectRequest;
use App\Http\Requests\UpdateProjectRequest;
use App\Models\ProductCanvas;
use App\Models\Project;
use Illuminate\Http\Request;
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
      ]),
    ]);
  }

  public function index()
  {
    $projects = Project::all();

    return Inertia::render('Home', [
      'projects' => $projects,
    ]);
  }
  public function show(string $id)
  {
    $project = Project::with([
      'stories',
      'goal_sketches',
      'journeys',
      'personas',
      'product_canvas',
    ])->find($id);

    return Inertia::render('projects/Project', ['project' => $project]);
  }

  public function store(ProjectRequest $request)
  {

    $validatedData = $request->validated();

    $project = Project::create($validatedData);

    $productCanvas = ProductCanvas::create([
      'project_id' => $project->id
    ]);

    $project->active = true;

    $project->save();

    Log::info('Project created successfully: ' . $project->id . ' - ' . $project->title);

    broadcast(new ProjectUpdated($project));

    Log::info('Project created successfully: ' . $productCanvas->id . ' for Project: ' . $project->id);

    return redirect()
      ->route('project.show', $project->id)
      ->with(
        [
          'status' => 'success',
          'message' => 'Project created successfully. Project id: ' . $project->id,
        ]
      );
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

    return redirect()->route('projects.index')->with([
      'status' => 'success',
      'message' => 'Projeto excluído com sucesso.'
    ]);
  }

  public function toggleActive(string $id)
  {
    $project = Project::findOrFail($id);

    $project->active = !$project->active;
    $project->save();

    $statusMessage = $project->active ? 'Projeto ativado com sucesso.' : 'Projeto desativado com sucesso.';

    broadcast(new ProjectUpdated($project));

    Log::info('Project ' . ($project->active ? 'activated' : 'deactivated') . ' successfully: ' . $project->id . ' - ' . $project->title);

    return redirect()->back();
  }
}
