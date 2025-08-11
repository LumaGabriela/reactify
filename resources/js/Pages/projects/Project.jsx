import { useEcho } from '@laravel/echo-react'
import { Head, router } from '@inertiajs/react'
import NavMenu from '@/Components/NavMenu'
import { ProjectPermissions } from '@/Components/ProjectPermissions'
// inception
import MainView from './project-ceremonies/Inception/MainView.jsx'
import Personas from './project-ceremonies/Inception/Personas'
import Journeys from './project-ceremonies/Inception/Journeys'
import Goals from './project-ceremonies/Inception/Goals'
// story discovery
import Stories from './project-ceremonies/StoryDiscovery/Stories'
import PrioritizationMatrix from './project-ceremonies/StoryDiscovery/PrioritizationMatrix.jsx'
import ChangeLog from './project-ceremonies/StoryDiscovery/ChangeLog.jsx'
// refining
import EpicStories from './project-ceremonies/Refining/EpicStories.jsx'
import BusinessRules from './project-ceremonies/Refining/BusinessRules.jsx'
import UseScenarios from './project-ceremonies/Refining/UseScenarios.jsx'
//modeling
import OverallModel from './project-ceremonies/Modeling/OverallModel'
import Interfaces from './project-ceremonies/Modeling/Interfaces.jsx'
import Storyboards from './project-ceremonies/Modeling/Storyboards.jsx'
//
import ProductBacklog from './project-ceremonies/ProductBacklog/ProductBacklog.jsx'
//components
import { PenLine, X } from 'lucide-react'
import { toast } from 'sonner'

import MainLayout from '@/Layouts/MainLayout'

import Sprint from './project-ceremonies/Sprint/Sprint'

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
        console.log(data.project)
      }
    } catch (error) {
      toast.error(
        'Erro ao obter o projeto ' +
          projectID +
          ' atualizado: ' +
          error.message,
      )
    } finally {
      // console.log('Projeto atualizado com sucesso!')
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
    // console.log(project?.crc_cards)
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

  const renderStoryDiscoveryContent = () => {
    switch (activeStoryDiscoveryMenu) {
      case 'Stories':
        return <Stories project={project} setProject={setProject} />
      case 'Matriz de Priorização':
        return (
          <PrioritizationMatrix project={project} setProject={setProject} />
        )
      case 'Change Log':
        return <ChangeLog project={project} setProject={setProject} />
      default:
        return null
    }
  }

  const renderRefiningContent = () => {
    switch (activeRefiningMenu) {
      case 'Epic Stories':
        return <EpicStories project={project} setProject={setProject} />
      case 'Business Rules':
        return <BusinessRules project={project} setProject={setProject} />
      case 'Use Scenarios':
        return <UseScenarios project={project} setProject={setProject} />
      default:
        return null
    }
  }

  const renderModelingContent = () => {
    switch (activeModelingMenu) {
      case 'Overall Model':
        return <OverallModel project={project} setProject={setProject} />
      case 'Internal and External Interfaces':
        return <Interfaces project={project} setProject={setProject} />
      case 'Storyboards':
        return <Storyboards project={project} setProject={setProject} />
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
              <TabsTrigger value="sprint">Sprint</TabsTrigger>
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
            <ProductBacklog project={project} setProject={setProject} />
          </TabsContent>
          <TabsContent value="sprint">
            <Sprint project={project} setProject={setProject} />
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
      <ProjectView projectDB={project} page={page} />
    </>
  )
}

Project.layout = (page) => <MainLayout children={page} />

export default Project
