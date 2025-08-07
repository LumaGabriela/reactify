<?php

namespace App\Http\Controllers;

use App\Models\Sprint;
use App\Models\Story;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;


class SprintController extends Controller
{
    public function index()
    {
        $sprints = Sprint::with(['stories' => function($query) {
            $query->withPivot(['kanban_status', 'position']);
        }])
        ->orderBy('start_date', 'desc')
        ->get();
        
        return back()->with([
            'sprints' => $sprints,
            'message' => 'Sprints loaded successfully',
            'status' => 'success'
        ]);
    }

    public function show(Sprint $sprint)
    {
        $sprint->load(['stories' => function($query) {
            $query->withPivot(['kanban_status', 'position']);
        }]);

        return back()->with([
            'sprint' => $sprint,
            'status' => 'success'
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
            'status' => 'sometimes|in:planning,active,completed',
            'project_id' => 'required|exists:projects,id'
        ]);

        $sprint = Sprint::create($validated);
        Log::info('Sprint created successfully: ' . $sprint->id . ' - ' . $sprint->name);
        
        return back()->with([
            'message' => 'Sprint created successfully',
            'status' => 'success'
        ]);
    }

    // Adicionar stories à sprint (mover do Product Backlog para Sprint Backlog)
    public function addStories(Request $request, Sprint $sprint)
    {
        $validated = $request->validate([
            'story_ids' => 'required|array',
            'story_ids.*' => 'exists:stories,id'
        ]);

        foreach ($validated['story_ids'] as $storyId) {
            // Verifica se a story já está na sprint
            if (!$sprint->stories()->where('story_id', $storyId)->exists()) {
                $sprint->stories()->attach($storyId, [
                    'kanban_status' => 'todo',
                    'position' => 0
                ]);

                // Atualiza o status da story
                Story::where('id', $storyId)->update([
                    'status' => 'in_progress'
                ]);
            }
        }

        return back()->with([
            'message' => 'Stories added to sprint successfully',
            'status' => 'success'
        ]);
    }

    // Remover story da sprint
    public function removeStory(Sprint $sprint, $storyId)
    {
        $sprint->stories()->detach($storyId);
        
        // Retorna a story para o product backlog
        Story::where('id', $storyId)->update([
            'status' => 'prioritized'
        ]);

        return back()->with([
            'message' => 'Story removed from sprint',
            'status' => 'success'
        ]);
    }

    // Atualizar status no Kanban
    public function updateStoryKanbanStatus(Request $request, Sprint $sprint)
    {
        $validated = $request->validate([
            'story_id' => 'required|exists:stories,id',
            'kanban_status' => 'required|in:todo,in_progress,testing,done',
            'position' => 'sometimes|integer|min:0'
        ]);

        $sprint->stories()->updateExistingPivot($validated['story_id'], [
            'kanban_status' => $validated['kanban_status'],
            'position' => $validated['position'] ?? 0
        ]);

        // Se a story foi movida para "done", considere atualizar o status
        if ($validated['kanban_status'] === 'done') {
            Story::where('id', $validated['story_id'])->update([
                'status' => 'done'
            ]);
        }

        return back()->with([
            'message' => 'Story status updatedd',
            'status' => 'success'
        ]);
    }

    public function destroy(Sprint $sprint)
    {
        // Antes de deletar, retorna todas as stories para o product backlog
        $storyIds = $sprint->stories()->pluck('story_id');
        
        Story::whereIn('id', $storyIds)->update([
            'status' => 'prioritized'
        ]);

        $sprint->delete();
        
        return back()->with([
            'message' => 'Sprint deleted successfully',
            'status' => 'success'
        ]);
    }
}