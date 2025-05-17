  // const [project1, setProject] = useState(
  //   {
  //     id: 1,
  //     name: "Spotify Clone",
  //     visaoGeral: "Aplicação capaz de realizar streaming de músicas, com a possibilidade de criar playlists e compartilhar com amigos.",
  //     key: "project-key",
  //     productCanvas: {
  //       name: "Spotify Clone",
  //       issues: [
  //         'Acesso difícil o u limitado a músicas em domínio público..', 'Valores excessivos praticados pelas plataformas de streaming'
  //       ],
  //       solutions: ['Criar uma plataforma.......'],
  //       personas: ['Logn - Administrador da plataforma', 'Thiago - Usuário'],
  //       restrictions: ['A plataforma deve bla bla bla..'],
  //       is: ['É uma plataforma web', 'É uma plataforma de streaming de música', 'Possui funcionalidades de criação de playlists', 'Possui funcionalidades de compartilhamento de playlists'],
  //       isNot: ['Não é um aplicativo móvel']

  //     },
  //     stories: [
  //       {
  //         id: 1,
  //         title: "Como usuário, quero criar uma conta para acessar o aplicativo",
  //         type: "user"
  //       },
  //       {
  //         id: 2,
  //         title: "Como usuário, quero criar e gerenciar playlists para organizar minhas músicas",
  //         type: "user"
  //       },
  //       {
  //         id: 3,
  //         title: "Como administrador, quero gerenciar usuários para manter o controle de acesso ao sistema",
  //         type: "system"
  //       },
  //       {
  //         id: 4,
  //         title: "Guaxinim fofo",
  //         type: "system"
  //       }
  //     ],
  //     goal_sketches: [
  //       { type: 'BG', title: "Definir os requisitos do aplicativo", priority: 'HIGH', id: '123' },
  //       { type: 'CG', title: "Reunir requisitos funcionais e não funcionais", priority: 'MED', id: '321' },
  //       { type: 'BG', title: "Guaxinim", priority: 'LOW', id: '1233' }
  //       //bg: business goal, cg:constraint goal
  //     ],
  //     personas: [{
  //       id: '1',
  //       name: "Thiago - Administrador do sistema",
  //       profile: [],
  //       expectations: [],
  //       restrictions: [],
  //       goals: []

  //     },
  //     {
  //       id: '2',
  //       name: "João - Usuário do sistema",
  //       profile: ['', ''],
  //       expectations: [],
  //       restrictions: [],
  //       goals: ['', '']
  //     }
  //     ],
  //     journeys: [
  //       {
  //         name: "Usuário cria uma conta",
  //         steps: [
  //           { step: 0, description: "Usuário acessa a página de cadastro", touchpoint: false },
  //           { step: 1, description: "Usuário clica no botão 'Sign Up'", touchpoint: false },
  //           { step: 2, description: "Usuário é redirecionado para a página de cadastro", touchpoint: false },
  //           { step: 3, description: "Usuário preenche o formulário de cadastro", touchpoint: false },
  //           { step: 4, description: "Usuário insere nome, email e senha", touchpoint: false },
  //           { step: 5, description: "Usuário clica no botão 'Cadastrar'", touchpoint: false },
  //           { step: 6, description: "Usuário confirma o email", touchpoint: false },
  //           { step: 7, description: "Usuário recebe um email de confirmação", touchpoint: false },
  //           { step: 8, description: "Usuário clica no link de confirmação no email", touchpoint: false },
  //           { step: 9, description: "Usuário faz login", touchpoint: false },
  //           { step: 10, description: "Usuário insere email e senha na página de login", touchpoint: false },
  //           { step: 11, description: "Usuário clica no botão 'Log In'", touchpoint: false },
  //           { step: 12, description: "Usuário é redirecionado para a página inicial", touchpoint: true }
  //         ]
  //       },
  //       {
  //         name: "Usuário cria uma playlist",
  //         steps: [
  //           { step: 0, description: "Usuário acessa a página de playlists", touchpoint: false },
  //           { step: 1, description: "Usuário clica no menu 'Playlists'", touchpoint: false },
  //           { step: 2, description: "Usuário é redirecionado para a página de playlists", touchpoint: false },
  //           { step: 3, description: "Usuário cria uma nova playlist", touchpoint: false },
  //           { step: 4, description: "Usuário clica no botão 'Nova Playlist'", touchpoint: false },
  //           { step: 5, description: "Usuário insere o nome da playlist", touchpoint: false },
  //           { step: 6, description: "Usuário clica no botão 'Criar'", touchpoint: false },
  //           { step: 7, description: "Usuário adiciona músicas à playlist", touchpoint: false },
  //           { step: 8, description: "Usuário pesquisa por músicas", touchpoint: false },
  //           { step: 9, description: "Usuário clica no botão 'Adicionar' ao lado das músicas desejadas", touchpoint: false },
  //           { step: 10, description: "Usuário compartilha a playlist", touchpoint: false },
  //           { step: 11, description: "Usuário clica no botão 'Compartilhar'", touchpoint: false },
  //           { step: 12, description: "Usuário escolhe a forma de compartilhamento (link, redes sociais, etc.)", touchpoint: false },
  //           { step: 13, description: "Usuário envia a playlist para amigos", touchpoint: false }
  //         ]
  //       }
  //     ]
  //   },);