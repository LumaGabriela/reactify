<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use OpenAI\Laravel\Facades\OpenAI;
use App\Models\Persona;

class JourneyGeneratorController extends Controller
{
    public function generateJourneys(Request $request): JsonResponse
    {
        $request->validate(['project_id' => 'required|integer']);
        
        $personas = Persona::where('project_id', $request->project_id)->get();
        
        if ($personas->isEmpty()) {
            return response()->json(['error' => 'Nenhuma persona encontrada'], 404);
        }

        $journeys = [];
        foreach ($personas as $persona) {
            $journeys[] = $this->generateForPersona($persona);
        }

        return response()->json([
            'project_id' => $request->project_id,
            'journeys' => array_merge(...$journeys)
        ]);
    }

    private function generateForPersona(Persona $persona): array
    {
        $prompt = "
        Você ajuda a elaborar um fluxo de atividades de negócio que evidencie uma jornada de interação de Personas(usuários) com o uso de um produto pretendido.
        A atividade que tenha contato entre a Persona e o Produto pretendido deve ser classificada como um touchpoint, ou seja, um ponto de contato que representa uma possível e futura funcionalidade do produto pretendido.
                
        Crie journeys para a persona: {$persona->name}
        
        Goals: " . json_encode($persona->goals) . "
        
        Retorne JSON no formato:
        {
            \"journeys\": [
                {
                    \"title\": \"Journey title\",
                    \"goal\": \"meta específica\",
                    \"steps\": [
                        {\"action\": \"ação\", \"is_touchpoint\": true/false}
                    ]
                }
            ]
        }";

        $result = OpenAI::chat()->create([
            'model' => 'gpt-4o-mini',
            'messages' => [
                ['role' => 'user', 'content' => $prompt]
            ]
        ]);

        $content = preg_replace('/```json\s*(.*?)\s*```/s', '$1', $result->choices[0]->message->content);
        $data = json_decode($content, true);

        $journeys = [];
        foreach ($data['journeys'] ?? [] as $journey) {
            $journeys[] = [
                'title' => $journey['title'],
                'persona_name' => $persona->name,
                'persona_id' => $persona->id,
                'project_id' => $persona->project_id,
                'goal' => $journey['goal'],
                'steps' => $journey['steps']
            ];
        }

        return $journeys;
    }
}