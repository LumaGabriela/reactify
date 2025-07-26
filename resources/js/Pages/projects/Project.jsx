import { useEffect, useState } from 'react'
import { useEcho } from '@laravel/echo-react'
import { Head, router } from '@inertiajs/react'
import NavMenu from '../../Components/NavMenu'
import MainView from './MainView'
import Stories from './Stories'
import Personas from './Personas'
import Journeys from './Journeys'
import Goals from './Goals'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { PenLine, X } from 'lucide-react'
import { toast } from 'sonner'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { ProjectPermissions } from '@/Components/ProjectPermissions'

const ProjectView = ({ projectDB = [], page = 'inception' }) => {
  const [project, setProject] = useState({ ...projectDB })
  const [isEditing, setIsEditing] = useState(false)
  const [newTitle, setNewTitle] = useState(project.title)

  // Inception States
  const [activeMenu, setActiveMenu] = useState(
    () => localStorage.getItem('activeMenu') || 'All',
  )
  const [menuItems, setMenuItems] = useState([
    {
      label: 'All',
      value: true,
      tooltip:
        'Visualize todos os itens do projeto, incluindo personas, objetivos e jornadas.',
    },
    {
      label: 'Personas',
      value: false,
      tooltip:
        'Perfis representativos dos usuários do sistema, com expectativas, restrições e objetivos.',
    },
    {
      label: 'Goals',
      value: false,
      tooltip:
        'Objetivos principais do projeto, indicando metas e resultados esperados.',
    },
    {
      label: 'Journeys',
      value: false,
      tooltip:
        'Sequências de etapas (jornadas) que descrevem o caminho do usuário ou do administrador para atingir um objetivo no sistema.',
    },
  ])

  // Story Discovery States
  const [activeStoryDiscoveryMenu, setActiveStoryDiscoveryMenu] = useState(
    () => localStorage.getItem('activeStoryDiscoveryMenu') || 'Stories',
  )
  const [storyDiscoveryMenuItems, setStoryDiscoveryMenuItems] = useState([
    {
      label: 'Stories',
      value: true,
      tooltip:
        'Histórias de usuários e requisitos do sistema que detalham funcionalidades e necessidades do projeto.',
    },
    {
      label: 'Matriz de Priorização',
      value: false,
      tooltip: 'Matriz para priorizar as histórias de usuário.',
    },
    {
      label: 'Change Log',
      value: false,
      tooltip: 'Registro de mudanças.',
    },
  ])

  // Refining States
  const [activeRefiningMenu, setActiveRefiningMenu] = useState(
    () => localStorage.getItem('activeRefiningMenu') || 'Epic Stories',
  )
  const [refiningMenuItems, setRefiningMenuItems] = useState([
    {
      label: 'Epic Stories',
      value: true,
      tooltip: 'Histórias épicas.',
    },
    {
      label: 'Business Rules',
      value: false,
      tooltip: 'Regras de negócio.',
    },
    {
      label: 'Use Scenarios',
      value: false,
      tooltip: 'Cenários de uso.',
    },
  ])

  // Modeling States
  const [activeModelingMenu, setActiveModelingMenu] = useState(
    () => localStorage.getItem('activeModelingMenu') || 'Overall Model',
  )
  const [modelingMenuItems, setModelingMenuItems] = useState([
    {
      label: 'Overall Model',
      value: true,
      tooltip: 'Modelo geral.',
    },
    {
      label: 'Internal and External Interfaces',
      value: false,
      tooltip: 'Interfaces internas e externas.',
    },
    {
      label: 'Storyboards',
      value: false,
      tooltip: 'Storyboards.',
    },
  ])

  const updateProjectTitle = () => {
    setProject({ ...project, title: newTitle })
    setIsEditing(false)
    router.patch(route('project.update', project.id), {
      title: newTitle,
    })
  }

  const getUpdatedProject = async (projectID) => {
    try {
      const response = await fetch('/api/project/' + projectID, {
        method: 'GET',
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
        },
      })
      const data = await response.json()
      if (response.ok) {
        setProject(data.project)
      }
    } catch (error) {
      toast.error(
        'Erro ao obter o projeto ' +
          projectID +
          ' atualizado: ' +
          error.message,
      )
    } finally {
      console.log('Projeto atualizado com sucesso!')
    }
  }

  // Websocket for project updates
  useEcho(`project.${project.id}`, 'ProjectUpdated', (e) => {
    getUpdatedProject(e.project_id)
  })

  // Effect for Inception menu
  useEffect(() => {
    const updatedMenuItems = menuItems.map((item) => ({
      ...item,
      value: item.label === activeMenu,
    }))
    setMenuItems(updatedMenuItems)
    localStorage.setItem('activeMenu', activeMenu)
  }, [activeMenu])

  // Effect for Story Discovery menu
  useEffect(() => {
    const updatedMenuItems = storyDiscoveryMenuItems.map((item) => ({
      ...item,
      value: item.label === activeStoryDiscoveryMenu,
    }))
    setStoryDiscoveryMenuItems(updatedMenuItems)
    localStorage.setItem('activeStoryDiscoveryMenu', activeStoryDiscoveryMenu) 
  }, [activeStoryDiscoveryMenu])

  // Effect for Refining menu
  useEffect(() => {
    const updatedMenuItems = refiningMenuItems.map((item) => ({
      ...item,
      value: item.label === activeRefiningMenu,
    }))
    setRefiningMenuItems(updatedMenuItems)
    localStorage.setItem('activeRefiningMenu', activeRefiningMenu)
  }, [activeRefiningMenu])

  // Effect for Modeling menu
  useEffect(() => {
    const updatedMenuItems = modelingMenuItems.map((item) => ({
      ...item,
      value: item.label === activeModelingMenu,
    }))
    setModelingMenuItems(updatedMenuItems)
    localStorage.setItem('activeModelingMenu', activeModelingMenu)
  }, [activeModelingMenu])

  useEffect(() => {
    // console.log(project?.goal_sketches)
  }, [project])

  const renderInceptionContent = () => {
    switch (activeMenu) {
      case 'All':
        return <MainView project={project} setProject={setProject} />
      case 'Personas':
        return <Personas project={project} setProject={setProject} />
      case 'Goals':
        return <Goals project={project} setProject={setProject} />
      case 'Journeys':
        return <Journeys project={project} setProject={setProject} />
      default:
        return null
    }
  }

  const PrioritizationMatrix = () => (
    <div className="w-full text-center p-4">
      <Button
        variant="link"
        onClick={() =>
          router.get(
            route('project.show', { project: project.id, page: 'backlog' }),
          )
        }
      >
        Go to Product Backlog
      </Button>
    </div>
  )

  const ProductBacklog = () => {
    const initialBoard = {
      productBacklog: [
        { id: 'PB-1', title: 'Implementar autenticação de usuário' },
        { id: 'PB-2', title: 'Criar painel de controle do usuário' },
        { id: 'PB-3', title: 'Desenvolver funcionalidade de upload de arquivos' },
      ],
      sprintBacklog: [
        { id: 'SB-1', title: 'Refatorar componente de header' },
        { id: 'SB-2', title: 'Corrigir bug na validação de formulário' },
      ],
      delivered: [{ id: 'D-1', title: 'Configurar ambiente de desenvolvimento' }],
    }

    const [board, setBoard] = useState(initialBoard)

    const columnTitles = {
      productBacklog: 'Product Backlog',
      sprintBacklog: 'Sprint Backlog',
      delivered: 'Delivered',
    }

    return (
      <div className="flex space-x-4 p-4 min-h-[500px]">
        {Object.keys(board).map((columnId) => (
          <div
            key={columnId}
            className="w-1/3 bg-muted rounded-lg p-3 flex flex-col"
          >
            <h2 className="text-lg font-bold mb-4 text-foreground px-1">
              {columnTitles[columnId]}
            </h2>
            <div className="space-y-3">
              {board[columnId].map((card) => (
                <div
                  key={card.id}
                  className="bg-card p-3 rounded-md shadow-sm text-sm text-foreground"
                >
                  {card.title}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    )
  }

  const ChangeLog = () => {
    const mockData = [
      {
        numero: 1,
        dataSolicitacao: '2024-07-26',
        responsavel: 'Ana',
        descricao: 'Implementar login com Google',
        impacto: 'US-101',
        novas: 'US-104, US-105',
        esforco: 5,
      },
      {
        numero: 2,
        dataSolicitacao: '2024-07-25',
        responsavel: 'Carlos',
        descricao: 'Criar página de perfil do usuário',
        impacto: 'US-102',
        novas: '',
        esforco: 8,
      },
      {
        numero: 3,
        dataSolicitacao: '2024-07-24',
        responsavel: 'Beatriz',
        descricao: 'Desenvolver funcionalidade de busca',
        impacto: 'US-103',
        novas: 'US-106',
        esforco: 13,
      },
    ]

    return (
      <div className="p-2">
        <div className="w-full text-center p-4">
          <Button
            variant="link"
            onClick={() =>
              router.get(
                route('project.show', { project: project.id, page: 'backlog' }),
              )
            }
          >
            Go to Product Backlog
          </Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead
                rowSpan={2}
                className="text-center"
              >
                Número
              </TableHead>
              <TableHead
                rowSpan={2}
                className="text-center"
              >
                Data da Solicitação
              </TableHead>
              <TableHead
                rowSpan={2}
                className="text-center"
              >
                Responsável
              </TableHead>
              <TableHead
                rowSpan={2}
                className="text-center"
              >
                Descrição
              </TableHead>
              <TableHead
                colSpan={2}
                className="text-center"
              >
                User Story
              </TableHead>
              <TableHead
                rowSpan={2}
                className="text-center"
              >
                Esforço
              </TableHead>
            </TableRow>
            <TableRow>
              <TableHead className="text-center">Impacto</TableHead>
              <TableHead className="text-center">Novas</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockData.map((item) => (
              <TableRow key={item.numero}>
                <TableCell className="text-center">{item.numero}</TableCell>
                <TableCell className="text-center">
                  {item.dataSolicitacao}
                </TableCell>
                <TableCell className="text-center">{item.responsavel}</TableCell>
                <TableCell>{item.descricao}</TableCell>
                <TableCell className="text-center">{item.impacto}</TableCell>
                <TableCell className="text-center">{item.novas}</TableCell>
                <TableCell className="text-center">{item.esforco}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

      </div>
    )
  }

  const renderStoryDiscoveryContent = () => {
    switch (activeStoryDiscoveryMenu) {
      case 'Stories':
        return <Stories project={project} setProject={setProject} />
      case 'Matriz de Priorização':
        return <PrioritizationMatrix />
      case 'Change Log':
        return <ChangeLog />
      default:
        return null
    }
  }

  const EpicStories = () => {
    const epicStory = {
      id: 'US10',
      title: 'Gerenciamento de Perfil de Usuário',
      description:
        'Eu como Leon Cardoso quero uma seção no painel de controle administrativo que exibe estatísticas, gráficos ou tabelas de visitas à plataforma para consultar o fluxo de visitas à plataforma.',
      userStories: [
        {
          id: 'US10.1',
          title: 'Eu como Leon Cardoso. quero uma seção no painel de controle administrativo que gere gráficos ou tabelas com os dados do fluxo de visitas à plataforma para consultar o fluxo de visitas à plataforma.',
        },
        {
          id: 'US10.2',
          title: 'Eu como Leon Cardoso quero uma seção no painel de controle administrativo que exibe o número de acessos totais e uma média aritmética de acessos diários para consultar o fluxo de visitas à plataforma.',
        }
      ],
    }

    return (
      <div className="p-4">
        <div className="bg-card border border-primary rounded-lg p-4 mb-6 shadow-lg">
          <h3 className="text-xl font-bold text-primary mb-2">
            {epicStory.id}
          </h3>
          <p className="text-foreground text-sm">{epicStory.description}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {epicStory.userStories.map((story, index) => (
            <div
              key={story.id}
              className="bg-muted rounded-lg p-4 border border-border"
            >
              <h4 className="font-semibold text-foreground mb-1 text-sm">
                {story.id}
              </h4>
              <p className="text-sm text-muted-foreground">{story.title}</p>
            </div>
          ))}
        </div>
      </div>
    )
  }
  const BusinessRules = () => {
    const businessRules = {
      id: 'US10',
      description:
        'Esta é uma User Story',
      userStories: [
        {
          id_rn: 'RN01',
          title: 'Esta é uma regra de negócio identificada através da User Story US10.',
          id_us: 'US10'
        },
        {
          id_rn: 'RN02',
          title: 'Esta é outra regra de negócio identificada através da User Story US10',
          id_us: 'US10'
        }
      ],
    }

    return (
      <div className="p-4">
        <div className="bg-card border border-primary rounded-lg p-4 mb-6 shadow-lg">
          <h3 className="text-xl font-bold text-primary mb-2">
            {businessRules.id}
          </h3>
          <p className="text-foreground text-sm">{businessRules.description}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {businessRules.userStories.map((story, index) => (
            <div
              key={story.id_rn}
              className="bg-muted rounded-lg p-4 border border-border"
            >
              <h4 className="font-semibold text-foreground mb-1 text-sm">
                {story.id_rn}
              </h4>
              <p className="text-sm text-muted-foreground">{story.title}</p>
              <br></br>
               <h4 className="font-semibold text-foreground mb-1 text-sm">
                {story.id_us}
              </h4>
            </div>
          ))}
        </div>
      </div>
    )
  }
  const UseScenarios = () => {
    const scenarios = [
      {
        id: 'US14',
        userStory:
          'Eu como Leon Cardoso quero uma opção de exclusão de filmes do catálogo da plataforma no painel de controle administrativo para remover um filme do catálogo.',
        scenario: {
          title: 'Administrador quer excluir um filme do catálogo',
          given:
            'que o Administrador está autenticado no painel de controle administrativo da plataforma.',
          when: 'o Administrador seleciona a opção de exclusão para um filme do catálogo.',
          then1:
            'o sistema exibe uma mensagem de confirmação solicitando a confirmação da exclusão.',
          and: 'o Administrador Cardoso confirma a exclusão.',
          then2:
            'uma mensagem de é exibida indicando que o filme foi removido com sucesso.',
        },
      },
    ]

    return (
      <div className="p-4">
        {scenarios.map((scenarioData) => (
          <div
            key={scenarioData.id}
            className="bg-card border border-border rounded-lg p-4 mb-6 shadow-lg"
          >
            <div className="bg-muted p-4 rounded-lg mb-4">
              <p className="font-semibold text-sm text-xl font-bold text-primary">
                {scenarioData.id}
              </p>
              <p className="font-semibold text-sm">
                {scenarioData.userStory}
              </p>
            </div>

            <Accordion
              type="single"
              collapsible
              className="w-full"
              defaultValue="item-1"
            >
              <AccordionItem
                value="item-1"
                className="border bg-muted text-muted-foreground rounded-lg px-4"
              >
                <AccordionTrigger className="font-semibold text-sm">
                  AS: {scenarioData.scenario.title}
                </AccordionTrigger>
                <AccordionContent className="px-2">
                  <ul className="list-disc pl-5 space-y-2 text-sm text-left">
                    <li>
                      <span className="font-semibold">GIVEN</span>{' '}
                      {scenarioData.scenario.given}
                    </li>
                    <li>
                      <span className="font-semibold">WHEN</span>{' '}
                      {scenarioData.scenario.when}
                    </li>
                    <li>
                      <span className="font-semibold">THEN</span>{' '}
                      {scenarioData.scenario.then1}
                    </li>
                    <li>
                      <span className="font-semibold">AND</span>{' '}
                      {scenarioData.scenario.and}
                    </li>
                    <li>
                      <span className="font-semibold">THEN</span>{' '}
                      {scenarioData.scenario.then2}
                    </li>
                  </ul>
                  <div className="text-right text-sm font-semibold mt-4">
                    {scenarioData.id}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        ))}
      </div>
    )
  }

  const renderRefiningContent = () => {
    switch (activeRefiningMenu) {
      case 'Epic Stories':
        return <EpicStories />
      case 'Business Rules':
        return <BusinessRules />
      case 'Use Scenarios':
        return <UseScenarios />
      default:
        return null
    }
  }

  const OverallModel = () => {
    const modelData = [
      {
        title: 'Filme',
        attributes: [
          'Ficha Técnica',
          'Média de notas dos usuários',
          'Resenhas e comentários dos usuários',
        ],
        relations: ['Categoria de Filme', 'Legenda'],
      },
      {
        title: 'Legenda',
        attributes: ['Idioma', 'Cor', 'Tamanho'],
        relations: ['Filme', 'Player de Vídeo'],
      },
      {
        title: 'Player de Vídeo',
        attributes: [
          'Controle de resolução',
          'Controle de volume',
          'Botão iniciar/pausar',
          'Botão avançar vídeo',
          'Botão retroceder vídeo',
          'Botão tela cheia',
        ],
        relations: ['Filme', 'Legenda'],
      },
      {
        title: 'Categoria de Filme',
        attributes: [
          'Gênero de filme',
          'Ano de lançamento',
          'Mais assistidos',
          'Maiores notas',
        ],
        relations: ['Filme', 'Administrador'],
      },
      {
        title: 'Usuário',
        attributes: [
          'Editar perfil',
          'Seguir usuário',
          'Fazer requisição',
          'ID de usuário',
          'Playlists',
          'Resenhas',
          'Notas',
          'Seguidores',
        ],
        relations: ['Cadastro', 'Perfil de Usuário', 'Assinatura', 'Doação'],
      },
      {
        title: 'Perfil de Usuário',
        attributes: [
          'Foto de perfil',
          'Nome de usuário',
          'ID usuário',
          'Biografia do usuário',
          'Últimos filmes assistidos',
          'Filmes favoritos',
          'Últimas resenhas ou comentários',
        ],
        relations: ['Usuário', 'Cadastro'],
      },
      {
        title: 'Cadastro',
        attributes: ['E-mail', 'Senha', 'CPF', 'Nome de usuário', 'ID de usuário'],
        relations: ['Usuário'],
      },
      {
        title: 'Assinatura',
        attributes: ['Plano', 'Forma de Pagamento'],
        relations: ['Usuário', 'Cadastro'],
      },
    ]

    return (
      <div className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {modelData.map((item, index) => (
            <div
              key={index}
              className="bg-card border border-border rounded-lg shadow-lg flex flex-col"
            >
              <h3 className="text-lg font-semibold bg-muted text-foreground p-3 rounded-t-lg border-b">
                {item.title}
              </h3>
              <div className="flex flex-grow">
                <div className="w-2/3 p-3">
                  <ul className="list-disc list-inside text-sm space-y-1">
                    {item.attributes.map((attr, i) => (
                      <li key={i}>{attr}</li>
                    ))}
                  </ul>
                </div>
                <div className="w-1/3 bg-muted/50 p-3 border-l rounded-r-lg flex flex-col justify-center">
                  <ul className="text-sm space-y-1">
                    {item.relations.map((rel, i) => (
                      <li key={i} className="font-medium">
                        {rel}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }
  const Interfaces = () => (
    <div className="w-full text-center p-4">
      Internal and External Interfaces Content
    </div>
  )
  const Storyboards = () => (
    <div className="w-full text-center p-4">Storyboards Content</div>
  )

  const renderModelingContent = () => {
    switch (activeModelingMenu) {
      case 'Overall Model':
        return <OverallModel />
      case 'Internal and External Interfaces':
        return <Interfaces />
      case 'Storyboards':
        return <Storyboards />
      default:
        return null
    }
  }

  return (
    <div className="project-view flex flex-col items-center justify-start px-1 w-full text-foreground">
      <div
        id="project-title-container"
        className="flex items-center justify-between text-3xl font-bold text-white text-center w-full my-4 p-0"
      >
        {/* tabs para alternar entre fases do projeto */}
        <Tabs
          value={page}
          onValueChange={(e) =>
            router.get(route('project.show', { project: project.id, page: e }))
          }
          className="w-full  "
        >
          <div className="flex gap-4 items-center justify-start w-full">
            <TabsList>
              <TabsTrigger value="inception">Inception</TabsTrigger>
              <TabsTrigger value="story-discovery">Story Discovery</TabsTrigger>
              <TabsTrigger value="refining">Refining</TabsTrigger>
              <TabsTrigger value="modeling">Modeling</TabsTrigger>
              <TabsTrigger value="backlog">Product Backlog</TabsTrigger>
            </TabsList>
            {/* title and change title button  */}
            <div
              id="project-title-content"
              className="flex gap-4 px-4 w-full cursor-pointer"
            >
              {isEditing ? (
                <Input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  onKeyUp={(e) => {
                    if (e.key === 'Enter') updateProjectTitle()
                  }}
                  className="bg-background  !text-3xl font-bold text-foreground text-center h-full p-0 border-0 m-0"
                />
              ) : (
                <p className="bg-background text-3xl font-bold text-foreground text-center h-full w-full p-0 border-0 m-0">
                  {project.title}
                </p>
              )}
              {page === 'inception' && (
                <>
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="text-foreground hover:text-white transition-colors"
                    title="Editar conteúdo"
                  >
                    {!isEditing ? <PenLine size={20} /> : <X size={20} />}
                  </button>
                  <ProjectPermissions projectId={project.id} />
                </>
              )}
            </div>
          </div>
          <TabsContent value="inception">
            <NavMenu menuItems={menuItems} setActiveMenu={setActiveMenu} />
            {renderInceptionContent()}
          </TabsContent>
          <TabsContent value="story-discovery">
            <NavMenu
              menuItems={storyDiscoveryMenuItems}
              setActiveMenu={setActiveStoryDiscoveryMenu}
            />
            {renderStoryDiscoveryContent()}
          </TabsContent>
          <TabsContent value="refining">
            <NavMenu
              menuItems={refiningMenuItems}
              setActiveMenu={setActiveRefiningMenu}
            />
            {renderRefiningContent()}
          </TabsContent>
          <TabsContent value="modeling">
            <NavMenu
              menuItems={modelingMenuItems}
              setActiveMenu={setActiveModelingMenu}
            />
            {renderModelingContent()}
          </TabsContent>
          <TabsContent value="backlog">
            <ProductBacklog />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
const Project = ({ project, page }) => {
  return (
    <>
      <Head title={project.title} />
      <AuthenticatedLayout>
        <ProjectView projectDB={project} page={page} />
      </AuthenticatedLayout>
    </>
  )
}
export default Project
