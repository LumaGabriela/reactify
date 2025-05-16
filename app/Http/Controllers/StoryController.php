<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreStoryRequest;
use App\Http\Requests\UpdateStoryRequest;
use App\Models\Story;

class StoryController extends Controller
{
    public function store(StoreStoryRequest $request)
    {
        $validated = $request->validated();

        Story::create($validated);

        return back();
    }
    public function update(UpdateStoryRequest $request, Story $story)
    {
        $validated = $request->validated();
        $story->update($validated);
        return back()
            ->with([
                'message' => 'Story atualizada!! ',
                'status' => 'success'
            ]);
    }

    public function destroy(Story $story)
    {
        $story->delete();

        return back()
            ->with([
                'message' => 'Story excluida! ',
                'status' => 'success'
            ]);
    }
}
