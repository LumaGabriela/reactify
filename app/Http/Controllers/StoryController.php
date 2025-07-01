<?php

namespace App\Http\Controllers;

use App\Models\Story;
use App\Http\Requests\StoreStoryRequest;
use App\Http\Requests\BulkStoreStoryRequest;
use App\Http\Requests\UpdateStoryRequest;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class StoryController extends Controller
{
  public function store(StoreStoryRequest $request)
  {
    $validated = $request->validated();

    Story::create($validated);

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

    return back();
  }

  public function update(UpdateStoryRequest $request, Story $story)
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
