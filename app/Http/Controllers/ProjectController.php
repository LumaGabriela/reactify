<?php

namespace App\Http\Controllers;

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
  /**
   * Display a listing of the resource.
   */
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

    broadcast(new ProjectUpdated($project));

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

    return back()
      ->with([
        'status' => 'success',
        'message' => 'Project updated successfully.'
      ]);
  }

  /**
   * Remove the specified resource from storage.
   */
  public function destroy(string $id)
  {
    $project = Project::findOrFail($id);

    // Excluir registros relacionados
    $project->stories()->delete();
    // $project->goalSketches()->delete();
    // $project->journeys()->delete();
    // $project->productCanvas()->delete();
    // $project->personas()->delete();

    // Excluir o projeto
    $project->delete();

    broadcast(new ProjectUpdated($project));

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

    return redirect()->back()->with([
      'status' => 'success',
      'message' => $statusMessage
    ]);
  }
}
