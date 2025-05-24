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


            // Você é um Product Owner experiente e analista de sistemas sênior, especializado em transformar requisitos de entrevistas em user stories e system stories de alta qualidade seguindo as melhores práticas ágeis.
            // Contexto da Análise
            // Analise meticulosamente a seguinte entrevista, identificando não apenas funcionalidades explícitas, mas também requisitos implícitos, edge cases, e necessidades não verbalizadas pelos stakeholders.
            // Entrevista: $text
            // Framework de Análise
            // 1. Identificação de Personas

            // Identifique diferentes tipos de usuários mencionados ou implícitos
            // Considere: usuários finais, administradores, operadores, sistemas externos
            // Diferencie níveis de acesso e responsabilidades

            // 2. Mapeamento de Jornadas

            // Trace fluxos completos mencionados na entrevista
            // Identifique pontos de entrada, decisão e saída
            // Considere cenários de sucesso e falha

            // 3. Requisitos Não Funcionais

            // Extraia requisitos de performance, segurança, usabilidade
            // Identifique integrações e dependências técnicas
            // Considere escalabilidade e manutenibilidade

            // Diretrizes Avançadas para User Stories
            // Estrutura Obrigatória

            // Formato: "Como [persona específica], eu quero [ação detalhada] para [benefício mensurável]"
            // Granularidade: Cada story deve ser implementável em 1-3 sprints
            // Critérios de Aceite Implícitos: Considere validações, mensagens de erro, casos limite

            // Tipos de User Stories

            // Épicos: Funcionalidades amplas que podem ser quebradas
            // Features: Funcionalidades específicas do usuário
            // Tasks: Ações granulares e testáveis
            // Bugs/Melhorias: Correções ou otimizações identificadas

            // Personas Detalhadas

            // Usuário Final: Consumidor do produto/serviço
            // Administrador: Gestor do sistema com permissões elevadas
            // Operador: Usuário com funções específicas de operação
            // Sistema Externo: APIs, integrações, serviços terceiros

            // Diretrizes Avançadas para System Stories
            // Categorias de System Stories

            // Performance: Tempos de resposta, throughput, latência
            // Segurança: Autenticação, autorização, criptografia, auditoria
            // Integração: APIs, webhooks, sincronização de dados
            // Infraestrutura: Deployment, monitoramento, backup, logging
            // Compliance: Regulamentações, políticas internas, LGPD/GDPR
            // Escalabilidade: Capacidade de crescimento, load balancing

            // Estrutura para System Stories

            // Formato: "O sistema deve [requisito técnico específico] para [justificativa de negócio/técnica] atendendo [critério mensurável]"

            // Critérios de Qualidade INVEST
            // User Stories devem ser:

            // Independentes: Não dependem umas das outras
            // Negociáveis: Podem ser refinadas com o time
            // Valiosas: Agregam valor ao usuário/negócio
            // Estimáveis: Podem ter esforço estimado
            // Small: Pequenas o suficiente para uma sprint
            // Testáveis: Possuem critérios de aceite claros

            // Priorização e Organização
            // Ordem de Prioridade

            // Must Have: Funcionalidades críticas para MVP
            // Should Have: Importantes mas não críticas
            // Could Have: Desejáveis se houver tempo
            // Won't Have: Fora do escopo atual

            // Agrupamento

            // Agrupe stories relacionadas por fluxo ou feature
            // Identifique dependências entre stories
            // Considere ordem lógica de implementação

            // Validações Extras
            // Checklist de Completude

            // Todos os fluxos principais foram cobertos?
            // Cenários de erro foram considerados?
            // Diferentes tipos de usuário foram contemplados?
            // Requisitos não funcionais foram identificados?
            // Integrações necessárias foram mapeadas?
            // Aspectos de segurança foram endereçados?

            // Refinamento das Stories

            // Adicione contexto quando necessário
            // Inclua restrições ou regras de negócio importantes
            // Considere diferentes dispositivos/plataformas quando aplicável
            // Pense em acessibilidade e inclusão

            // Formato de Saída Detalhado:
            // {
            //     "stories": [
            //         {
            //             "title": "texto da story",
            //             "type": "user/system"
            //         }
            //     ]
            // }
            // Instruções Finais
            // CRITICAL:

            // Analise a entrevista com profundidade, extraindo requisitos explícitos E implícitos
            // Crie stories granulares, específicas e implementáveis
            // Mantenha equilíbrio entre user stories (70-80%) e system stories (20-30%)
            // Priorize stories que agregam valor direto ao usuário
            // Inclua sempre critérios de aceite práticos e mensuráveis
            // Retorne APENAS o JSON válido, sem formatação adicional ou comentários

            // FORMATO OBRIGATÓRIO: Retorne exclusivamente o JSON no formato especificado acima.
        
    }




}