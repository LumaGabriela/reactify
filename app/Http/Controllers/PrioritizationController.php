<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Prioritization;

class PrioritizationController extends Controller
{
  public function store(Request $request)
  {
    $validatedData = $request->validate([
      'project_id' => 'required|exists:projects,id',
      'story_id' => 'required|exists:stories,id',
      'priority_id' => 'required|exists:matrix_priorities,id',
      'position' => 'required|integer',
    ]);

    $prioritization = Prioritization::create($validatedData);

    return back()->with(['message' => 'Prioritization matrix created successfully', 'status' => 'success']);
  }

  public function update(Request $request, Prioritization $prioritization)
  {
    $validatedData = $request->validate([
      'priority_id' => 'required|exists:matrix_priorities,id',
      'position' => 'required|integer',
    ]);

    $prioritization->update($validatedData);

    return back()->with(['message' => 'Prioritization matrix updated successfully', 'status' => 'success']);
  }

  public function destroy(Prioritization $prioritization)
  {
    $prioritization->delete();

    return back()->with(['message' => 'Prioritization matrix deleted successfully', 'status' => 'success']);
  }
}
