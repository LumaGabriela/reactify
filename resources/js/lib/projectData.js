//exemplo
// nomeDoElemento : {
// title: 'NomeDoElemento',
// description: 'Descrição do elemento',
// classNames: {
//   badge: 'bg-purple-600 ',
// },
// }

import { Button } from '@/components/ui/button'

const tooltipInfo = {
  // tooltips do navMenu
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
      'As histórias épicas são relatos de eventos que ocorrem em um contexto específico, como a criação de contas para acessar o sistema, a gestão de playlists para organizar músicas e outras funcionalidades voltadas para a experiência do usuário.',
  },
  businessRules: {
    title: 'Business Rules',
    description:
      'As regras de negócio são instruções que definem as regras e restrições que devem ser seguidas para garantir a integridade e a consistência do sistema.',
  },
  useScenarios: {
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
      'As histórias épicas são histórias de alto nível que descrevem um conjunto de funcionalidades relacionadas as historias originais de modo que se tornaram itens separados',
    classNames: {
      badge: 'bg-orange-600 ',
      button: 'max-w-md md:max-w-2xl',
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
