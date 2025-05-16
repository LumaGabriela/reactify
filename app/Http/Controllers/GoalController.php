<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreGoalRequest;
use App\Http\Requests\UpdateGoalRequest;
use App\Models\Goal;

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
        $validated = $request->validated();
        $goal->update($validated);
        return back()
            ->with([
                'message' => 'Goal atualizada!! ',
                'status' => 'success'
            ]);
    }
    public function destroy(Goal $goal)
    {
        $goal->delete();
        return back()
            ->with([
                'message' => 'Goal excluida! ',
                'status' => 'success'
            ]);
    }
}
