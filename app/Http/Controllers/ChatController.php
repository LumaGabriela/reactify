<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Services\AIAssistantService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log; // Adicionado para o caso de exceção
use Symfony\Component\HttpFoundation\StreamedResponse;

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
    ds($request['page_context']);
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

    //streamed response
    return new StreamedResponse(function () use ($project, $user, $validated) {
      $this->aiAssistantService->generateStreamedResponse(
        $project,
        $user,
        $validated['page_context'],
        $validated['history'],
        $validated['message'],
        function ($chunk) {
          echo $chunk;
          ob_flush();
          flush();
        }
      );
    }, 200, [
      'Content-Type' => 'text/plain',
      'Cache-Control' => 'no-cache',
      'X-Accel-Buffering' => 'no',
    ]);

    // try {
    //   // Gerar resposta da IA usando o histórico vindo do frontend
    //   $aiResponseText = $this->aiAssistantService->generateResponse(
    //     $project,
    //     $user,
    //     $validated['page_context'],
    //     $validated['history'], // Usa o histórico enviado pelo frontend
    //     $validated['message']
    //   );

    //   $aiResponseMessage = [
    //     'id' => 'ai-' . uniqid(),
    //     'sender' => 'ai',
    //     'message' => $aiResponseText,
    //     'created_at' => now()->toISOString(),
    //   ];

    //   return response()->json($aiResponseMessage);
    // } catch (\Exception $e) {
    //   Log::error('Chat Error: ' . $e->getMessage());
    //   return response()->json(['error' => 'Erro interno do servidor'], 500);
    // }
  }
}
