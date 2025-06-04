<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse; // Import correto
use OpenAI\Laravel\Facades\OpenAI;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;
use App\Http\Requests\StoreStoryRequest;
use App\Services\StoryService;


class AIController extends Controller
{
    
    public function generateStory(Request $request): JsonResponse
    {
        try {
            // Validar se a mensagem foi enviada PRIMEIRO
            $request->validate([
                'message' => 'required|string|min:10'
            ]);

            // Só depois criar o prompt
            $prompt = $this->createPrompt($request->input('message'));
            // Validar se a mensagem foi enviada
            $request->validate([
                'message' => 'required|string|min:10'
            ]);

            $result = OpenAI::chat()->create([
                'model' => 'gpt-4o-mini',
                'messages' => [
                    ['role' => 'system', 'content' => 'Você é um especialista em engenharia de software'],
                    ['role' => 'user', 'content' => $prompt], //$request->input('message')],
                ],
                    
            ]);

            // return response()->json([
            //     //'status' => 'success',
            //     //'message' => $result->choices[0]->message->content,
            //     'message' => $this->parseResponse($result->choices[0]->message->content),
            //     
            // ]);
            try {
                return response()->json([
                    'status' => 'sucesso',
                    //'message' => $result->choices[0]->message->content,
                    'message' => $this->parseResponse($result->choices[0]->message->content),
                    // 'usage' => [
                    //     'prompt_tokens' => $result->usage->promptTokens ?? 0,
                    //     'completion_tokens' => $result->usage->completionTokens ?? 0,
                    //     'total_tokens' => $result->usage->totalTokens ?? 0,
                    // ]
                ]);
                                
                
            } catch (\Exception $e) {
                return response()->json([
                    'status' => 'error',
                    'message' => $e->getMessage()
                ], 500);
            }

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Mensagem é obrigatória',
                'errors' => $e->errors()
            ], 422);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Erro ao processar solicitação: ' . $e->getMessage()
            ], 500);
        }
    }   

        private function parseResponse(string $content): array
    {
        try {
            // Remove os blocos de markdown ```json e ``` antes do parsing
            $cleanedContent = preg_replace('/```json\n([\s\S]*?)\n```/', '$1', $content);
            $data = json_decode($cleanedContent, true, 512, JSON_THROW_ON_ERROR);

            // Extrai apenas o array de stories do JSON
            if (!isset($data['stories'])) {
                throw new \Exception("Resposta da IA não contém 'stories'.");
            }

            return $data;

        } catch (\Exception $e) {
            throw new \Exception('Erro ao fazer o PARSER: ' . $e->getMessage());
        }
    }

    private function createPrompt(string $text): string
    {
        return <<<PROMPT
        Com base na seguinte entrevista, gere user stories e system stories no formato especificado abaixo:

        Entrevista: $text

        Formato requerido:
        Inicio       do formato requerido           
        {
            "stories":
                [
                    {
                        "title":"texto da story",
                        "type":"user|system"
                    }
                ]
        }
        Fim do formato requerido
        Retorne apenas o JSON e não use \ para escapar caracteres especiais .
        PROMPT;
       
    }
}