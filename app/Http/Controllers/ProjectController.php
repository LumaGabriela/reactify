<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class ProjectController extends Controller
{
    public function show(Project $project)
    {
        return Inertia::render('Project', [
            'project' => $project->load('stories') // Carrega as stories relacionadas
        ]);
    }
}
