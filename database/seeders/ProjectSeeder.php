<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class ProjectSeeder extends Seeder
{
  public function run(): void
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
    $user1 = DB::table("users")
      ->where("email", "admin@example.com")
      ->first();

    if (!$user1) {
      $userId1 = DB::table("users")->insertGetId([
        "name" => "Admin",
        "email" => "admin@example.com",
        "password" => Hash::make("senha123"),
        // "user_role_id" => $adminRoleId,
        "active" => true,
        "email_verified_at" => now(),
        "created_at" => now(),
        "updated_at" => now(),
      ]);
    } else {
      $userId1 = $user1->id;
    }

    // Criar Usuário katlen
    $user2 = DB::table("users")
      ->where("email", "katlenvanessa15@gmail.com")
      ->first();

    if (!$user2) {
      $userId2 = DB::table("users")->insertGetId([
        "name" => "Kat",
        "email" => "katlenvanessa15@gmail.com",
        "password" => Hash::make("senha123"),
        // "user_role_id" => $adminRoleId,
        "active" => true,
        "email_verified_at" => now(),
        "created_at" => now(),
        "updated_at" => now(),
      ]);
    } else {
      $userId2 = $user2->id;
    }

    // Criar Usuário luma
    $user3 = DB::table("users")
      ->where("email", "lumagabriela1333@gmail.com")
      ->first();

    if (!$user3) {
      $userId3 = DB::table("users")->insertGetId([
        "name" => "luma",
        "email" => "lumagabriela1333@gmail.com",
        "password" => Hash::make("senha123"),
        // "user_role_id" => $adminRoleId,
        "active" => true,
        "email_verified_at" => now(),
        "created_at" => now(),
        "updated_at" => now(),
      ]);
    } else {
      $userId3 = $user3->id;
    }

    // Criar Projeto
    $projectId = DB::table("projects")->insertGetId([
      "title" => "Projeto Exemplo",
      "description" => "Descrição do projeto exemplo.",
      "active" => true,
      "created_at" => now(),
      "updated_at" => now(),
    ]);

    // Vincular Usuários ao Projeto
    DB::table("user_project")->insert([
      [
        "user_id" => $userId1,
        "role" => "admin",
        "project_id" => $projectId,
        "created_at" => now(),
        "updated_at" => now(),
      ],
      [
        "user_id" => $userId2,
        "role" => "admin",
        "project_id" => $projectId,
        "created_at" => now(),
        "updated_at" => now(),
      ],
    ]);

    // Criar Product Canvas vinculado ao Projeto
    DB::table("product_canvas")->insertGetId([
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

    // Criar Prioridade
    DB::table("priorities")->insertGetId([
      "value" => "Alta",
    ]);

    // Criar Goal Sketch
    DB::table("goal_sketches")->insert([
      [
        "title" => "Atendimento às leis de direitos autorais e relacionadas à conteúdo em domínio público.",
        "type" => "cg",
        "priority" => "medium",
        "project_id" => $projectId,
        "created_at" => now(),
        "updated_at" => now(),
      ],
      [
        "title" => "Atendimento às leis de proteção do consumidor.",
        "type" => "cg",
        "priority" => "medium",
        "project_id" => $projectId,
        "created_at" => now(),
        "updated_at" => now(),
      ],
      [
        "title" => "Conformidade com padrões de segurança da informação.",
        "type" => "cg",
        "priority" => "low",
        "project_id" => $projectId,
        "created_at" => now(),
        "updated_at" => now(),
      ],
      [
        "title" => "Atendimento às leis de proteção de dados pessoais.",
        "type" => "cg",
        "priority" => "low",
        "project_id" => $projectId,
        "created_at" => now(),
        "updated_at" => now(),
      ],
      [
        "title" => "Assegurar que a plataforma funcione adequadamente nos navegadores web baseados no Chromium, Opera, Safari e Mozilla Firefox.",
        "type" => "cg",
        "priority" => "high",
        "project_id" => $projectId,
        "created_at" => now(),
        "updated_at" => now(),
      ],
    ]);

    // Criar Stories
    DB::table("stories")->insert([
      [
        "title" => "Como usuário, quero criar uma conta para acessar o aplicativo",
        "type" => "user",
        "project_id" => $projectId,
        "created_at" => now(),
        "updated_at" => now(),
      ],
      [
        "title" => "Como usuário, quero criar e gerenciar playlists para organizar minhas músicas",
        "type" => "user",
        "project_id" => $projectId,
        "created_at" => now(),
        "updated_at" => now(),
      ],
      [
        "title" => "Como administrador, quero gerenciar usuários para manter o controle de acesso ao sistema",
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
      ["id" => uniqid(), "step" => 1, "description" => "Acessar a plataforma", "is_touchpoint" => false,],
      ["id" => uniqid(), "step" => 2, "description" => "Abrir a página", "is_touchpoint" => false,],
      ["id" => uniqid(), "step" => 3, "description" => "Logar na plataforma", "is_touchpoint" => false,],
      ["id" => uniqid(), "step" => 4, "description" => "Abrir tela inical de usuário", "is_touchpoint" => false,],
      ["id" => uniqid(), "step" => 5, "description" => 'Exibir opções "exibir catálogo" e "comunidade"', "is_touchpoint" => false,],
      ["id" => uniqid(), "step" => 6, "description" => 'Selecionar opção "exibir catálogo"', "is_touchpoint" => true,],
      ["id" => uniqid(), "step" => 7, "description" => "Mostrar categorias de filmes", "is_touchpoint" => false,],
      ["id" => uniqid(), "step" => 8, "description" => "Selecionar um filme", "is_touchpoint" => true,],
      ["id" => uniqid(), "step" => 9, "description" => "Exibir sinopse e ficha técnica", "is_touchpoint" => false,],
      ["id" => uniqid(), "step" => 10, "description" => "Exibir média de notas dadas por outros usuários", "is_touchpoint" => false,],
      ["id" => uniqid(), "step" => 11, "description" => 'Exibir opção "iniciar filme", "assistir depois" e "escrever comentário"', "is_touchpoint" => false,],
      ["id" => uniqid(), "step" => 12, "description" => 'Selecionar "iniciar filme"', "is_touchpoint" => true,],
      ["id" => uniqid(), "step" => 13, "description" => "Abrir player de vídeo", "is_touchpoint" => false,],
      ["id" => uniqid(), "step" => 14, "description" => "Iniciar exibição do filme", "is_touchpoint" => false,],
    ];

    DB::table("journeys")->insert([
      "title" => "Assistir um filme",
      "steps" => json_encode($journeySteps),
      "project_id" => $projectId,
      "created_at" => now(),
      "updated_at" => now(),
    ]);

    // crc cards - overall model

    $crcCards = [
      [
        'class' => 'Filme', // 'title' alterado para 'class'
        'responsabilities' => json_encode([
          'Ficha Técnica',
          'Média de notas dos usuários',
          'Resenhas e comentários dos usuários',
        ]),
        'collaborators' => json_encode(['Categoria de Filme', 'Legenda']),
      ],
      [
        'class' => 'Legenda', // 'title' alterado para 'class'
        'responsabilities' => json_encode(['Idioma', 'Cor', 'Tamanho']),
        'collaborators' => json_encode(['Filme', 'Player de Vídeo']),
      ],
      [
        'class' => 'Player de Vídeo', // 'title' alterado para 'class'
        'responsabilities' => json_encode([
          'Controle de resolução',
          'Controle de volume',
          'Botão iniciar/pausar',
          'Botão avançar vídeo',
          'Botão retroceder vídeo',
          'Botão tela cheia',
        ]),
        'collaborators' => json_encode(['Filme', 'Legenda']),
      ],
      [
        'class' => 'Categoria de Filme', // 'title' alterado para 'class'
        'responsabilities' => json_encode([
          'Gênero de filme',
          'Ano de lançamento',
          'Mais assistidos',
          'Maiores notas',
        ]),
        'collaborators' => json_encode(['Filme', 'Administrador']),
      ],
      [
        'class' => 'Usuário', // 'title' alterado para 'class'
        'responsabilities' => json_encode([
          'Editar perfil',
          'Seguir usuário',
          'Fazer requisição',
          'ID de usuário',
          'Playlists',
          'Resenhas',
          'Notas',
          'Seguidores',
        ]),
        'collaborators' => json_encode(['Cadastro', 'Perfil de Usuário', 'Assinatura', 'Doação']),
      ],
      [
        'class' => 'Perfil de Usuário', // 'title' alterado para 'class'
        'responsabilities' => json_encode([
          'Foto de perfil',
          'Nome de usuário',
          'ID usuário',
          'Biografia do usuário',
          'Últimos filmes assistidos',
          'Filmes favoritos',
          'Últimas resenhas ou comentários',
        ]),
        'collaborators' => json_encode(['Usuário', 'Cadastro']),
      ],
      [
        'class' => 'Cadastro', // 'title' alterado para 'class'
        'responsabilities' => json_encode([
          'E-mail',
          'Senha',
          'CPF',
          'Nome de usuário',
          'ID de usuário',
        ]),
        'collaborators' => json_encode(['Usuário']),
      ],
      [
        'class' => 'Assinatura', // 'title' alterado para 'class'
        'responsabilities' => json_encode(['Plano', 'Forma de Pagamento']),
        'collaborators' => json_encode(['Usuário', 'Cadastro']),
      ],
    ];

    // 2. Adicionar o ID do Projeto e timestamps a cada card
    // Agora vinculamos diretamente ao '$projectId', sem o OverallModel.
    $crcCardsToInsert = array_map(function ($card) use ($projectId) {
      $card['project_id'] = $projectId; // Vinculado diretamente ao projeto
      $card['created_at'] = now();
      $card['updated_at'] = now();
      return $card;
    }, $crcCards);

    // 3. Inserir todos os CRC Cards no banco de dados com uma única query
    DB::table('crc_cards')->insert($crcCardsToInsert);
  }
}
