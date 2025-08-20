<?php

namespace App\Http\Controllers;

use App\Models\InvestCard;
use Illuminate\Http\Request;

class InvestCardController extends Controller
{
  public function store(Request $request)
  {
    $validated = $request->validate([
      'story_id' => 'required|exists:stories,id',
      'project_id' => 'required|exists:projects,id',
    ]);

    $investCard = InvestCard::firstOrCreate(['story_id' => $validated['story_id']], [
      'project_id' => $validated['project_id'],
      'independent' => false,
      'negotiable' => false,
      'valuable' => false,
      'estimable' => false,
      'small' => false,
      'testable' => false,
    ]);

    if ($investCard->wasRecentlyCreated) {
      return back()->with(['status' => 'success', 'message' => 'Invest Card created successfully']);
    } else {
      return back()->with(['status' => 'warning', 'message' => 'Invest Card for this story already exists']);
    }
  }

  public function update(Request $request, InvestCard $investCard)
  {
    $validated = $request->validate([
      'independent' => 'nullable|boolean',
      'negotiable' => 'nullable|boolean',
      'valuable' => 'nullable|boolean',
      'estimable' => 'nullable|boolean',
      'small' => 'nullable|boolean',
      'testable' => 'nullable|boolean',
    ]);

    $investCard->update($validated);

    return back()->with(['status' => 'success', 'message' => 'Invest Card updated successfully']);
  }

  public function destroy(InvestCard $investCard)
  {
    $investCard->delete();

    return back()->with(['status' => 'success', 'message' => 'Invest Card deleted successfully']);
  }
}
