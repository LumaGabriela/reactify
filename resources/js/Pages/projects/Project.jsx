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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ProjectPermissions } from '@/Components/ProjectPermissions'

const ProjectView = ({ projectDB = [], page = 'overview' }) => {
  const [project, setProject] = useState({ ...projectDB })
  const [isEditing, setIsEditing] = useState(false)
  const [newTitle, setNewTitle] = useState(project.title)

  const [activeMenu, setActiveMenu] = useState(
    () => localStorage.getItem('activeMenu') || 'All',
  )

  const [menuItems, setMenuItems] = useState([
    {
      label: 'All',
      value: true,
      tooltip:
        'Visualize todos os itens do projeto, incluindo histórias, personas, objetivos e jornadas.',
    },
    {
      label: 'Stories',
      value: false,
      tooltip:
        'Histórias de usuários e requisitos do sistema que detalham funcionalidades e necessidades do projeto.',
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

  //Usa o websocket para obter o valor mais recente do projeto
  useEcho(`project.${project.id}`, 'ProjectUpdated', (e) => {
    getUpdatedProject(e.project_id)
  })
  //Altera o menu ativo
  useEffect(() => {
    const updatedMenuItems = menuItems.map((item, i) => {
      if (item.label === activeMenu) {
        return {
          ...item,
          value: true,
        }
      }
      return {
        ...item,
        value: false,
      }
    })
    setMenuItems(updatedMenuItems)
    localStorage.setItem('activeMenu', activeMenu)
  }, [activeMenu])

  useEffect(() => {
    // console.log(project?.goal_sketches)
  }, [project])

  const renderContent = () => {
    switch (activeMenu) {
      case 'All':
        return <MainView project={project} setProject={setProject} />
      case 'Stories':
        return <Stories project={project} setProject={setProject} />
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
              <TabsTrigger value="overview">OverView</TabsTrigger>
              <TabsTrigger value="product-vision">Product Vision</TabsTrigger>
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
              {page === 'overview' && (
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
          <TabsContent value="overview">
            <NavMenu menuItems={menuItems} setActiveMenu={setActiveMenu} />
            {renderContent()}
          </TabsContent>
          <TabsContent value="product-vision">Product Vision.</TabsContent>
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
