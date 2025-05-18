<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class ProjectSeeder extends Seeder
{
    public function run()
    {
        // Criar User Role (admin) se não existir
        $adminRole = DB::table('user_roles')->where('name', 'admin')->first();

        if (!$adminRole) {
            $adminRoleId = DB::table('user_roles')->insertGetId([
                'name' => 'admin',
                'can_create' => true,
                'can_read' => true,
                'can_update' => true,
            ]);
        } else {
            $adminRoleId = $adminRole->id;
        }

        // Criar Usuário Admin (evitar duplicação de email)
        $user = DB::table('users')->where('email', 'admin@example.com')->first();

        if (!$user) {
            $userId = DB::table('users')->insertGetId([
                'name' => 'Admin',
                'email' => 'admin@example.com',
                'password' => Hash::make('senha123'),
                'user_role_id' => $adminRoleId,
                'active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        } else {
            $userId = $user->id;
        }

        // Criar Projeto
        $projectId = DB::table('projects')->insertGetId([
            'title' => 'Projeto Exemplo',
            'description' => 'Descrição do projeto exemplo.',
            'active' => true,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Vincular Usuário ao Projeto
        DB::table('user_project')->insert([
            'user_id' => $userId,
            'project_id' => $projectId,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Criar Product Canvas vinculado ao Projeto
        $productCanvasId = DB::table('product_canvas')->insertGetId([
            'project_id' => $projectId,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Preencher tabelas do Canvas (apenas relação)
        $canvasTables = [
            'canvas_personas',
            'canvas_solutions',
            'canvas_issues',
            'canvas_restrictions',
            'canvas_is',
            'canvas_is_not',
        ];

        foreach ($canvasTables as $table) {
            DB::table($table)->insert([
                'product_canvas_id' => $productCanvasId,
                // Outros campos podem ser adicionados conforme necessidade
            ]);
        }

        // Criar Prioridade
        $priorityId = DB::table('priorities')->insertGetId([
            'value' => 'Alta',
        ]);

        // Criar Goal Sketch
        DB::table('goal_sketches')->insert([
            'title' => 'Meta Principal',
            'type' => 'cg',
            'priority' => 'urgent',
            'project_id' => $projectId,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Criar registros básicos para tabelas restantes
        //DB::table('journeys')->insert(['created_at' => now(), 'updated_at' => now()]);
        DB::table('stories')->insert([
            [
                'title' => 'Como usuário, quero criar uma conta para acessar o aplicativo',
                'type' => 'user',
                'project_id' => $projectId,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'title' => 'Como usuário, quero criar e gerenciar playlists para organizar minhas músicas',
                'type' => 'user',
                'project_id' => $projectId,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'title' => 'Como administrador, quero gerenciar usuários para manter o controle de acesso ao sistema',
                'type' => 'system',
                'project_id' => $projectId,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'title' => 'Guaxinim fofo',
                'type' => 'system',
                'project_id' => $projectId,
                'created_at' => now(),
                'updated_at' => now(),
            ]
        ]);
    }
}