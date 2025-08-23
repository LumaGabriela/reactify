<?php


namespace App\Services;

use App\Models\Project;
use App\Models\User;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class AIAssistantService
{
    protected $apiKey;
    protected $baseUrl;

    public function __construct()
    {
        $this->apiKey = config('gemini.api_key');
        $this->baseUrl = config('gemini.base_url');
    }

    /**
     * Gera uma resposta do assistente de IA com base no contexto.
     *
     * @param Project $project
     * @param User $user
     * @param string $pageContext
     * @param array $chatHistory
     * @param string $userMessage
     * @return string
     */
    public function generateResponse(Project $project, User $user, string $pageContext, array $chatHistory, string $userMessage): string
    {
        $prompt = $this->buildPrompt($project, $user, $pageContext, $chatHistory, $userMessage);

        try {
            $response = Http::withHeaders([
                'Content-Type' => 'application/json',
            ])->post($this->baseUrl . '?key=' . $this->apiKey, [
                'contents' => $prompt
            ]);

            if ($response->successful()) {
                $data = $response->json();
                return $data['candidates'][0]['content']['parts'][0]['text'] ?? 'Desculpe, não consegui processar sua solicitação.';
            }

            Log::error('Gemini API Error: ' . $response->body());
            return 'Ocorreu um erro ao comunicar com o assistente.';

        } catch (\Exception $e) {
            Log::error('AIAssistantService Exception: ' . $e->getMessage());
            return 'Ocorreu um erro interno no assistente.';
        }
    }

    /**
     * Constrói o prompt para a IA com base no contexto fornecido.
     *
     * @param Project $project
     * @param User $user
     * @param string $pageContext
     * @param array $chatHistory
     * @param string $userMessage
     * @return array
     */
    private function buildPrompt(Project $project, User $user, string $pageContext, array $chatHistory, string $userMessage): array
    {
        $context = "Você é um assistente especializado em metodologias ágeis. Responda de forma clara e objetiva.\n\n";

        $userRole = $project->users()->find($user->id)->pivot->role;
        $context .= "Contexto do Usuário:\n- Nome: {$user->name}\n- Papel no Projeto: {$userRole}\n\n";

        $context .= "Contexto do Projeto '{$project->title}':\n- Status Atual: {$project->status->value}\n- Descrição: {$project->description}\n\n";

        $context .= "Contexto da Página Atual: '{$pageContext}'\n";
        $context .= $this->getPageSpecificContext($pageContext);

        $contents = [];
        $contents[] = ['role' => 'user', 'parts' => [['text' => $context]]];
        $contents[] = ['role' => 'model', 'parts' => [['text' => 'Entendido. Como posso ajudar?']]];

        foreach ($chatHistory as $message) {
            if (!empty($message['message'])) {
                $role = $message['sender'] === 'user' ? 'user' : 'model';
                $contents[] = ['role' => $role, 'parts' => [['text' => $message['message']]]];
            }
        }
        
        $contents[] = ['role' => 'user', 'parts' => [['text' => $userMessage]]];
        
        return $contents;
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
