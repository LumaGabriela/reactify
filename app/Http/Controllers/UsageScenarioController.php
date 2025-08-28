<?php

namespace App\Http\Controllers;

use App\Models\UsageScenario;
use Illuminate\Http\Request;

class UsageScenarioController extends Controller
{
  public function store(Request $request)
  {

    $validated = $request->validate([
      'description' => 'required|array',
      'description.as' => 'required|string',
      'description.given' => 'required|string',
      'description.when' => 'required|string',
      'description.then_1' => 'required|string',
      'description.and' => 'nullable|string',
      'description.then_2' => 'nullable|string',
      'story_id' => 'required|exists:stories,id',
      'project_id' => 'required|exists:projects,id',
    ]);

    $usageScenario = UsageScenario::create($validated);

    return back()->with(['status' => 'success', 'message' => 'Usage scenario created successfully']);
  }

  public function update(Request $request, UsageScenario $scenario)
  {
    ds($scenario);
    $validated = $request->validate([
      'description' => 'nullable|array',
      'description.as' => 'nullable|string',
      'description.given' => 'nullable|string',
      'description.when' => 'nullable|string',
      'description.then_1' => 'nullable|string',
      'description.and' => 'nullable|string',
      'description.then_2' => 'nullable|string',
    ]);

    $scenario->update($validated);

    return back()->with(['status' => 'success', 'message' => 'Usage scenario updated successfully']);
  }

  public function destroy(UsageScenario $scenario)
  {
    $scenario->delete();

    return back()->with(['status' => 'success', 'message' => 'Usage scenario deleted successfully']);
  }
}
