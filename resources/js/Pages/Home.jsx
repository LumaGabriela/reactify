import React, { useEffect, useState } from "react"
import { useEcho } from "@laravel/echo-react"
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout"
import {
  CheckCircle,
  Users,
  CornerDownLeft,
  Power,
  Trash2,
  EllipsisVertical,
} from "lucide-react"
import { Link, router, usePage } from "@inertiajs/react"
import { ModalNewProject } from "@/Components/Modals"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from "@/components/ui/command"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Alert } from "bootstrap"

const Dashboard = ({ projects = [] }) => {
  const [currentProjects, setCurrentProjects] = useState(projects)
  const [filteredProjects, setFilteredProjects] = useState(currentProjects)
  const commandInputRef = React.useRef(null)
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
  ])

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
        setFilteredProjects(currentProjects)
        break
      case "Ativos":
        setFilteredProjects(currentProjects.filter((p) => p.active))
        break
      case "Inativos":
        setFilteredProjects(currentProjects.filter((p) => !p.active))
        break
      case "Finalizados":
        // setFilteredProjects(currentProjects.filter((p) => p.status === "finalizado"))
        break
      default:
        setFilteredProjects(currentProjects)
        break
    }
  }

  const toggleActiveProject = (projectId) => {
    const updatedProjects = currentProjects.map((p) =>
      p.id === projectId ? { ...p, active: !p.active } : p
    )
    setCurrentProjects(updatedProjects)

    router.patch(route("project.toggle-active", projectId))
  }

  const deleteProject = (projectId) => {
    const updatedProjects = currentProjects.filter((p) => p.id !== projectId)

    setCurrentProjects(updatedProjects)

    router.delete(route("project.destroy", projectId))
  }

  useEffect(() => {
    const focusCommandInput = (e) => {
      if (e.key === "k" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault()
        if (commandInputRef.current) commandInputRef.current.focus()
      }
    }

    document.addEventListener("keydown", focusCommandInput)
    return () => document.removeEventListener("keydown", focusCommandInput)
  }, [])

  useEffect(() => {
    console.log(currentProjects)
    const filter = taskFilters.find((f) => f.active)
    filterProjects(filter)
  }, [currentProjects])

  useEcho(`projects`, "ProjectUpdated", (e) => {
    console.log(e)
    setCurrentProjects((prevProjects) =>
      prevProjects.map((project) =>
        project.id === e.project.id ? e.project : project
      )
    )
  })

  useEcho("projects", "ProjectDeleted", (e) => {
    console.log(e)
    setCurrentProjects((prev) =>
      prev.filter((project) => project.id !== e.projectId)
    )
  })

  return (
    <div className=" text-white p-6 rounded w-full mx-auto">
      {/* Header */}
      {showModal && (
        <ModalNewProject
          message={"Create a new project"}
          onCancel={() => setShowModal(false)}
        />
      )}
      <div className="flex min-h-[15rem] justify-between items-center mb-2 gap-2">
        <div className=" flex flex-col size-full relative">
          <p className="text-gray-400 text-sm mb-2">Today</p>
          <p className="font-medium text-nowrap">{formattedDate}</p>
          <Button
            onClick={() => setShowModal(true)}
            variant="default"
            asChild
            className="flex flex-col justify-center items-center bg-purple-1 h-[28rem] hover:bg-indigo-500/80 transition-colors rounded p-4 w-full max-w-3xl h-full cursor-pointer"
          >
            <p className="font-bold text-lg dark:text-white">Criar Projeto</p>
          </Button>
        </div>

        <div className="w-1/2 dark">
          <Command className=" relative md:min-w-[450px]">
            <CommandInput
              shortcut
              ref={commandInputRef}
              placeholder="Buscar Projetos..."
              className="flex h-12 w-full rounded-md border-none bg-transparent px-4 py-3 text-sm text-zinc-300 placeholder:text-zinc-500 focus:outline-none focus:ring-0 disabled:cursor-not-allowed disabled:opacity-50"
            />
            <CommandList className="max-h-[300px] overflow-y-auto overflow-x-hidden">
              <CommandEmpty className="py-6 text-center text-sm text-zinc-500">
                Nenhum projeto encontrado.
              </CommandEmpty>
              <CommandGroup>
                {filteredProjects?.map((project) => (
                  <CommandItem
                    key={project.id}
                    value={project.title}
                    onSelect={() => {
                      router.visit(route("project.show", project.id))
                    }}
                    className="relative flex cursor-default select-none items-center justify-between rounded-lg px-3 py-2.5 text-sm text-zinc-300 outline-none transition-colors hover:bg-zinc-800 hover:text-white data-[selected=true]:bg-zinc-800 data-[selected=true]:text-white"
                  >
                    <CheckCircle className="mr-3 size-4 text-zinc-500" />
                    <span className="truncate w-full">{project.title}</span>
                    <CornerDownLeft className="mr-3 size-4 text-zinc-500" />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </div>
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
                      <p className="m-0">{project.title}</p>
                    </Link>
                    {/* Dialogo de confirmacao de exclusao de projeto */}
                    <AlertDialog>
                      <AlertDialogContent className="">
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Tem certeza que deseja excluir o projeto?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            Essa decisão nao pode ser desfeita.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => deleteProject(project.id)}
                          >
                            Excluir
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                      {/* menu com opcoes sobre o projeto */}
                      <DropdownMenu>
                        <DropdownMenuTrigger className="">
                          <EllipsisVertical
                            size={22}
                            className="text-gray-400"
                          />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-48 ">
                          <DropdownMenuItem
                            onSelect={() => toggleActiveProject(project.id)}
                          >
                            {" "}
                            <Power
                              size={16}
                              className={
                                project.active
                                  ? "text-green-400"
                                  : "text-red-400"
                              }
                            />{" "}
                            {project.active
                              ? "Desativar projeto"
                              : "Ativar projeto"}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator className="bg-zinc-800" />

                          <DropdownMenuItem >
                            <AlertDialogTrigger className="m-0 flex gap-2">
                              <Trash2
                                size={16}
                                className="text-red-400"
                              />
                              Excluir projeto{" "}
                            </AlertDialogTrigger>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </AlertDialog>
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
                          project.active ? "!bg-green-600" : "!bg-red-600"
                        } text-xs text-white font-semibold py-1 px-4 rounded-full inline-block`}
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
