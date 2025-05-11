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

        return redirect()
        ->route('projects.show', $project->id)
        ->with(
            [
                'status' => 'success',
                'message' => 'Project created successfully. Project id: ' . $project->id,
            ]
        );
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $project = Project::with('stories')->find($id);
        return Inertia::render('projects/Project', ['project' => $project]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {

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
