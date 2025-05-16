<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreGoalRequest;
use App\Http\Requests\UpdateGoalRequest;
use App\models\Goal;
class GoalController extends Controller
{
    public function store(StoreGoalRequest $request)
    {
        $validated = $request->validated();

        Goal::create($validated);

        return back()
        ->with([
            'message' => 'Goal criada!! ',
            'status' => 'success'
        ]);

    }

    public function update(UpdateGoalRequest $request, Goal $goal)
    {
        //
    }
    public function destroy(Goal $goal)
    {
        //
    }
}
