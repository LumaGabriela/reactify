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
}