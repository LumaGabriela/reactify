<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Log;
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
/*************  ✨ Windsurf Command ⭐  *************/
/**
 * Update the specified story in storage.
 *
 * @param UpdateStoryRequest $request
 * @param Story $story
 * @return \Illuminate\Http\RedirectResponse
 */

/*******  64557e27-133f-4a79-8d47-f3105c82a289  *******/  public function update(UpdateStoryRequest $request, Story $story)
  {

    $validated = $request->validated();

    $story->update($validated);

    return back();
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
