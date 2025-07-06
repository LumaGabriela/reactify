import React, { useEffect, useState, useMemo } from "react"
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogFooter,
  DialogClose,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const Dashboard = ({ projects = [] }) => {
  const [currentProjects, setCurrentProjects] = useState(projects)
  const [activeFilter, setActiveFilter] = useState("Todos")
  const commandInputRef = React.useRef(null)
  const today = new Date()
  const [newProject, setNewProject] = useState({
    title: "",
    description: "",
  })
  const formattedDate = new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(today)

  const props = usePage().props

  const [taskFilters, setTaskFilters] = useState([
    { name: "Todos", active: true },
    { name: "Ativos", active: false },
    { name: "Inativos", active: false },
  ])

  const handleFilterChange = (filter) => {
    if (filter) {
      const filters = taskFilters.map((f, i) =>
        f.name === filter.name
          ? { ...f, active: true }
          : { ...f, active: false }
      )
      setTaskFilters(filters)
    }
    const updatedUiFilters = taskFilters.map((f) =>
      f.name === filter.name ? { ...f, active: true } : { ...f, active: false }
    )
    setTaskFilters(updatedUiFilters)

    // Apenas atualiza o nome do filtro ativo no estado
    setActiveFilter(filter.name)
  }

  const filteredProjects = useMemo(() => {
    if (!currentProjects) return []

    switch (activeFilter) {
      case "Ativos":
        return currentProjects.filter((p) => p.active)
      case "Inativos":
        return currentProjects.filter((p) => !p.active)
      case "Finalizados":
        return []
      case "Todos":
      default:
        return currentProjects
    }
  }, [currentProjects, activeFilter])

  const createProject = (e) => {
    e.preventDefault()
    router.post(route("project.store"), newProject)
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

  const getUpdatedProjects = async (idList) => {
    try {
      const response = await fetch(route("projects.updated", { ids: idList }), {
        method: "GET",
        headers: {
          "X-Requested-With": "XMLHttpRequest",
        },
      })

      const data = await response.json()
      if (response.ok && data.projects.length > 0) {
        setCurrentProjects((prev) => {
          const updatesMap = new Map(
            data.projects.map((updatedProject) => [
              updatedProject.id,
              updatedProject,
            ])
          )

          return prev.map(
            (oldProject) => updatesMap.get(oldProject.id) || oldProject
          )
        })
      }
    } catch (error) {
      toast.error("Erro ao obter projetos atualizados: " + error.message)
    } finally {
      console.log("Projetos atualizados com sucesso!")
    }
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
  }, [currentProjects])

  useEcho(`projects`, "ProjectUpdated", (e) => {
    let newProjectList = []
    currentProjects.forEach((project) => {
      if (project.id === e.project_id) newProjectList.push(e.project_id)
    })

    if (newProjectList.length > 0) getUpdatedProjects(newProjectList)
  })

  useEcho("projects", "ProjectDeleted", (e) => {
    setCurrentProjects((prev) =>
      prev.filter((project) => project.id !== e.projectId)
    )
  })

  return (
    <div className="bg-card text-white p-6 w-full mx-auto pt-16">
      {/* Header */}
      <div className="flex min-h-[10rem] justify-center items-end mb-2 gap-2">
        <div className=" flex flex-col w-1/2 h-full">
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="custom"
                asChild
                className="flex flex-col justify-center items-center h-[28rem] bg-purple-2 hover:bg-purple-1 transition-colors rounded p-4 w-full max-w-3xl h-full cursor-pointer"
              >
                <p className="font-bold text-lg">
                  Criar Projeto
                </p>
              </Button>
            </DialogTrigger>{" "}
            <DialogContent className="sm:max-w-[425px]">
              <form
                className="space-y-4"
                onSubmit={createProject}
              >
                <DialogHeader>
                  <DialogTitle>Criar Novo Projeto</DialogTitle>
                  <DialogDescription>
                    Preencha os campos abaixo para criar um novo projeto.
                  </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4">
                  <div className="grid gap-3">
                    <Label htmlFor="title-1">Nome</Label>
                    <Input
                      placeholder="Nome do Projeto"
                      id="title-1"
                      name="title"
                      value={newProject.title}
                      onChange={(e) =>
                        setNewProject({ ...newProject, title: e.target.value })
                      }
                    />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="description">Descrição</Label>
                    <Input
                      placeholder="Descrição do Projeto"
                      id="description-1"
                      name="description"
                      value={newProject.description}
                      onChange={(e) =>
                        setNewProject({
                          ...newProject,
                          description: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button
                      type="button"
                      variant="outline"
                    >
                      Cancelar
                    </Button>
                  </DialogClose>
                  <Button type="submit">Criar Projeto</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="relative w-1/2 h-full flex flex-col justify-end">
          <Command className=" relative w-full md:min-w-[250px]">
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
                {filteredProjects?.map(
                  (project) =>
                    project && (
                      <CommandItem
                        key={project.id}
                        value={project.title}
                        onSelect={() => {
                          router.visit(route("project.show", project.id))
                        }}
                        className="relative flex cursor-default select-none items-center justify-between rounded-lg px-3 py-2.5 text-sm text-foreground outline-none transition-colors "
                      >
                        <CheckCircle className="mr-3 size-4 text-foreground" />
                        <span className="truncate w-full">{project.title}</span>
                        <CornerDownLeft className="mr-3 size-4 text-zinc-500" />
                      </CommandItem>
                    )
                )}
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
              onClick={() => handleFilterChange(filter)}
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
              if (!project) return null // Skip if project is undefined or null
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

                          <DropdownMenuItem>
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
