<?php

namespace App\Http\Controllers;

use App\Models\OverallModelClass;
use Illuminate\Http\Request;

class OverallModelClassController extends Controller
{
  public function store(Request $request)
  {
    $validated = $request->validate([
      'name' => 'required|string|max:255',
      'project_id' => 'required|exists:projects,id',
    ]);

    $class = OverallModelClass::create($validated);

    return back()->with(['status' => 'success', 'message' => 'Class created successfully']);
  }
  public function delete(OverallModelClass $class)
  {
    $class->delete();

    return back()->with(['status' => 'success', 'message' => 'Class deleted successfully']);
  }
}
