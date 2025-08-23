<?php

namespace App\Services;

use App\Models\Project;
use App\Models\User;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class AIAssistantService
{
    protected $baseUrl;
    protected $model;

    public function __construct()
    {
        $this->baseUrl = config('ollama.base_url');
        $this->model = config('ollama.model');
    }

    /**
     * Gera uma resposta do assistente de IA usando Ollama.
     */
    public function generateResponse(Project $project, User $user, string $pageContext, array $chatHistory, string $userMessage): string
    {
        // O método buildPrompt agora retorna uma string única
        $prompt = $this->buildPrompt($project, $user, $pageContext, $chatHistory, $userMessage);

        try {
            $response = Http::post($this->baseUrl . '/api/generate', [
                'model' => $this->model,
                'prompt' => $prompt,
                'stream' => false,
            ]);

            if ($response->successful()) {
                $data = $response->json();
                return $data['response'] ?? 'Desculpe, não consegui processar sua solicitação.';
            }

            Log::error('Ollama API Error: ' . $response->body());
            return 'Ocorreu um erro ao comunicar com o assistente local (Ollama).';

        } catch (\Exception $e) {
            Log::error('AIAssistantService (Ollama) Exception: ' . $e->getMessage());
            return 'Não foi possível conectar ao assistente local. Verifique se o Ollama está em execução.';
        }
    }

    /**
     * Constrói um prompt como uma string única para o Ollama.
     */
    private function buildPrompt(Project $project, User $user, string $pageContext, array $chatHistory, string $userMessage): string
    {
        $context = "Você é um assistente especializado em metodologias ágeis. Responda de forma clara e objetiva.\n\n";

        $userRole = $project->users()->find($user->id)->pivot->role;
        $context .= "Contexto do Usuário:\n- Nome: {$user->name}\n- Papel no Projeto: {$userRole}\n\n";

        $context .= "Contexto do Projeto '{$project->title}':\n- Status Atual: {$project->status->value}\n- Descrição: {$project->description}\n\n";

        $context .= "Contexto da Página Atual: '{$pageContext}'\n";
        $context .= $this->getPageSpecificContext($project, $pageContext);

        $prompt = $context . "\n--- HISTÓRICO DA CONVERSA ---\n";

        // Concatena o histórico da conversa em uma string
        foreach ($chatHistory as $message) {
            if (!empty($message['message'])) {
                $sender = $message['sender'] === 'user' ? 'Usuário' : 'Assistente';
                $prompt .= "{$sender}: {$message['message']}\n";
            }
        }
        
        $prompt .= "Usuário: {$userMessage}\n";
        $prompt .= "Assistente:";
        
        return $prompt;
    }

    /**
     * Obtém dados contextuais específicos da página atual do banco.
     *
     */
    private function getPageSpecificContext(string $page): string
    {
        return $page;
    }
}
