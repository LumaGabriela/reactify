<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Priorization;

class PriorizationController extends Controller
{
  public function store(Request $request)
  {
    $validatedData = $request->validate([
      'project_id' => 'required|exists:projects,id',
      'story_id' => 'required|exists:stories,id',
      'priority' => 'required|string',
      'position' => 'required|integer',
    ]);

    $priorization = Priorization::create($validatedData);

    return back()->with(['message' => 'Priorization matrix created successfully', 'status' => 'success']);
  }

  public function update(Request $request, Priorization $priorization)
  {
    $validatedData = $request->validate([
      'story_id' => 'required|integer',
      'story_title' => 'required|string',
      'priority' => 'required|string',
      'position' => 'required|integer',
    ]);

    $priorization->update($validatedData);

    return back()->with(['message' => 'Priorization matrix updated successfully', 'status' => 'success']);
  }

  public function destroy(Priorization $priorization)
  {
    $priorization->delete();

    return back()->with(['message' => 'Priorization matrix deleted successfully', 'status' => 'success']);
  }
}
