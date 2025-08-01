<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\CrcCard;
use Illuminate\Support\Facades\Log;

class OverallModelController extends Controller
{
  public function store(Request $request)
  {
    $validated = $request->validate([
      'class' => 'required|string|max:90',
      'collaborators' => 'required|array',
      'collaborators.*' => 'required|string|max:30',
      'responsabilities' => 'required|array',
      'responsabilities.*' => 'required|string|max:30',
    ]);

    CrcCard::create($validated);

    Log::info('OverallModel created', $validated);
    return back()->with([
      'status' => 'success',
      'message' => 'OverallModel created',
    ]);;
  }

  public function update(Request $request, CrcCard $model)
  {

    $validated = $request->validate([
      'class' => 'nullable|string|max:90',
      'collaborators' => 'nullable|array',
      'collaborators.*' => 'nullable|string|max:30',
      'responsabilities' => 'nullable|array',
      'responsabilities.*' => 'nullable|string|max:30',
    ]);

    $model->update($validated);

    Log::info('OverallModel updated', ['id' => $model->id]);

    return back()->with([
      'status' => 'success',
      'message' => 'OverallModel updated ',
    ]);;
  }

  public function destroy(CrcCard $model)
  {
    $model->delete();

    Log::warning('OverallModel deleted', ['id' => $model->id]);
    return back()->with([
      'status' => 'success',
      'message' => 'OverallModel deleted',
    ]);;
  }
}
