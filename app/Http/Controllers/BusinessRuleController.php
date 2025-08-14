<?php

namespace App\Http\Controllers;

use App\Models\BusinessRule;
use Illuminate\Http\Request;

class BusinessRuleController extends Controller
{
  public function store(Request $request)
  {
    $validated = $request->validate([
      'title' => 'required|string|max:255',
      'story_id' => 'required|exists:stories,id',
      'project_id' => 'required|exists:projects,id',
    ]);

    $story = BusinessRule::create($validated);

    return back()->with(['status' => 'success', 'message' => 'Business Rule created successfully']);
  }

  public function update(Request $request, BusinessRule $rule)
  {
    $validated = $request->validate([
      'title' => 'required|string|max:255',
    ]);

    $rule->update($validated);

    return back()->with(['status' => 'success', 'message' => 'Business Rule updated successfully']);
  }

  public function destroy(BusinessRule $rule)
  {
    $rule->delete();

    return back()->with(['status' => 'success', 'message' => 'Business Rule deleted successfully']);
  }
}
