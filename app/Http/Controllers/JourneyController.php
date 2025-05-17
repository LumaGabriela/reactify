<?php

namespace App\Http\Controllers;


use App\Http\Requests\StoreJourneyRequest;
use App\Http\Requests\UpdateJourneyRequest;
use App\Models\Journey;
use Illuminate\Support\Facades\Log;

class JourneyController extends Controller
{
  public function store(StoreJourneyRequest $request)
  {
    $validated = $request->validated();

    Journey::create($validated);

    return back();
  }

  public function update(UpdateJourneyRequest $request, Journey $journey)
  {

    $validated = $request->validated();

    $journey->update($validated);

    return back();
  }

  public function destroy(Journey $journey)
  {
    $journey->delete();

    return back()
      ->with([
        'message' => 'Journey excluida! ',
        'status' => 'success'
      ]);
  }
}
