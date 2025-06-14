import { useEffect, useState } from "react"
import { useEcho } from "@laravel/echo-react"
import { Head, usePage } from "@inertiajs/react"
import NavMenu from "../../Components/NavMenu"
import MainView from "./MainView"
import Stories from "./Stories"
import Personas from "./Personas"
import Journeys from "./Journeys"
import Goals from "./Goals"
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout"

const ProjectView = ({ projectDB = [] }) => {
  const props = usePage().props
  const [project, setProject] = useState({ ...projectDB })

  const [activeMenu, setActiveMenu] = useState(
    () => localStorage.getItem("activeMenu") || "All"
  )

const [menuItems, setMenuItems] = useState([
  { label: "All", value: true, tooltip: "Visualize todos os itens do projeto, incluindo histórias, personas, objetivos e jornadas." },
  { label: "Stories", value: false, tooltip: "Histórias de usuários e requisitos do sistema que detalham funcionalidades e necessidades do projeto." },
  { label: "Personas", value: false, tooltip: "Perfis representativos dos usuários do sistema, com expectativas, restrições e objetivos." },
  { label: "Goals", value: false, tooltip: "Objetivos principais do projeto, indicando metas e resultados esperados." },
  { label: "Journeys", value: false, tooltip: "Sequências de etapas (jornadas) que descrevem o caminho do usuário ou do administrador para atingir um objetivo no sistema." },
])

  //Usa o websocket para obter o valor mais recente do projeto
  useEcho(`project.${project.id}`, "ProjectUpdated", (e) => {
    setProject(e.project)
    console.log(e?.project?.journeys)
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
    console.log(project)
  }, [project, props])

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
      <h2 className="text-white text-center w-full my-4 p-0">
        {project.title}
      </h2>
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
