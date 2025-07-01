<?php

namespace App\Http\Controllers;


use App\Http\Requests\StoreJourneyRequest;
use App\Http\Requests\UpdateJourneyRequest;
use App\Http\Requests\BulkStoreJourneyRequest;
use App\Models\Journey;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use App\Events\ProjectUpdated;

class JourneyController extends Controller
{
  public function store(StoreJourneyRequest $request)
  {
    $validated = $request->validated();

    $journey = Journey::create($validated);

    if ($journey->project) broadcast(new ProjectUpdated($journey->project));

    Log::info('Journey created', ['id' => $journey->id]);
    return back();
  }

  // Método para bulk store das journeys selecionadas
  public function bulk(BulkStoreJourneyRequest $request)
  {
    $validated = $request->validated();

    DB::transaction(function () use ($validated) {
      foreach ($validated['journeys'] as $journeyData) {
        // Formatando os steps para o formato esperado
        $formattedSteps = array_map(function ($step, $index) {
          return [
            'id' => uniqid(),
            'step' => $index + 1,
            'description' => $step['description'],
            'is_touchpoint' => $step['is_touchpoint'] ?? false
          ];
        }, $journeyData['steps'], array_keys($journeyData['steps']));

        Journey::create([
          'title' => $journeyData['title'],
          'project_id' => $validated['project_id'],
          'steps' => $formattedSteps
        ]);
      }
    });
    Log::info('Bulk Journey created', $validated['journeys']);

    return back();
  }

  public function update(UpdateJourneyRequest $request, Journey $journey)
  {

    $validated = $request->validated();

    $journey->update($validated);

    Log::info('Journey updated', ['id' => $journey->id]);

    return back();
  }

  public function destroy(Journey $journey)
  {
    $journey->delete();

    Log::info('Journey deleted', ['id' => $journey->id]);
    return back();
  }
}
