<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PersonaSeeder extends Seeder
{
    public function run()
    {
        // Verificar se já existem projetos para vincular as personas
        $projects = DB::table('projects')->get();
        
        if ($projects->isEmpty()) {
            // Se não existirem projetos, não podemos criar personas devido à restrição de chave estrangeira
            echo "Nenhum projeto encontrado para vincular personas. Execute ProjectSeeder primeiro.\n";
            return;
        }
        
        // Criar personas para cada projeto
        foreach ($projects as $project) {
            // Persona 1: Usuário Regular
            DB::table('personas')->insert([
                'name' => 'Usuário Regular',
                'profile' => json_encode([
                    'idade' => '25-35 anos',
                    'ocupacao' => 'Profissional em tempo integral',
                    'habilidade_tecnologica' => 'Intermediária',
                    'comportamento' => 'Utiliza aplicativos diariamente para tarefas pessoais e profissionais'
                ]),
                'expectations' => json_encode([
                    'Interface intuitiva e fácil de usar',
                    'Resposta rápida do sistema',
                    'Confiabilidade e disponibilidade constante',
                    'Funcionalidades que economizem tempo'
                ]),
                'restrictions' => json_encode([
                    'Pouco tempo disponível para aprender novas ferramentas',
                    'Preocupação com segurança dos dados',
                    'Não gosta de interfaces complexas',
                    'Acesso principalmente via dispositivos móveis'
                ]),
                'goals' => json_encode([
                    'Aumentar produtividade',
                    'Simplificar tarefas diárias',
                    'Organizar informações pessoais',
                    'Colaborar com colegas de trabalho'
                ]),
                'project_id' => $project->id,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
            
            // Persona 2: Administrador de Sistema
            DB::table('personas')->insert([
                'name' => 'Administrador de Sistema',
                'profile' => json_encode([
                    'idade' => '30-45 anos',
                    'ocupacao' => 'Gerente de TI / Administrador de Sistemas',
                    'habilidade_tecnologica' => 'Avançada',
                    'comportamento' => 'Responsável pela implementação e manutenção de sistemas'
                ]),
                'expectations' => json_encode([
                    'Ferramentas robustas de administração',
                    'Controle granular de permissões',
                    'Logs detalhados de atividades',
                    'Recursos de backup e recuperação'
                ]),
                'restrictions' => json_encode([
                    'Precisa atender a requisitos de segurança corporativa',
                    'Limitações de orçamento para implementação',
                    'Necessidade de compatibilidade com sistemas legados',
                    'Responsabilidade pela conformidade com regulamentos'
                ]),
                'goals' => json_encode([
                    'Garantir a segurança dos dados',
                    'Facilitar o gerenciamento de usuários',
                    'Reduzir tempo de inatividade do sistema',
                    'Implementar soluções escaláveis'
                ]),
                'project_id' => $project->id,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
                
            // Persona 3: Novato Digital
            DB::table('personas')->insert([
                'name' => 'Novato Digital',
                'profile' => json_encode([
                    'idade' => '45-65 anos',
                    'ocupacao' => 'Diversos (aposentados, profissionais não-técnicos)',
                    'habilidade_tecnologica' => 'Básica',
                    'comportamento' => 'Utiliza tecnologia com cautela e precisa de orientação clara'
                ]),
                'expectations' => json_encode([
                    'Interface extremamente simples',
                    'Instruções passo a passo',
                    'Suporte facilmente acessível',
                    'Tolerância a erros'
                ]),
                'restrictions' => json_encode([
                    'Pouca familiaridade com termos técnicos',
                    'Resistência a mudanças frequentes',
                    'Dificuldade com múltiplas etapas',
                    'Preocupação com privacidade'
                ]),
                'goals' => json_encode([
                    'Realizar tarefas básicas sem frustrações',
                    'Acompanhar avanços tecnológicos',
                    'Conectar-se com familiares e amigos',
                    'Proteger informações pessoais'
                ]),
                'project_id' => $project->id,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}