<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProjectRequest;
use App\Models\Project;
use Illuminate\Http\Request;
use Inertia\Inertia;

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
        $project = Project::with('stories')->find($id);
        $project = Project::with('goal_sketches')->find($id);
        return Inertia::render('projects/Project', ['project' => $project]);
    }


    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(ProjectRequest $request)
    {

        $validatedData = $request->validated();
        $project = Project::create($validatedData);
        $project->active = true;
        $project->save();

        return redirect()
            ->route('project.show', $project->id)
            ->with(
                [
                    'status' => 'success',
                    'message' => 'Project created successfully. Project id: ' . $project->id,
                ]
            );
    }


    public function update(Request $request, string $id)
    {
        //
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
