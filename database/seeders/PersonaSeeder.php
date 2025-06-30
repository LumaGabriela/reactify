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
                    'habilidade_tecnologica: Intermediária',
                    'Utiliza aplicativos diariamente para tarefas pessoais e profissionais'
                ]),
                'expectations' => json_encode([
                    'Interface intuitiva e fácil de usar',
                    'Resposta rápida do sistema',
                    'Confiabilidade e disponibilidade constante',
                    'Funcionalidades que economizem tempo'
                ]),
                'goals' => json_encode([
                    'Assistir um filme',
                    'Escolher o idioma da legenda do filme',
                    'Escrever uma resenha ou comentário sobre um filme',
                    'Dar nota para um filme',
                    'Seguir outros usuários da plataforma',
                    'Compartilhar um filme ou resenha em redes sociais',
                    'Criar playlists de filmes',
                    'Fazer requisições de filmes a serem adicionados ao catálogo'
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
                    'habilidade_tecnologica: Avançada',
                    'Responsável pela implementação e manutenção de sistemas'
                ]),
                'expectations' => json_encode([
                    'Ferramentas robustas de administração',
                    'Controle granular de permissões',
                    'Logs detalhados de atividades',
                    'Recursos de backup e recuperação'
                ]),
                'goals' => json_encode([
                    'Adicionar e categorizar filme no catálogo',
                    'Remover um filme do catálogo',
                    'Consultar o fluxo de visitas à plataforma',
                    'Gerenciar as inscrições na plataforma'
                ]),
                'project_id' => $project->id,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
                
        }
    }
}