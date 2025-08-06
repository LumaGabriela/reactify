<?php

namespace App\Http\Controllers;

use App\Models\MatrixPriority;
use Illuminate\Http\Request;

class MatrixPriorityController extends Controller
{
  public function store(Request $request)
  {
    $validatedData = $request->validate([
      'name' => 'required|string',
      'color' => 'required|string',
      'project_id' => 'required|exists:projects,id',
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
}
