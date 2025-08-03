<?php

namespace App\Http\Controllers;

use App\Models\Story;
use App\Http\Requests\StoreStoryRequest;
use App\Http\Requests\BulkStoreStoryRequest;
use App\Http\Requests\UpdateStoryRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class StoryController extends Controller
{
  public function store(StoreStoryRequest $request)
  {
    $validated = $request->validated();

    Story::create($validated);

    Log::info('Story created', $validated);
    return back();
  }

  public function bulk(BulkStoreStoryRequest $request)
  {
    $validated = $request->validated();

    Log::warning('Bulk Story created', $validated['stories']);

    DB::transaction(function () use ($validated) {
      foreach ($validated['stories'] as $story) {
        Story::create($story);
      }
    });

    Log::info('Bulk Story created', $validated['stories']);

    return back();
  }

  public function update(UpdateStoryRequest $request, Story $story)
  {

    $validated = $request->validated();

    $story->update($validated);

    Log::info('Story updated', ['id' => $story->id]);

    return back();
  }

  public function prioritize(Request $request, Story $story)
  {
    $validated = $request->validate([
      'value' => 'nullable|integer',
      'complexity' => 'nullable|string|max:255',
    ]);

    $story->update($validated);

    return back()->with(['status' => 'success', 'message' => 'Story prioritized successfully']);
  }

  public function destroy(Story $story)
  {
    $story->delete();

    Log::warning('Story deleted', ['id' => $story->id]);
    return back();
  }
}
