<?php

namespace App\Http\Controllers;
use App\Http\Requests\StoreStoryRequest;
use App\Http\Requests\UpdateStoryRequest;
use App\Models\Story;
use Illuminate\Support\Facades\Log;

class StoryController extends Controller
{
    public function update(UpdateStoryRequest $request, Story $story) {
        $validated = $request->validated();
        $story->update($validated);
        return back()
        ->with([
            'message' => 'Story criada! ',
            'status' => 'success'
        ]);
    }
    
    public function destroy(Story $story) {
        $story->delete();
        return back()->with('success', 'Story excluída!');
    }

    public function store(StoreStoryRequest $request)
    {
        $validated = $request->validated();

        Story::create($validated);
        
        return back();
    }
    
}
