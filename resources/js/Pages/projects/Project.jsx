import { useEffect, useState } from "react"
import { useEcho } from "@laravel/echo-react"
import { Head, router } from "@inertiajs/react"
import NavMenu from "../../Components/NavMenu"
import MainView from "./MainView"
import Stories from "./Stories"
import Personas from "./Personas"
import Journeys from "./Journeys"
import Goals from "./Goals"
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout"
import { PenLine, X } from "lucide-react"
import { toast } from "sonner"

const ProjectView = ({ projectDB = [] }) => {
  const [project, setProject] = useState({ ...projectDB })
  const [isEditing, setIsEditing] = useState(false)
  const [newTitle, setNewTitle] = useState(project.title)

  const [activeMenu, setActiveMenu] = useState(
    () => localStorage.getItem("activeMenu") || "All"
  )

  const [menuItems, setMenuItems] = useState([
    {
      label: "All",
      value: true,
      tooltip:
        "Visualize todos os itens do projeto, incluindo histórias, personas, objetivos e jornadas.",
    },
    {
      label: "Stories",
      value: false,
      tooltip:
        "Histórias de usuários e requisitos do sistema que detalham funcionalidades e necessidades do projeto.",
    },
    {
      label: "Personas",
      value: false,
      tooltip:
        "Perfis representativos dos usuários do sistema, com expectativas, restrições e objetivos.",
    },
    {
      label: "Goals",
      value: false,
      tooltip:
        "Objetivos principais do projeto, indicando metas e resultados esperados.",
    },
    {
      label: "Journeys",
      value: false,
      tooltip:
        "Sequências de etapas (jornadas) que descrevem o caminho do usuário ou do administrador para atingir um objetivo no sistema.",
    },
  ])

  const updateProjectTitle = () => {
    setProject({ ...project, title: newTitle })

    setIsEditing(false)

    router.patch(route("project.update", project.id), {
      title: newTitle,
    })
  }

  const getUpdatedProject = async (projectID) => {
    try {
      const response = await fetch("/api/project/" + projectID, {
        method: "GET",
        headers: {
          "X-Requested-With": "XMLHttpRequest",
        },
      })

      const data = await response.json()
      if (response.ok) {
        setProject(data.project)
      }
    } catch (error) {
      toast.error("Erro ao obter o projeto "+ projectId + " atualizado: " + error.message)
    } finally {
      console.log("Projeto atualizado com sucesso!")
    }
  }

  //Usa o websocket para obter o valor mais recente do projeto
  useEcho(`project.${project.id}`, "ProjectUpdated", (e) => {
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
    localStorage.setItem("activeMenu", activeMenu)
  }, [activeMenu])

  useEffect(() => {
    console.log(project?.goal_sketches)
  }, [project])

  const renderContent = () => {
    switch (activeMenu) {
      case "All":
        return (
          <MainView
            project={project}
            setProject={setProject}
          />
        )
      case "Stories":
        return (
          <Stories
            project={project}
            setProject={setProject}
          />
        )
      case "Personas":
        return (
          <Personas
            project={project}
            setProject={setProject}
          />
        )
      case "Goals":
        return (
          <Goals
            project={project}
            setProject={setProject}
          />
        )
      case "Journeys":
        return (
          <Journeys
            project={project}
            setProject={setProject}
          />
        )
      default:
        return null
    }
  }

  return (
    <div className="project-view flex flex-col items-center justify-start px-1 w-full max-w-6xl">
      <div
        id="project-title-container"
        className="flex items-center justify-between text-3xl font-bold text-white text-center w-full my-4 p-0"
      >
        <div className="size-5"></div>
        <div
          id="project-title-content"
          className="w-full h-full"
        >
          {isEditing ? (
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onKeyUp={(e) => {
                if (e.key === "Enter") updateProjectTitle()
              }}
              className="bg-gray-1 text-3xl font-bold text-white text-center h-full p-0 border-0 m-0"
            />
          ) : (
            <p className="bg-gray-1 text-3xl font-bold text-white text-center h-full p-0 border-0 m-0">
              {project.title}
            </p>
          )}
        </div>
        <div
          id="project-title"
          className="size-5"
        >
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="text-gray-400 hover:text-white transition-colors"
            title="Editar conteúdo"
          >
            {!isEditing ? <PenLine size={20} /> : <X size={20} />}
          </button>
        </div>
      </div>
      <NavMenu
        menuItems={menuItems}
        setActiveMenu={setActiveMenu}
      />
      {renderContent()}
    </div>
  )
}
const Project = ({ project }) => {
  return (
    <>
      <Head title="Project" />
      <AuthenticatedLayout>
        <ProjectView projectDB={project} />
      </AuthenticatedLayout>
    </>
  )
}
export default Project
