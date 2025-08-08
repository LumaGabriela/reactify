<?php

namespace App\Http\Controllers;

use App\Models\Sprint;
use App\Models\Story;
use App\Models\StorySprint;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class StorySprintController extends Controller
{
    /**
     * Adicionar stories à sprint
     */
    public function store(Request $request, Sprint $sprint)
    {
        $validated = $request->validate([
            'story_ids' => 'required|array',
            'story_ids.*' => 'exists:stories,id'
        ]);

        foreach ($validated['story_ids'] as $storyId) {
            if (!$sprint->stories()->where('story_id', $storyId)->exists()) {
                $sprint->stories()->attach($storyId, [
                    'kanban_status' => 'todo',
                    'position' => 0
                ]);

                Story::where('id', $storyId)->update([
                    'status' => 'in_progress'
                ]);

                Log::info("Story {$storyId} added to sprint {$sprint->id}");
            }
        }

        return back()->with([
            'message' => 'Stories added to sprint successfully',
            'status' => 'success'
        ]);
    }

    /**
     * Remover story da sprint
     */
    public function destroy(Sprint $sprint, $storyId)
    {
        $sprint->stories()->detach($storyId);
        
        Story::where('id', $storyId)->update([
            'status' => 'prioritized'
        ]);

        Log::info("Story {$storyId} removed from sprint {$sprint->id}");

        return back()->with([
            'message' => 'Story removed from sprint',
            'status' => 'success'
        ]);
    }

    /**
     * Atualizar status/posição das stories
     */
    public function update(Request $request, Sprint $sprint)
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

        if ($validated['kanban_status'] === 'done') {
            Story::where('id', $validated['story_id'])->update([
                'status' => 'done'
            ]);
        }

        Log::info("Story {$validated['story_id']} updated in sprint {$sprint->id}");

        return back()->with([
            'message' => 'Story updated successfully',
            'status' => 'success'
        ]);
    }

    /**
     * Reordenar stories
     */
    public function reorder(Request $request, Sprint $sprint)
    {
        $validated = $request->validate([
            'stories' => 'required|array',
            'stories.*.story_id' => 'required|exists:stories,id',
            'stories.*.position' => 'required|integer|min:0',
            'stories.*.kanban_status' => 'required|in:todo,in_progress,testing,done'
        ]);

        foreach ($validated['stories'] as $storyData) {
            $sprint->stories()->updateExistingPivot($storyData['story_id'], [
                'position' => $storyData['position'],
                'kanban_status' => $storyData['kanban_status']
            ]);
        }

        return back()->with([
            'message' => 'Stories reordered successfully',
            'status' => 'success'
        ]);
    }

    /**
     * Listar stories disponíveis
     */
    public function available(Sprint $sprint)
    {
        $availableStories = Story::where('project_id', $sprint->project_id)
            ->whereNotIn('id', function($query) use ($sprint) {
                $query->select('story_id')
                      ->from('story_sprint')
                      ->where('sprint_id', $sprint->id);
            })
            ->where('status', 'prioritized')
            ->orderBy('value', 'desc')
            ->get();

        return response()->json([
            'stories' => $availableStories,
            'status' => 'success'
        ]);
    }

    /**
     * Mover story entre sprints
     */
    public function move(Request $request, Sprint $fromSprint, Sprint $toSprint)
    {
        $validated = $request->validate([
            'story_id' => 'required|exists:stories,id'
        ]);

        $fromSprint->stories()->detach($validated['story_id']);

        $toSprint->stories()->attach($validated['story_id'], [
            'kanban_status' => 'todo',
            'position' => 0
        ]);

        Log::info("Story {$validated['story_id']} moved from sprint {$fromSprint->id} to sprint {$toSprint->id}");

        return back()->with([
            'message' => 'Story moved between sprints successfully',
            'status' => 'success'
        ]);
    }
}