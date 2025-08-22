<?php

namespace App\Http\Controllers;

use App\Enums\InvestCardStatus;
use App\Models\InvestCard;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

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
      'independent' => InvestCardStatus::NO,
      'negotiable' => InvestCardStatus::NO,
      'valuable' => InvestCardStatus::NO,
      'estimable' => InvestCardStatus::NO,
      'small' => InvestCardStatus::NO,
      'testable' => InvestCardStatus::NO,
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
      'independent' => ['nullable', Rule::enum(InvestCardStatus::class)],
      'negotiable' => ['nullable', Rule::enum(InvestCardStatus::class)],
      'valuable' => ['nullable', Rule::enum(InvestCardStatus::class)],
      'estimable' => ['nullable', Rule::enum(InvestCardStatus::class)],
      'small' => ['nullable', Rule::enum(InvestCardStatus::class)],
      'testable' => ['nullable', Rule::enum(InvestCardStatus::class)],
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
