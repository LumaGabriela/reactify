<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use OpenAI\Laravel\Facades\OpenAI;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;
use App\Models\Persona;

class JourneyGeneratorController extends Controller 
{
    public function generateJourneys(Request $request): JsonResponse
    {
        try {
            // Validar se o project_id foi enviado PRIMEIRO
            $request->validate([
                'project_id' => 'required|integer|min:1'
            ]);

            // Buscar personas do projeto
            $personas = $this->getPersonasByProject($request->input('project_id'));

            if ($personas->isEmpty()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Nenhuma persona encontrada para este projeto'
                ], 404);
            }

            // Gerar journeys para todas as personas
            $allJourneys = $this->generateJourneysForPersonas($personas);

            return response()->json([
                'status' => 'sucesso',
                'project_id' => $request->input('project_id'),
                'journeys' => $allJourneys
            ]);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'ID do projeto é obrigatório e deve ser válido',
                'errors' => $e->errors()
            ], 422);

        } catch (\Exception $e) {
            Log::error('Erro ao gerar journeys: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Erro ao processar solicitação: ' . $e->getMessage()
            ], 500);
        }
    }

    private function getPersonasByProject(int $projectId)
    {
        try {
            return Persona::where('project_id', $projectId)
                ->select('goals')
                ->get();
        } catch (\Exception $e) {
            throw new \Exception('Erro ao buscar personas: ' . $e->getMessage());
        }
    }

    private function generateJourneysForPersonas($personas): array
    {
        $allJourneys = [];

        foreach ($personas as $persona) {
            try {
                $journeys = $this->generateJourneyForPersona($persona);
                $allJourneys = array_merge($allJourneys, $journeys);
            } catch (\Exception $e) {
                Log::error("Erro ao gerar journey para persona {$persona->id}: " . $e->getMessage());
                // Continua processando outras personas mesmo se uma falhar
                continue;
            }
        }

        return $allJourneys;
    }

    private function generateJourneyForPersona(Persona $persona): array
    {
        try {
            // Criar prompt específico para a persona
            $prompt = $this->createPrompt($persona);

            // Fazer chamada para OpenAI
            $result = OpenAI::chat()->create([
                'model' => 'gpt-4o-mini',
                'messages' => [
                    ['role' => 'system', 'content' => 'Você é um especialista em UX e jornadas do usuário'],
                    ['role' => 'user', 'content' => $prompt]
                ]
            ]);

            // Fazer parsing da resposta
            $parsedData = $this->parseResponse($result->choices[0]->message->content);

            // Formatar journeys com dados da persona
            return $this->formatJourneys($parsedData, $persona);

        } catch (\Exception $e) {
            throw new \Exception("Erro ao processar persona {$persona->name}: " . $e->getMessage());
        }
    }

    private function createPrompt(Persona $persona): string
    {
        $goalsJson = json_encode($persona->goals);
        
        return <<<PROMPT
        Você ajuda a elaborar um fluxo de atividades de negócio que evidencie uma jornada de interação de Personas(usuários) com o uso de um produto pretendido.
        A atividade que tenha contato entre a Persona e o Produto pretendido deve ser classificada como um touchpoint, ou seja, um ponto de contato que representa uma possível e futura funcionalidade do produto pretendido.
                
        Crie journeys para as goals da persona "{$persona->name}":
        
        Goals: {$goalsJson}
        
        Formato requerido:
        Inicio do formato requerido
        {
            "journeys": [
                {
                    "title": "Journey title",
                    "steps": [
                        {"description": "ação", "is_touchpoint": true}
                    ]
                }
            ]
        }
        Fim do formato requerido
        Retorne apenas o JSON e não use \ para escapar caracteres especiais.
        PROMPT;
    }

    private function parseResponse(string $content): array
    {
        try {
            // Remove os blocos de markdown ```json e ``` antes do parsing
            $cleanedContent = preg_replace('/```json\n([\s\S]*?)\n```/', '$1', $content);
            $cleanedContent = preg_replace('/```json\s*(.*?)\s*```/s', '$1', $cleanedContent);
            $cleanedContent = trim($cleanedContent);
            
            $data = json_decode($cleanedContent, true, 512, JSON_THROW_ON_ERROR);

            // Validar se contém journeys
            if (!isset($data['journeys']) || !is_array($data['journeys'])) {
                throw new \Exception("Resposta da IA não contém 'journeys' válidos.");
            }

            return $data;

        } catch (\JsonException $e) {
            throw new \Exception('Erro ao fazer parsing do JSON: ' . $e->getMessage());
        } catch (\Exception $e) {
            throw new \Exception('Erro ao fazer o PARSER: ' . $e->getMessage());
        }
    }

    private function formatJourneys(array $data, Persona $persona): array
    {
        $formattedJourneys = [];

        foreach ($data['journeys'] ?? [] as $journey) {
            // Validar estrutura básica do journey
            if (!isset($journey['title']) || !isset($journey['steps'])) {
                Log::warning("Journey inválido encontrado para persona {$persona->id}");
                continue;
            }

            $formattedJourneys[] = [
                'title' => $journey['title'],
                'steps' => $this->validateSteps($journey['steps']),
            ];
        }

        return $formattedJourneys;
    }

    private function validateSteps(array $steps): array
    {
        $validatedSteps = [];

        foreach ($steps as $step) {
            if (isset($step['description'])) {
                $validatedSteps[] = [
                    'description' => $step['description'],
                    'is_touchpoint' => isset($step['is_touchpoint']) ? (bool)$step['is_touchpoint'] : false
                ];
            }
        }

        return $validatedSteps;
    }
}