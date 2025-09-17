//exemplo
// nomeDoElemento : {
// title: 'NomeDoElemento',
// description: 'Descrição do elemento',
// classNames: {
//   badge: 'bg-purple-600 ',
// },
// }

const tooltipInfo = {
  // tooltips do navMenu
  // all ceremonies/tools
  inception: {
    title: 'Inception',
    description:
      'Esta cerimônia visa estabelecer uma visão de alto nível do produto, definindo o que ele é e o que não é, o problema de negócio que ele busca resolver, suas restrições e seus usuários-chave ou fornecedores de requisitos. É dividida em quatro etapas principais: obter a visão do produto (gerando um Product Canvas), obter um Goal Sketch (metas e restrições de negócio), obter Personas (modelando usuários-chave) e obter Journeys (mapeando a interação do usuário com o sistema). Todos os atores do REACT (Customer, Domain Expert, Team e Facilitator) participam, e ela ocorre geralmente no início do projeto, podendo ser repetida dependendo das mudanças ou antes de cada entrega.',
  },
  storyDiscovery: {
    title: 'Story Discovery',
    description:
      'O principal objetivo desta cerimônia é elicitar e priorizar os requisitos do software, que são representados por estórias de usuário (funcionais) e estórias do sistema (não-funcionais), a partir dos objetivos das personas e das jornadas de usuário, bem como das restrições do produto e metas de negócio. Também se inicia a construção de um Overall Model do produto, que descreve as classes, objetos e suas relações internas utilizando a técnica de CRC cards, e as estórias são priorizadas com base no valor de negócio e complexidade de implementação. Todos os atores do REACT participam.',
  },
  refining: {
    title: 'Refining',
    description:
      'Esta cerimônia é focada em detalhar e elaborar as estórias mais prioritárias, refinando os requisitos com maior riqueza de detalhes, descobrindo as regras de negócio e estabelecendo os cenários de uso ou aceitação. As estórias épicas (muito grandes) são decompostas em estórias menores para facilitar a entrega de valor mais rapidamente. A partir da análise das estórias de usuário, são identificadas e registradas as regras de negócio, e são definidos Cenários de Aceitação para as estórias prioritárias, descrevendo as condições para sua validação após a implementação. Todos os atores do REACT participam.',
  },
  modeling: {
    title: 'Modeling',
    description:
      'O objetivo desta cerimônia é detalhar as estórias sob a perspectiva dos objetos do produto e seus componentes, refinando os requisitos mais técnicos em termos de modelagem e implementação. As etapas incluem a modelagem funcional (definição de responsabilidades dos CRC cards), a modelagem de interfaces (identificação de interfaces internas e externas do software) e a modelagem de conceitos operacionais (criação de protótipos como UI Storyboards para simular o fluxo operacional e facilitar a validação pelo Customer e a implementação pela equipe técnica). Todos os atores do REACT participam.',
  },
  inspection: {
    title: 'Inspection',
    description:
      'Esta cerimônia tem como objetivo a verificação e validação contínua dos requisitos desenvolvidos ao longo das cerimônias do REACT e REACT-M, devendo ser realizada ao fim de cada uma delas ou em paralelo com Discovery, Refining e Modeling. A avaliação da viabilidade dos requisitos é feita com o auxílio dos critérios INVEST (Independent, Negotiable, Valuable, Estimable, Sized-Appropriately, Testable), que representam características desejáveis para os requisitos, e são utilizados check cards e inconsistency cards para registrar a avaliação e as soluções para inconsistências. Nesta cerimônia, também se busca mensurar o esforço necessário para o desenvolvimento das User Stories, utilizando técnicas como Planning Poker.',
  },
  productBacklog: {
    title: 'Product Backlog',
    description:
      'É uma lista de tarefas, especificamente as estórias (de usuário e do sistema) que foram levantadas e priorizadas nas cerimônias de Inception e Story Discovery, e que a equipe se compromete a entregar. O Domain Expert é o responsável por manter o Product Backlog atualizado e gerenciado, garantindo que o produto seja entregue incrementalmente e gere valor de negócio para os usuários, com as estórias priorizadas para auxiliar o Customer a definir a ordem de entrega das partes do produto. O REACT-M sugere a utilização de um Kanban adaptado para o Domain Expert para auxiliar o gerenciamento.',
  },
  sprint: {
    title: 'Sprint',
    description:
      'Constitui o conjunto de estórias que foram selecionadas do Product Backlog para serem implementadas no ciclo de desenvolvimento atual (sprint). As Users Stories de maior prioridade, definidas pelo Customer, são movidas para esta raia no Domain Expert Kanban, indicando que devem ser implementadas no ciclo corrente. O Team também utiliza um Kanban adaptado (Team Kanban), onde as Users Stories selecionadas são colocadas na raia "Sprint Backlog" e a equipe discute e adiciona as tarefas necessárias para entregá-las na raia "To Do".',
  },
  // inception
  productCanvas: {
    title: 'Product Canvas',
    description:
      'Visualize todos os itens do projeto, incluindo personas, objetivos e jornadas.',
  },
  goals: {
    title: 'Goals',
    description:
      'Objetivos principais do projeto, indicando metas e resultados esperados.',
  },
  personas: {
    title: 'Personas',
    description:
      'Perfis representativos dos usuários do sistema, com expectativas, restrições e objetivos.',
  },
  journeys: {
    title: 'Journeys',
    description:
      'Sequências de etapas (jornadas) que descrevem o caminho do usuário ou do administrador para atingir um objetivo no sistema.',
  },
  aiGeneratedJourney: {
    title: 'AI Generated Journeys',
    description:
      ' This function uses AI to generate journeys based on the Goals defined in the Personas.',
  },
  //story discovery
  stories: {
    title: 'Stories',
    description:
      'Histórias de usuários e requisitos do sistema que detalham funcionalidades e necessidades do projeto.',
  },
  prioritizationMatrix: {
    title: 'Prioritization Matrix',
    description: 'Matriz para priorizar as histórias de usuário.',
  },
  changeLog: {
    title: 'Change Log',
    description: 'Registro de mudanças.',
  },

  //
  // refining
  epicStories: {
    title: 'Epic Stories',
    description:
      'As histórias épicas são histórias de complexas o bastante que necessitam ser divididas em várias histórias de usuário para serem implementadas.',
  },
  businessRules: {
    title: 'Business Rules',
    description:
      'As regras de negócio são instruções que definem as regras e restrições que devem ser seguidas para garantir a integridade e a consistência do sistema.',
  },
  usageScenarios: {
    title: 'Use Cases',
    description:
      'Os casos de uso são relatos de eventos que ocorrem em um contexto específico, como a criação de contas para acessar o sistema, a gestão de playlists para organizar músicas e outras funcionalidades voltadas para a experiência do usuário.',
    classNames: {
      badge: 'bg-purple-600 ',
    },
  },
  //modeling
  overallModel: {
    title: 'Overall Model',
    description:
      'O modelo geral é uma visão abrangente do sistema, que inclui todas as funcionalidades e requisitos do aplicativo.',
    classNames: {
      badge: 'bg-purple-600 ',
    },
  },
  interfaces: {
    title: 'Interfaces',
    description:
      'As interfaces são as formas como os usuários interagem com o sistema, como a interface de usuário para acessar o aplicativo e a interface de API para integrar com outros sistemas.',
    classNames: {
      badge: 'bg-purple-600 ',
    },
  },
  storyboards: {
    title: 'Storyboards',
    description:
      'Os storyboards são visões detalhadas das interfaces do aplicativo, que mostram como os usuários interagem com o sistema em diferentes cenários.',
    classNames: {
      badge: 'bg-purple-600 ',
    },
  },
  //inspection
  inspection: {
    title: 'Inspection',
    description:
      'As inspeções são atividades de avaliação e melhoria do sistema, como a análise de usabilidade, a revisão de código e outras tarefas que garantem a qualidade e a eficiência do sistema.',
    classNames: {
      badge: 'bg-purple-600 ',
    },
  },
  // tooltips internos
  userStory: {
    title: 'User Stories',
    description:
      'As histórias de usuário focam nas necessidades dos usuários do aplicativo, como a criação de contas para acessar o sistema, a gestão de playlists para organizar músicas e outras funcionalidades voltadas para a experiência do usuário.',
    classNames: {
      badge: 'bg-purple-600 ',
    },
  },
  systemStory: {
    title: 'System Stories',
    description:
      'As histórias de sistema abordam funcionalidades administrativas e técnicas, como o gerenciamento de usuários para controle de acesso e      outras tarefas que garantem o funcionamento e a manutenção do sistema ',
    classNames: {
      badge: 'bg-orange-600 ',
    },
  },
  aiGeneratedStory: {
    title: 'Gerar com IA',
    description:
      'Esta função utiliza IA para gerar Users Stories baseadas nos Objetivos das Personas e Journeys do Produto e gerar System Stories baseadas nas do e Goals do tipo Constraint(CG).',
  },
  epicStory: {
    title: 'O que é uma História Epica?',
    description:
      'As histórias épicas são histórias de complexas o bastante que necessitam ser divididas em várias histórias de usuário para serem implementadas.',
    classNames: {
      badge: 'bg-orange-600 ',
      // button: 'max-w-md md:max-w-2xl',
    },
  },
  businessRule: {
    title: 'O que é uma Business Rule (regra de negócio)?',
    description:
      'As regras de negócio são regras que o aplicativo deve seguir, como garantir que os usuários tenham acesso a recursos apenas se estiverem autenticados ou garantir que os usuários não possam acessar recursos que não estão disponíveis.',
    classNames: {
      button: 'max-w-md md:max-w-2xl',
    },
  },
  businessGoal: {
    title: 'Business Goals',
    description:
      'Os objetivos de negócios são metas específicas que o aplicativo busca alcançar, como aumentar a taxa de conversão de usuários para clientes pagantes ou aumentar a frequência de uso do aplicativo.',
    classNames: {
      badge: 'bg-orange-600 ',
    },
  },

  constraintGoal: {
    title: 'Constraint Goals',
    description:
      'Os objetivos de restrição são metas específicas que o aplicativo busca alcançar, como aumentar a taxa de conversão de usuários para clientes pagantes ou aumentar a frequência de uso do aplicativo.',
    classNames: {
      badge: 'bg-purple-600 ',
    },
  },
}

export { tooltipInfo }
