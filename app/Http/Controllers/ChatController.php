<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Services\AIAssistantService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

use Gemini\Data\GenerationConfig;

use Gemini\Data\Content; // 👈 Importe a classe Content

class ChatController extends Controller
{
  protected $aiAssistantService;

  public function __construct(AIAssistantService $aiAssistantService)
  {
    $this->aiAssistantService = $aiAssistantService;
  }

  /**
   * Envia uma mensagem para o chat e obtém uma resposta da IA sem salvar o histórico.
   *
   * @param Request $request
   * @param Project $project
   * @return \Illuminate\Http\JsonResponse
   */
  public function store(Request $request, Project $project)
  {
    $validated = $request->validate([
      'message' => 'required|string|max:2000',
      'page_context' => 'required|array',
      'page_context.page' => 'required|string',
      'page_context.artifact' => 'required|string',
      'history' => 'present|array'
    ]);

    $user = Auth::user();

    if (!$project->users()->where('user_id', $user->id)->exists()) {
      return response()->json(['error' => 'Acesso negado'], 403);
    }

    try {
      $this->aiAssistantService->generateStreamedResponse($project, $user, $validated['page_context'], $validated['history'], $validated['message']);
    } catch (\Exception $e) {
      return response()->json(['error' => $e->getMessage()], 500);
    }

    return;
  }
}
