<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreGoalRequest;
use App\Http\Requests\UpdateGoalRequest;
use App\Models\Goal;
use Illuminate\Support\Facades\Log;

class GoalController extends Controller
{
  public function store(StoreGoalRequest $request)
  {
    $validated = $request->validated();

    $goal = Goal::create($validated);

    Log::info('Goal created', [
      'goal_id' => $goal->id,
    ]);

    return back();
  }

  public function update(UpdateGoalRequest $request, Goal $goal)
  {
    $validated = $request->validated();

    $goal->update($validated);

    Log::info('Goal updated', [
      'goal_id' => $goal->id,
    ]);

    return back();
  }
  public function destroy(Goal $goal)
  {
    $goal->delete();

    Log::info('Goal deleted', [
      'goal_id' => $goal->id,
    ]);

    return back();
  }
}
