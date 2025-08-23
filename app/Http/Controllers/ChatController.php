<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Services\AIAssistantService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log; // Adicionado para o caso de exceção

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
    public function sendMessage(Request $request, Project $project)
    {
        $validated = $request->validate([
            'message' => 'required|string|max:2000',
            'page_context' => 'required|string',
            'history' => 'present|array'
        ]);

        $user = Auth::user();
        
        if (!$project->users()->where('user_id', $user->id)->exists()) {
            return response()->json(['error' => 'Acesso negado'], 403);
        }

        try {
            // Gerar resposta da IA usando o histórico vindo do frontend
            $aiResponseText = $this->aiAssistantService->generateResponse(
                $project,
                $user,
                $validated['page_context'],
                $validated['history'], // Usa o histórico enviado pelo frontend
                $validated['message']
            );

            $aiResponseMessage = [
                'id' => 'ai-' . uniqid(),
                'sender' => 'ai',
                'message' => $aiResponseText,
                'created_at' => now()->toISOString(),
            ];

            return response()->json($aiResponseMessage);
            
        } catch (\Exception $e) {
            Log::error('Chat Error: ' . $e->getMessage());
            return response()->json(['error' => 'Erro interno do servidor'], 500);
        }
    }


}
