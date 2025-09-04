<?php

namespace App\Http\Controllers;

use App\Models\Storyboard;
use Illuminate\Http\Request;
use Log;

class StoryboardController extends Controller
{
  public function store(Request $request)
  {
    ds($request->all());
    $request->validate(
      [
        'image' => 'required|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        'story_id' => 'required|exists:stories,id',
        'project_id' => 'required|exists:projects,id'
      ]
    );

    try {
      $file = $request->file('image');

      $folder = 'reactify/storyboards';

      $uploadedFile = cloudinary()->uploadApi()->upload($file->getRealPath(), ['folder' => $folder, 'public_id' => 'story_id=' . $request['story_id']]);

      $secureUrl = $uploadedFile['secure_url'];

      $storyboard = Storyboard::updateOrCreate(['story_id' => $request['story_id']], [
        'story_id' => $request['story_id'],
        'project_id' => $request['project_id'],
        'image_url' => $secureUrl,
      ]);

      if ($storyboard && $storyboard->wasRecentlyCreated) {
        return back()->with(['status' => 'success', 'message' => 'Storyboard created successfully']);
      } else if ($storyboard && !$storyboard->wasRecentlyCreated) {
        return back()->with(['status' => 'success', 'message' => 'Storyboard updated successfully']);
      } else {
        return back()->with(['status' => 'error', 'message' => 'Failed to create storyboard']);
      }
    } catch (\Exception $e) {
      Log::error($e->getMessage());
      return back()->with(['status' => 'error', 'message' => 'Failed to create storyboard']);
    }
  }

  // public function update(Storyboard $storyboard, Request $request)
  // {
  //   $request->validate([
  //     'image' => 'required|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
  //     'story_id' => 'required|exists:stories,id',
  //   ]);

  //   try {
  //     $file = $request->file('image');

  //     $folder = 'reactify/storyboards';

  //     $uploadedFile = cloudinary()->uploadApi()->upload($file->getRealPath(), ['folder' => $folder, 'public_id' => 'story_id=' . $request['story_id']]);

  //     $secureUrl = $uploadedFile['secure_url'];

  //     $storyboard->update([
  //       'story_id' => $request['story_id'],
  //       'project_id' => $request['project_id'],
  //       'image_url' => $secureUrl,
  //     ]);

  //     return back()->with(['status' => 'success', 'message' => 'Storyboard updated successfully']);
  //   } catch (\Exception $e) {
  //     Log::error($e->getMessage());
  //     return back()->with(['status' => 'error', 'message' => 'Failed to update storyboard']);
  //   }
  // }
  public function destroy(Storyboard $storyboard)
  {
    $storyboard->delete();
    return back()->with(['status' => 'success', 'message' => 'Storyboard deleted successfully']);
  }
}
