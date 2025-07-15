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
        $adminRole = DB::table("user_roles")->where("name", "admin")->first();

        if (!$adminRole) {
            $adminRoleId = DB::table("user_roles")->insertGetId([
                "name" => "admin",
                "can_create" => true,
                "can_read" => true,
                "can_update" => true,
            ]);
        } else {
            $adminRoleId = $adminRole->id;
        }

        // Criar Usuário Admin (evitar duplicação de email)
        $user = DB::table("users")
            ->where("email", "admin@example.com")
            ->first();

        if (!$user) {
            $userId = DB::table("users")->insertGetId([
                "name" => "Admin",
                "email" => "admin@example.com",
                "password" => Hash::make("senha123"),
                "user_role_id" => $adminRoleId,
                "active" => true,
                "email_verified_at" => now(),
                "created_at" => now(),
                "updated_at" => now(),
            ]);
        } else {
            $userId = $user->id;
        }

        // Criar Usuário katlen
        $user = DB::table("users")
            ->where("email", "katlenvanessa15@gmail.com")
            ->first();

        if (!$user) {
            $userId = DB::table("users")->insertGetId([
                "name" => "Kat",
                "email" => "katlenvanessa15@gmail.com",
                "password" => Hash::make("senha123"),
                "user_role_id" => $adminRoleId,
                "active" => true,
                "email_verified_at" => now(),
                "created_at" => now(),
                "updated_at" => now(),
            ]);
        } else {
            $userId = $user->id;
        }
        // Criar Projeto
        $projectId = DB::table("projects")->insertGetId([
            "title" => "Projeto Exemplo",
            "description" => "Descrição do projeto exemplo.",
            "active" => true,
            "created_at" => now(),
            "updated_at" => now(),
        ]);

        // Vincular Usuário ao Projeto
        DB::table("user_project")->insert([
            "user_id" => $userId,
            "project_id" => $projectId,
            "created_at" => now(),
            "updated_at" => now(),
        ]);

        // Criar Product Canvas vinculado ao Projeto
        $productCanvasId = DB::table("product_canvas")->insertGetId([
            "issues" => "Problema",
            "solutions" => "Solução",
            "personas" => "Pessoa",
            "restrictions" =>
                "A plataforma deve funcionar em qualquer navegador web baseado no Chromium, no Opera, no Safari e no Mozilla Firefox. A plataforma deve exigir um cadastro do usuário. A plataforma deve exigir uma assinatura semestral ou anual para acesso ilimitado ao catálogo.",
            "product_is" => "É",
            "product_is_not" => "Nao É",
            "project_id" => $projectId,
            "created_at" => now(),
            "updated_at" => now(),
        ]);

        // // Preencher tabelas do Canvas (apenas relação)
        // $canvasTables = [
        //   'canvas_personas',
        //   'canvas_solutions',
        //   'canvas_issues',
        //   'canvas_restrictions',
        //   'canvas_is',
        //   'canvas_is_not',
        // ];

        // Criar Prioridade
        $priorityId = DB::table("priorities")->insertGetId([
            "value" => "Alta",
        ]);

        // Criar Goal Sketch
        DB::table("goal_sketches")->insert([
            [
                "title" =>
                    "Atendimento às leis de direitos autorais e relacionadas à conteúdo em domínio público.",
                "type" => "cg",
                "priority" => "urgent",
                "project_id" => $projectId,
                "created_at" => now(),
                "updated_at" => now(),
            ],
            [
                "title" => "Atendimento às leis de proteção do consumidor.",
                "type" => "cg",
                "priority" => "urgent",
                "project_id" => $projectId,
                "created_at" => now(),
                "updated_at" => now(),
            ],
            [
                "title" =>
                    "Conformidade com padrões de segurança da informação.",
                "type" => "cg",
                "priority" => "urgent",
                "project_id" => $projectId,
                "created_at" => now(),
                "updated_at" => now(),
            ],
            [
                "title" => "Atendimento às leis de proteção de dados pessoais.",
                "type" => "cg",
                "priority" => "urgent",
                "project_id" => $projectId,
                "created_at" => now(),
                "updated_at" => now(),
            ],
            [
                "title" =>
                    "Assegurar que a plataforma funcione adequadamente nos navegadores web baseados no Chromium, Opera, Safari e Mozilla Firefox.",
                "type" => "cg",
                "priority" => "urgent",
                "project_id" => $projectId,
                "created_at" => now(),
                "updated_at" => now(),
            ],
        ]);

        // Criar registros básicos para tabelas restantes
        //DB::table('journeys')->insert(['created_at' => now(), 'updated_at' => now()]);
        DB::table("stories")->insert([
            [
                "title" =>
                    "Como usuário, quero criar uma conta para acessar o aplicativo",
                "type" => "user",
                "project_id" => $projectId,
                "created_at" => now(),
                "updated_at" => now(),
            ],
            [
                "title" =>
                    "Como usuário, quero criar e gerenciar playlists para organizar minhas músicas",
                "type" => "user",
                "project_id" => $projectId,
                "created_at" => now(),
                "updated_at" => now(),
            ],
            [
                "title" =>
                    "Como administrador, quero gerenciar usuários para manter o controle de acesso ao sistema",
                "type" => "system",
                "project_id" => $projectId,
                "created_at" => now(),
                "updated_at" => now(),
            ],
            [
                "title" => "Guaxinim fofo",
                "type" => "system",
                "project_id" => $projectId,
                "created_at" => now(),
                "updated_at" => now(),
            ],
        ]);

        // Criar Journey com vários steps
        $journeySteps = [
            [
                "id" => uniqid(),
                "step" => 1,
                "description" => "Acessar a plataforma",
                "is_touchpoint" => false,
            ],
            [
                "id" => uniqid(),
                "step" => 2,
                "description" => "Abrir a página",
                "is_touchpoint" => false,
            ],
            [
                "id" => uniqid(),
                "step" => 3,
                "description" => "Logar na plataforma",
                "is_touchpoint" => false,
            ],
            [
                "id" => uniqid(),
                "step" => 4,
                "description" => "Abrir tela inical de usuário",
                "is_touchpoint" => false,
            ],
            [
                "id" => uniqid(),
                "step" => 5,
                "description" =>
                    'Exibir opções "exibir catálogo" e "comunidade"',
                "is_touchpoint" => false,
            ],
            [
                "id" => uniqid(),
                "step" => 6,
                "description" => 'Selecionar opção "exibir catálogo"',
                "is_touchpoint" => true,
            ],
            [
                "id" => uniqid(),
                "step" => 7,
                "description" => "Mostrar categorias de filmes",
                "is_touchpoint" => false,
            ],
            [
                "id" => uniqid(),
                "step" => 8,
                "description" => "Selecionar um filme",
                "is_touchpoint" => true,
            ],
            [
                "id" => uniqid(),
                "step" => 9,
                "description" => "Exibir sinopse e ficha técnica",
                "is_touchpoint" => false,
            ],
            [
                "id" => uniqid(),
                "step" => 10,
                "description" =>
                    "Exibir média de notas dadas por outros usuários",
                "is_touchpoint" => false,
            ],
            [
                "id" => uniqid(),
                "step" => 11,
                "description" =>
                    'Exibir opção "iniciar filme", "assistir depois" e "escrever comentário"',
                "is_touchpoint" => false,
            ],
            [
                "id" => uniqid(),
                "step" => 12,
                "description" => 'Selecionar "iniciar filme"',
                "is_touchpoint" => true,
            ],
            [
                "id" => uniqid(),
                "step" => 13,
                "description" => "Abrir player de vídeo",
                "is_touchpoint" => false,
            ],
            [
                "id" => uniqid(),
                "step" => 14,
                "description" => "Iniciar exibição do filme",
                "is_touchpoint" => false,
            ],
        ];

        DB::table("journeys")->insert([
            "title" => "Assistir um filme",
            "steps" => json_encode($journeySteps),
            "project_id" => $projectId,
            "created_at" => now(),
            "updated_at" => now(),
        ]);
    }
<<<<<<< Updated upstream

    // Criar Usuário Admin (evitar duplicação de email)
    $user = DB::table('users')->where('email', 'admin@example.com')->first();

    if (!$user) {
      $userId = DB::table('users')->insertGetId([
        'name' => 'Admin',
        'email' => 'admin@example.com',
        'password' => Hash::make('senha123'),
        'user_role_id' => $adminRoleId,
        'active' => true,
        'email_verified_at' => now(),
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
      'role' => 'admin',
      'created_at' => now(),
      'updated_at' => now(),
    ]);

    // Criar Product Canvas vinculado ao Projeto
    $productCanvasId = DB::table('product_canvas')->insertGetId([
      'issues' => 'Problema',
      'solutions' => 'Solução',
      'personas' => 'Pessoa',
      'restrictions' => 'A plataforma deve funcionar em qualquer navegador web baseado no Chromium, no Opera, no Safari e no Mozilla Firefox. A plataforma deve exigir um cadastro do usuário. A plataforma deve exigir uma assinatura semestral ou anual para acesso ilimitado ao catálogo.',
      'product_is' => 'É',
      'product_is_not' => 'Nao É',
      'project_id' => $projectId,
      'created_at' => now(),
      'updated_at' => now(),
    ]);

    // // Preencher tabelas do Canvas (apenas relação)
    // $canvasTables = [
    //   'canvas_personas',
    //   'canvas_solutions',
    //   'canvas_issues',
    //   'canvas_restrictions',
    //   'canvas_is',
    //   'canvas_is_not',
    // ];


    // Criar Prioridade
    $priorityId = DB::table('priorities')->insertGetId([
      'value' => 'Alta',
    ]);

    // Criar Goal Sketch
    DB::table('goal_sketches')->insert([
      [
        'title' => 'Atendimento às leis de direitos autorais e relacionadas à conteúdo em domínio público.',
        'type' => 'cg',
        'priority' => 'urgent',
        'project_id' => $projectId,
        'created_at' => now(),
        'updated_at' => now(),
      ],
      [
        'title' => 'Atendimento às leis de proteção do consumidor.',
        'type' => 'cg',
        'priority' => 'urgent',
        'project_id' => $projectId,
        'created_at' => now(),
        'updated_at' => now(),
      ],
      [
        'title' => 'Conformidade com padrões de segurança da informação.',
        'type' => 'cg',
        'priority' => 'urgent',
        'project_id' => $projectId,
        'created_at' => now(),
        'updated_at' => now(),
      ],
      [
        'title' => 'Atendimento às leis de proteção de dados pessoais.',
        'type' => 'cg',
        'priority' => 'urgent',
        'project_id' => $projectId,
        'created_at' => now(),
        'updated_at' => now(),
      ],
      [
        'title' => 'Assegurar que a plataforma funcione adequadamente nos navegadores web baseados no Chromium, Opera, Safari e Mozilla Firefox.',
        'type' => 'cg',
        'priority' => 'urgent',
        'project_id' => $projectId,
        'created_at' => now(),
        'updated_at' => now(),
      ],
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

    // Criar Journey com vários steps
    $journeySteps = [
      [
        'id' => uniqid(),
        'step' => 1,
        'description' => 'Acessar a plataforma',
        'is_touchpoint' => false
      ],
      [
        'id' => uniqid(),
        'step' => 2,
        'description' => 'Abrir a página',
        'is_touchpoint' => false
      ],
      [
        'id' => uniqid(),
        'step' => 3,
        'description' => 'Logar na plataforma',
        'is_touchpoint' => false
      ],
      [
        'id' => uniqid(),
        'step' => 4,
        'description' => 'Abrir tela inical de usuário',
        'is_touchpoint' => false
      ],
      [
        'id' => uniqid(),
        'step' => 5,
        'description' => 'Exibir opções "exibir catálogo" e "comunidade"',
        'is_touchpoint' => false
      ],
      [
        'id' => uniqid(),
        'step' => 6,
        'description' => 'Selecionar opção "exibir catálogo"',
        'is_touchpoint' => true
      ],
      [
        'id' => uniqid(),
        'step' => 7,
        'description' => 'Mostrar categorias de filmes',
        'is_touchpoint' => false
      ],
      [
        'id' => uniqid(),
        'step' => 8,
        'description' => 'Selecionar um filme',
        'is_touchpoint' => true
      ],
      [
        'id' => uniqid(),
        'step' => 9,
        'description' => 'Exibir sinopse e ficha técnica',
        'is_touchpoint' => false
      ],
      [
        'id' => uniqid(),
        'step' => 10,
        'description' => 'Exibir média de notas dadas por outros usuários',
        'is_touchpoint' => false
      ],
      [
        'id' => uniqid(),
        'step' => 11,
        'description' => 'Exibir opção "iniciar filme", "assistir depois" e "escrever comentário"',
        'is_touchpoint' => false
      ],
      [
        'id' => uniqid(),
        'step' => 12,
        'description' => 'Selecionar "iniciar filme"',
        'is_touchpoint' => true
      ],
      [
        'id' => uniqid(),
        'step' => 13,
        'description' => 'Abrir player de vídeo',
        'is_touchpoint' => false
      ],
      [
        'id' => uniqid(),
        'step' => 14,
        'description' => 'Iniciar exibição do filme',
        'is_touchpoint' => false
      ]
    ];

    DB::table('journeys')->insert([
      'title' => 'Assistir um filme',
      'steps' => json_encode($journeySteps),
      'project_id' => $projectId,
      'created_at' => now(),
      'updated_at' => now(),
    ]);
  }
=======
>>>>>>> Stashed changes
}
