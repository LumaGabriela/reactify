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
                    '25-35 anos',
                    'Profissional em tempo integral',
                    'Intermediária',
                    'Utiliza aplicativos diariamente para tarefas pessoais e profissionais'
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
                    '30-45 anos',
                    'Gerente de TI / Administrador de Sistemas',
                    'Avançada',
                    'Responsável pela implementação e manutenção de sistemas'
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
        }
    }
}