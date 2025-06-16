import React, { useEffect, useState } from "react"
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout"
import { Search, CheckCircle, Users } from "lucide-react"
import { Link, router, usePage } from "@inertiajs/react"
import { ModalNewProject, ProjectMenu } from "@/Components/Modals"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command"

const Dashboard = ({ projects = [] }) => {
  const today = new Date()
  const formattedDate = new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(today)

  const props = usePage().props
  const [showModal, setShowModal] = useState(false)

  const [taskFilters, setTaskFilters] = useState([
    { name: "Todos", active: true },
    { name: "Ativos", active: false },
    { name: "Inativos", active: false },
    // { name: "Finalizados", active: false },
  ])

  const [filteredProjects, setFilteredProjects] = useState(projects)
  const [open, setOpen] = useState(true)

  const filterProjects = (filter) => {
    if (filter) {
      const filters = taskFilters.map((f, i) =>
        f.name === filter.name
          ? { ...f, active: true }
          : { ...f, active: false }
      )
      setTaskFilters(filters)
    }

    switch (filter.name) {
      case "Todos":
        setFilteredProjects(projects)
        break
      case "Ativos":
        setFilteredProjects(projects.filter((p) => p.active))
        break
      case "Inativos":
        setFilteredProjects(projects.filter((p) => !p.active))
        break
      case "Finalizados":
        // setFilteredProjects(projects.filter((p) => p.status === "finalizado"))
        break
      default:
        setFilteredProjects(projects)
        break
    }
  }
  useEffect(() => {
    console.log(props)
  }, [props])

  useEffect(() => {
    const down = (e) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  return (
    <div className=" text-white p-6 rounded w-full mx-auto">
      {/* Header */}
      {showModal && (
        <ModalNewProject
          message={"Create a new project"}
          onCancel={() => setShowModal(false)}
        />
      )}
      <div className="flex justify-between items-center mb-8">
        <div>
          <p className="text-gray-400 text-sm">Today</p>
          <p className="font-medium">{formattedDate}</p>
        </div>
        <div className="relative w-1/2 dark">
          <Command className="relative overflow-hidden rounded-lg border border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-lg md:min-w-[450px]">
            <CommandInput
              placeholder="Buscar Projetos..."
              className="flex h-12 w-full rounded-md border-none bg-transparent px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-0 disabled:cursor-not-allowed disabled:opacity-50"
            />
            <CommandList className="max-h-[300px] overflow-y-auto overflow-x-hidden">
              <CommandEmpty className="py-6 text-center text-sm text-muted-foreground">
                Nenhum projeto encontrado.
              </CommandEmpty>
              <div className="p-1">
                {filteredProjects.map((project) => (
                  <CommandItem
                    key={project.id}
                    value={project.title}
                    onSelect={() => {
                      setOpen(false)
                      router.visit(route("project.show", project.id))
                    }}
                    className="relative flex cursor-default select-none items-center rounded-sm px-3 py-2.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground"
                  >
                    <CheckCircle className="mr-3 h-4 w-4 text-muted-foreground" />
                    <span className="truncate">{project.title}</span>
                    <kbd className="pointer-events-none ml-auto hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
                      <span className="text-xs">↵</span>
                    </kbd>
                  </CommandItem>
                ))}
              </div>
            </CommandList>
          </Command>
        </div>
      </div>

      {/* Task Status Summary */}
      <div className="flex items-center justify-center gap-2 mb-8 w-full h-32">
        {/* New Project Card */}
        <Button
          onClick={() => setShowModal(true)}
          variant="default"
          asChild
          className="flex flex-col justify-center items-center bg-purple-1  hover:bg-indigo-500/80 transition-colors rounded p-2 w-[20rem] max-w-3xl h-full cursor-pointer"
        >
          <p className="font-bold text-lg">New Project</p>
        </Button>
      </div>

      {/* Task Overview */}
      <div className="mb-8">
        <p className="font-semibold text-lg mb-4">Task Overview</p>

        <div className="flex space-x-2 mb-6">
          {taskFilters.map((filter, index) => (
            <button
              onClick={() => filterProjects(filter)}
              className={`px-4 py-1 rounded transition-colors duration-200 ${
                filter.active ? "bg-gray-800 text-white" : "text-gray-400"
              }`}
              key={index}
            >
              {filter.name}
            </button>
          ))}
        </div>

        <div className="tasks grid grid-cols-3 gap-4">
          {/* Todo Task */}
          {projects &&
            filteredProjects.map((project, index) => {
              let color = null
              switch (project.active) {
                case true:
                  color = "bg-green-500"
                  break
                case "Finalizado":
                  color = "bg-blue-500"
                  break
                case false:
                  color = "bg-red-500"
                  break
                default:
                  color = "bg-gray-800"
              }

              return (
                <div
                  key={index}
                  className="bg-gray-800 p-4 rounded-xl cursor-pointer"
                >
                  <div className="flex justify-between items-center mb-3">
                    <Link
                      href={route("project.show", project.id)}
                      className="flex items-center flex-grow"
                    >
                      <div
                        className={`h-2 w-2 ${color} rounded-full mr-2`}
                      ></div>
                      <p>{project.title}</p>
                    </Link>

                    {/* Substituindo o ícone MoreVertical pelo componente de menu */}
                    <ProjectMenu project={project} />
                  </div>

                  <Link
                    href={route("project.show", project.id)}
                    className="block"
                  >
                    <p className="text-gray-400 text-sm mb-4">
                      {project.description}
                    </p>
                    <div className="flex justify-between items-center mt-2">
                      <div
                        className={`${color} text-white text-xs font-medium py-1 px-4 rounded-full inline-block`}
                      >
                        {project.status}
                      </div>
                      <Badge
                        className={`${
                          project.active ? "bg-green-600" : "bg-red-600"
                        } text-xs font-medium py-1 px-4 rounded-full inline-block`}
                      >
                        {project.active ? "Ativo" : "Inativo"}
                      </Badge>
                    </div>

                    <div className="flex justify-start items-center">
                      <div className="flex items-center space-x-2">
                        <Users
                          size={16}
                          className="text-gray-400"
                        />
                        <span className="text-gray-400 text-sm">
                          {project?.members?.length}
                        </span>
                      </div>
                    </div>
                  </Link>
                </div>
              )
            })}
        </div>
      </div>

      {/* Active Projects */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <p className="font-semibold text-lg">My Active Project</p>
          <button className="rounded transition-colors py-2 px-4 text-sm font-medium bg-purple-2-hover">
            <a href="/projects">See All</a>
          </button>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {/* Project 1 */}
          <div className="bg-gray-800 p-4 rounded-xl">
            <div className="flex items-center mb-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-red-500 to-purple-500 flex items-center justify-center mr-3">
                <CheckCircle
                  size={20}
                  className="text-white"
                />
              </div>
              <div>
                <p className="font-medium">Taxi online</p>
                <p className="text-gray-400 text-xs">Release time:</p>
              </div>
            </div>
            <div className="bg-green-100 text-green-800 text-xs font-medium py-1 px-2 rounded-md mt-2 inline-block">
              Apr 5, 2023
            </div>
          </div>

          {/* Project 2 */}
          <div className="bg-gray-800 p-4 rounded-xl">
            <div className="flex items-center mb-2">
              <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center mr-3">
                <CheckCircle
                  size={20}
                  className="text-white"
                />
              </div>
              <div>
                <p className="font-medium">E-movies mobile</p>
                <p className="text-gray-400 text-xs">Release time:</p>
              </div>
            </div>
            <div className="bg-green-100 text-green-800 text-xs font-medium py-1 px-2 rounded-md mt-2 inline-block">
              May 15, 2023
            </div>
          </div>

          {/* Project 3 */}
          <div className="bg-gray-800 p-4 rounded-xl">
            <div className="flex items-center mb-2">
              <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center mr-3">
                <CheckCircle
                  size={20}
                  className="text-white"
                />
              </div>
              <div>
                <p className="font-medium">Video converter app</p>
                <p className="text-gray-400 text-xs">Release time:</p>
              </div>
            </div>
            <div className="bg-green-100 text-green-800 text-xs font-medium py-1 px-2 rounded-md mt-2 inline-block">
              Feb 3, 2023
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const Home = ({ projects }) => {
  return (
    <AuthenticatedLayout>
      <Dashboard projects={projects} />
    </AuthenticatedLayout>
  )
}

export default Home
