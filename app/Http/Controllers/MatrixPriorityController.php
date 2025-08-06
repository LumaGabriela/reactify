<?php

namespace App\Http\Controllers;

use App\Models\MatrixPriority;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class MatrixPriorityController extends Controller
{
  public function store(Request $request)
  {
    $validatedData = $request->validate([
      'name' => 'required|string',
      'color' => 'required|string',
      'project_id' => 'required|exists:projects,id',
      'order_column' => 'required|integer'
    ]);

    $priority = MatrixPriority::create($validatedData);

    return back()->with(['message' => 'Priority created successfully', 'status' => 'success']);
  }

  public function update(Request $request, MatrixPriority $priority)
  {
    $validatedData = $request->validate([
      'name' => 'nullable|string',
      'color' => 'required|string',
    ]);

    $priority->update($validatedData);
    return back()->with(['message' => 'Priority updated successfully', 'status' => 'success']);
  }

  public function destroy(MatrixPriority $priority)
  {
    $priority->delete();

    return back()->with(['message' => 'Priority deleted successfully', 'status' => 'success']);
  }
  public function reorder(Request $request)
  {
    $request->validate([
      'priorities' => 'required|array',
      'priorities.*.id' => 'required|exists:matrix_priorities,id',
      'priorities.*.order' => 'required|integer',
    ]);

    DB::transaction(function () use ($request) {
      foreach ($request->priorities as $priorityData) {
        MatrixPriority::where('id', $priorityData['id'])
          ->update(['order_column' => $priorityData['order']]);
      }
    });

    // Retorna uma resposta vazia, pois o frontend já atualizou a UI.
    return back()->with(['message' => 'Priorities reordered successfully', 'status' => 'success']);
  }
}
