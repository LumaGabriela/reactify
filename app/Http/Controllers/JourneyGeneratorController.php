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

            // Verificar se existem personas com goals válidos
            $personasWithGoals = $this->filterPersonasWithValidGoals($personas);

            if ($personasWithGoals->isEmpty()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Nenhuma persona com goals válidos encontrada para este projeto'
                ], 404);
            }

            // Gerar journeys para personas que possuem goals
            $allJourneys = $this->generateJourneysForPersonas($personasWithGoals);

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

    /**
     * Filtra personas que possuem goals válidos (não nulos e não vazios)
     */
    private function filterPersonasWithValidGoals($personas)
    {
        return $personas->filter(function ($persona) {
            return $this->hasValidGoals($persona);
        });
    }

    /**
     * Verifica se a persona possui goals válidos
     */
    private function hasValidGoals(Persona $persona): bool
    {
        // Verifica se goals não é null
        if (is_null($persona->goals)) {
            Log::info("Persona {$persona->id} ({$persona->name}) não possui goals (null)");
            return false;
        }

        // Se goals for string JSON, decodifica
        $goals = is_string($persona->goals) ? json_decode($persona->goals, true) : $persona->goals;

        // Verifica se a decodificação foi bem-sucedida
        if (json_last_error() !== JSON_ERROR_NONE) {
            Log::warning("Persona {$persona->id} ({$persona->name}) possui JSON inválido em goals");
            return false;
        }

        // Verifica se goals é um array e não está vazio
        if (!is_array($goals) || empty($goals)) {
            Log::info("Persona {$persona->id} ({$persona->name}) possui goals vazio ou inválido");
            return false;
        }

        // Verifica se há pelo menos um goal com conteúdo válido
        foreach ($goals as $goal) {
            if (is_string($goal) && !empty(trim($goal))) {
                return true;
            }
            if (is_array($goal) && !empty($goal)) {
                return true;
            }
        }

        Log::info("Persona {$persona->id} ({$persona->name}) não possui goals com conteúdo válido");
        return false;
    }

    private function generateJourneysForPersonas($personas): array
    {
        $allJourneys = [];

        foreach ($personas as $persona) {
            try {
                // Dupla verificação antes de processar
                if (!$this->hasValidGoals($persona)) {
                    Log::warning("Pulando persona {$persona->id} - goals inválidos");
                    continue;
                }

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
        // Garantir que goals seja um array válido para o JSON
        $goals = is_string($persona->goals) ? json_decode($persona->goals, true) : $persona->goals;
        $goalsJson = json_encode($goals, JSON_UNESCAPED_UNICODE);
        
        return <<<PROMPT
        Você ajuda a elaborar um fluxo de atividades de negócio que evidencie uma jornada de interação de Personas(usuários) com o uso de um produto pretendido.
        A atividade que tenha contato entre a Persona e o Produto pretendido deve ser classificada como um touchpoint, ou seja, 
        um ponto de contato que representa uma possível e futura funcionalidade do produto pretendido.
        Use o exemplo abaixo como base para classificar os passos com touchpoint.
        Esse passo a passo deve incluir também as respostas do produto e não apenas as ações da persona.
                
        Crie journeys para as goals da persona "{$persona->name}":
        
        Goals: {$goalsJson}
        
        Formato requerido:
        Inicio do formato requerido
        {
            "journeys": [
                {
                    "title": "Título da Journey",
                    "steps": [
                        {"description": "ação", "is_touchpoint": true|false}
                    ]
                }
            ]
        }
        Fim do formato requerido

        Exemplo de journey:
        {
            "journeys": [
                {
                    "title": "Assistir um filme",
                    "steps": [
                        {"description": "Acessar a plataforma", "is_touchpoint": false},
                        {"description": "Abrir a página", "is_touchpoint": false},
                        {"description": "Logar na plataforma", "is_touchpoint": true},
                        {"description": "Abrir tela inicial de usuário", "is_touchpoint": false},
                        {"description": "Exibir opções “exibir catálogo” e “comunidade”", "is_touchpoint": false}
                        {"description": "Exibir média de notas dadas por outros usuários", "is_touchpoint": false},
                        {"description": "Exibir sinopse e ficha técnica", "is_touchpoint": false},
                        {"description": "Selecionar um filme", "is_touchpoint": true},
                        {"description": "Mostrar categorias de filmes", "is_touchpoint": false},
                        {"description": "Selecionar opção “exibir catálogo”", "is_touchpoint": true}
                        {"description": "Exibir opção “iniciar filme”, assistir depois e “escolher comentário”", "is_touchpoint": false},
                        {"description": "Selecionar “iniciar filme”", "is_touchpoint": true},
                        {"description": "Abrir player de vídeo", "is_touchpoint": false},
                        {"description": "Iniciar exibição do filme", "is_touchpoint": false}
                    ]
                }
            ]
        }
        Fim do exemplo
        Retorne apenas o JSON e não use \ para escapar caracteres especiais.
        IMPORTANTE: Caso não haja goal para a persona da vez, não gere ou invente uma journey(title, steps)
        IMPORTANTE: Caso o texto da goal não faça sentido, não gere ou invente uma journey(title, steps)
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
                    'id' => uniqid(), // Gerar um ID único para cada step
                    'description' => $step['description'],
                    'is_touchpoint' => isset($step['is_touchpoint']) ? (bool)$step['is_touchpoint'] : false
                ];
            }
        }

        return $validatedSteps;
    }
}