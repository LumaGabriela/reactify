<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\OverallModel;
use Illuminate\Support\Facades\Log;

class OverallModelController extends Controller
{
  public function store(Request $request)
  {
    $validated = $request->validate([
      'title' => 'required|string|max:255',
      'description' => 'required|string|max:255',
      'status' => 'required|boolean'
    ]);

    OverallModel::create($validated);

    Log::info('OverallModel created', $validated);
    return back();
  }

  public function update(Request $request, OverallModel $model)
  {

    $validated = $request->validate([
      'title' => 'nullable|string|max:255',
      'description' => 'nullable|string|max:255',
      'status' => 'nullable|boolean'
    ]);

    $model->update($validated);

    Log::info('OverallModel updated', ['id' => $model->id]);

    return back();
  }

  public function destroy(OverallModel $model)
  {
    $model->delete();

    Log::warning('OverallModel deleted', ['id' => $model->id]);
    return back();
  }
}
