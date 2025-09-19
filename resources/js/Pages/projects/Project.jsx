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
import UsageScenarios from './project-ceremonies/Refining/UsageScenarios.jsx'
//modeling
import OverallModel from './project-ceremonies/Modeling/OverallModel'
import Interfaces from './project-ceremonies/Modeling/Interfaces.jsx'
import Storyboards from './project-ceremonies/Modeling/Storyboards/Storyboards.jsx'
//
import ProductBacklog from './project-ceremonies/ProductBacklog/ProductBacklog.jsx'
//components
import { ArrowLeft, PenLine, X } from 'lucide-react'
import { toast } from 'sonner'

import MainLayout from '@/Layouts/MainLayout'

import Sprint from './project-ceremonies/Sprint/Sprint'
import { tooltipInfo } from '@/lib/projectData.js'
import Inspection from './project-ceremonies/Inspection/Inspection.jsx'
//chatbot
import ChatBot from './ChatBot.jsx'
import { ProjectSettings } from '@/Components/ProjectSettings.jsx'
import { useMemo, useState, useEffect } from 'react' 

const ProjectView = ({ projectDB = [], page = 'inception' }) => {
  const [project, setProject] = useState({ ...projectDB })
  const [isEditing, setIsEditing] = useState(false)
  const [newTitle, setNewTitle] = useState(project.title)

  // Inception States
  const [activeMenu, setActiveMenu] = useState(
    () => localStorage.getItem('activeMenu') || 'Product Canvas',
  )
  const [menuItems, setMenuItems] = useState([
    {
      label: 'Product Canvas',
      value: true,
      tooltip: tooltipInfo.productCanvas,
    },
    {
      label: 'Personas',
      value: false,
      tooltip: tooltipInfo.personas,
    },
    {
      label: 'Goals',
      value: false,
      tooltip: tooltipInfo.goals,
    },
    {
      label: 'Journeys',
      value: false,
      tooltip: tooltipInfo.journeys,
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
      tooltip: tooltipInfo.stories,
    },
    {
      label: 'Overall Model',
      value: true,
      tooltip: tooltipInfo.overallModel,
    },
    {
      label: 'Matriz de Priorização',
      value: false,
      tooltip: tooltipInfo.prioritizationMatrix,
    },
    {
      label: 'Change Log',
      value: false,
      tooltip: tooltipInfo.changeLog,
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
      tooltip: tooltipInfo.epicStories,
    },
    {
      label: 'Business Rules',
      value: false,
      tooltip: tooltipInfo.businessRules,
    },
    {
      label: 'Use Scenarios',
      value: false,
      tooltip: tooltipInfo.usageScenarios,
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
      tooltip: tooltipInfo.overallModel,
    },
    {
      label: 'Internal and External Interfaces',
      value: false,
      tooltip: tooltipInfo.interfaces,
    },
    {
      label: 'Storyboards',
      value: false,
      tooltip: tooltipInfo.storyboards,
    },
  ])

  const currentArtifact = useMemo(() => {
    switch (page) {
      case 'inception':
        return activeMenu
      case 'storyDiscovery':
        return activeStoryDiscoveryMenu
      case 'refining':
        return activeRefiningMenu
      case 'modeling':
        return activeModelingMenu
      case 'inspection':
      case 'productBacklog':
        // Para estes casos, o nome do artefato é o mesmo nome da página.
        return page
      default:
        return page
    }
  }, [
    page,
    activeMenu,
    activeStoryDiscoveryMenu,
    activeRefiningMenu,
    activeModelingMenu,
  ])

  const artifactToDataKeyMap = useMemo(() => ({
    'Product Canvas': 'product_canvas',
    Personas: 'personas',
    Goals: 'goal_sketches',
    Journeys: 'journeys',
    Stories: 'stories',
    'Overall Model': 'overall_model_classes', 
    'Matriz de Priorização': 'matrix_priorities',
    'Change Log': 'change_requests',
    'Epic Stories': 'epic_stories',
    'Business Rules': 'business_rules',
    'Use Scenarios': 'usage_scenarios',
    'Internal and External Interfaces': 'system_interfaces',
    Storyboards: 'storyboards',
    //Inspection: '', 
    //'Product Backlog': 'stories', 
    Sprint: 'sprints.stories',
  }), []);

  const currentArtifactData = useMemo(() => {
    if (!projectDB || !currentArtifact) {
      return null;
    }
    const dataKey = artifactToDataKeyMap[currentArtifact];
    return dataKey ? projectDB[dataKey] : null;
  }, [projectDB, currentArtifact, artifactToDataKeyMap]);


  const updateProjectTitle = () => {
    setProject({ ...project, title: newTitle })
    setIsEditing(false)
    router.patch(route('project.update', project.id), {
      title: newTitle,
    })
  }

  const getUpdatedProject = async (projectID) => {
    try {
      const response = await fetch(route('project.updated', projectID), {
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
    // console.log(project?.product_canvas)
  }, [project])

  const renderInceptionContent = () => {
    switch (activeMenu) {
      case 'Product Canvas':
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
      case 'Overall Model':
        return <OverallModel project={project} setProject={setProject} />
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
        return <UsageScenarios project={project} setProject={setProject} />
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
        return (
          <SidebarProvider className="min-h-[calc(100vh-100px)]">
            <Storyboards project={project} setProject={setProject} />{' '}
          </SidebarProvider>
        )
      default:
        return null
    }
  }

  return (
    <div className="project-view flex flex-col items-center justify-start px-1 w-full text-foreground">
      <div
        id="project-title-container"
        className="flex items-center justify-between text-3xl font-bold text-white text-center w-full p-0"
      >
        {/* tabs para alternar entre fases do projeto */}
        <Tabs
          value={page}
          onValueChange={(e) =>
            router.get(
              route('project.ceremony.show', {
                project: project.id,
                ceremony: e,
              }),
            )
          }
          className="w-full"
        >
          <div className="flex justify-between items-center w-full gap-2">
            <Button
              variant="secondary"
              size="icon"
              onClick={() =>
                router.get(
                  route('project.show', {
                    project: project.id,
                  }),
                )
              }
            >
              <ArrowLeft />
            </Button>
            {/* Left: Tabs */}
            <TabsList>
              <TabsTrigger value="inception">Inception</TabsTrigger>
              <TabsTrigger value="storyDiscovery">Story Discovery</TabsTrigger>
              <TabsTrigger value="refining">Refining</TabsTrigger>
              <TabsTrigger value="modeling">Modeling</TabsTrigger>
              <TabsTrigger value="inspection">Inspection</TabsTrigger>
              <TabsTrigger value="productBacklog">Product Backlog</TabsTrigger>
              <TabsTrigger value="sprint">Sprint</TabsTrigger>
            </TabsList>

            {/* Center: Title e Botão de Edição */}
            <div
              id="project-title-content"
              className="flex-1 flex justify-center items-center gap-2 px-4 cursor-pointer" // Ajuste o gap aqui se precisar
            >
              <p className="bg-background text-center text-2xl font-bold text-foreground h-full p-0 border-0 m-0">
                {project.title}
              </p>
            </div>

            {/* Right: Buttons (Apenas ProjectPermissions agora) */}
            <div className="flex items-center gap-2">
              <ProjectSettings project={project} />
              <ProjectPermissions project={project} />
            </div>
          </div>

          <TabsContent value="inception">
            <NavMenu menuItems={menuItems} setActiveMenu={setActiveMenu} />
            {renderInceptionContent()}
          </TabsContent>
          <TabsContent value="storyDiscovery">
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
          <TabsContent value="inspection">
            <Inspection project={project} setProject={setProject} />
          </TabsContent>
          <TabsContent value="productBacklog">
            <ProductBacklog project={project} setProject={setProject} />
          </TabsContent>
          <TabsContent value="sprint">
            <Sprint project={project} setProject={setProject} />
          </TabsContent>
        </Tabs>
        <ChatBot
          project={projectDB}
          currentPage={{ page: page, artifact: currentArtifact }}
          currentContextData={currentArtifactData}
        />
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
