<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Project;
use App\Models\Story;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class PrioritizationMatrixController extends Controller
{
    /**
     * Updates the prioritization (value and complexity) of multiple stories
     * for a given project.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Project  $project
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, Project $project)
    {
        // Ensure the user is authorized to update the project
        // Gate::authorize('update', $project);

        $validated = $request->validate([
            'stories' => 'required|array',
            'stories.*.id' => 'required|integer|exists:stories,id',
            'stories.*.value' => 'nullable|integer|min:0',
            'stories.*.complexity' => ['nullable', 'string', Rule::in(['low', 'medium', 'high'])],
        ]);

        try {
            DB::transaction(function () use ($validated, $project) {
                foreach ($validated['stories'] as $storyData) {
                    // Find the story within the project for security
                    $story = Story::where('id', $storyData['id'])
                                  ->where('project_id', $project->id)
                                  ->firstOrFail();

                    // Update the prioritization fields
                    $story->update([
                        'value' => $storyData['value'] ?? null,
                        'complexity' => $storyData['complexity'] ?? null,
                    ]);
                }
            });

            // Load the relations to ensure the frontend has the latest data after redirect
            $project->load('stories', 'goal_sketches');
            
            // On success, redirect back to the previous page.
            // Inertia will automatically receive the updated project data.
            return redirect()->back()->with([
                'status' => 'success',
                'message' => 'Matriz de priorização salva com sucesso!',
            ]);

        } catch (\Exception $e) {
            // Log the exception details in a real application
            return redirect()->back()->withErrors(['save' => 'Erro ao salvar a matriz de priorização.']);
        }
    }
}