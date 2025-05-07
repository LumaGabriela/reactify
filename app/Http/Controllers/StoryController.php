<?php

namespace App\Http\Controllers;
use App\Models\Story;
use Illuminate\Http\Request;

class StoryController extends Controller
{
    public function update(Request $request, Story $story) {
        $validated = $request->validate([
            'title' => 'required|string',
            'type' => 'required|in:user,system'
        ]);
    
        $story->update($validated);
        return back()->with('success', 'Story atualizada!');
    }
    
    public function destroy(Story $story) {
        $story->delete();
        return back()->with('success', 'Story excluída!');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string',
            'type' => 'required|in:user,system',
            'project_id' => 'required|exists:projects,id'
        ]);

        Story::create($validated);
        
        return redirect()->back();
    }
    
}
