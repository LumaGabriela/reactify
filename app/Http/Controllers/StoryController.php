<?php

namespace App\Http\Controllers;
use App\Http\Requests\StoryRequest;
use App\Models\Story;

class StoryController extends Controller
{
    public function update(StoryRequest $request, Story $story) {
        $validated = $request->validate([
            'title' => 'required|string',
            'type' => 'required|in:user,system'
        ]);
    
        $story->update($validated);
        return back()
        ->with([
            'message' => 'Story criada! ',
            'status' => 'success'
        ]);
    }
    
    public function destroy(StoryRequest $story) {
        $story->delete();
        return back()->with('success', 'Story excluída!');
    }

    public function store(StoryRequest $request)
    {
        $validated = $request->validated();

        Story::create($validated);
        
        return redirect()->back();
    }
    
}
