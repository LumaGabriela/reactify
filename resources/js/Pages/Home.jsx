import React, { useEffect, useState, useMemo } from 'react'
import { useEcho } from '@laravel/echo-react'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import {
  CheckCircle,
  Users,
  CornerDownLeft,
  Power,
  Trash2,
  EllipsisVertical,
} from 'lucide-react'
import { Link, router, usePage } from '@inertiajs/react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from '@/components/ui/command'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
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
} from '@/components/ui/alert-dialog'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogFooter,
  DialogClose,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import MainLayout from '@/Layouts/MainLayout'

const Dashboard = ({ projects = [] }) => {
  const [currentProjects, setCurrentProjects] = useState(projects)
  const [activeFilter, setActiveFilter] = useState('Todos')
  const commandInputRef = React.useRef(null)
  const today = new Date()
  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
  })
  const formattedDate = new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(today)

  const props = usePage().props

  const [taskFilters, setTaskFilters] = useState([
    { name: 'Todos', active: true },
    { name: 'Ativos', active: false },
    { name: 'Inativos', active: false },
  ])

  const handleFilterChange = (filter) => {
    if (filter) {
      const filters = taskFilters.map((f, i) =>
        f.name === filter.name
          ? { ...f, active: true }
          : { ...f, active: false },
      )
      setTaskFilters(filters)
    }
    const updatedUiFilters = taskFilters.map((f) =>
      f.name === filter.name ? { ...f, active: true } : { ...f, active: false },
    )
    setTaskFilters(updatedUiFilters)

    // Apenas atualiza o nome do filtro ativo no estado
    setActiveFilter(filter.name)
  }

  const filteredProjects = useMemo(() => {
    if (!currentProjects) return []

    switch (activeFilter) {
      case 'Ativos':
        return currentProjects.filter((p) => p.active)
      case 'Inativos':
        return currentProjects.filter((p) => !p.active)
      case 'Finalizados':
        return []
      case 'Todos':
      default:
        return currentProjects
    }
  }, [currentProjects, activeFilter])

  const createProject = (e) => {
    e.preventDefault()
    router.post(route('project.store'), newProject)
  }
  const toggleActiveProject = (projectId) => {
    const updatedProjects = currentProjects.map((p) =>
      p.id === projectId ? { ...p, active: !p.active } : p,
    )
    setCurrentProjects(updatedProjects)

    router.patch(route('project.toggle-active', projectId))
  }

  const deleteProject = (projectId) => {
    const updatedProjects = currentProjects.filter((p) => p.id !== projectId)

    setCurrentProjects(updatedProjects)

    router.delete(route('project.destroy', projectId))
  }

  const getUpdatedProjects = async (idList) => {
    try {
      const response = await fetch(route('projects.updated', { ids: idList }), {
        method: 'GET',
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
        },
      })

      const data = await response.json()
      if (response.ok && data.projects.length > 0) {
        setCurrentProjects((prev) => {
          const updatesMap = new Map(
            data.projects.map((updatedProject) => [
              updatedProject.id,
              updatedProject,
            ]),
          )

          return prev.map(
            (oldProject) => updatesMap.get(oldProject.id) || oldProject,
          )
        })
      }
    } catch (error) {
      toast.error('Erro ao obter projetos atualizados: ' + error.message)
    } finally {
      console.log('Projetos atualizados com sucesso!')
    }
  }

  useEffect(() => {
    const focusCommandInput = (e) => {
      if (e.key === 'k' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault()
        if (commandInputRef.current) commandInputRef.current.focus()
      }
    }
    document.addEventListener('keydown', focusCommandInput)
    return () => document.removeEventListener('keydown', focusCommandInput)
  }, [])

  useEffect(() => {
    console.log(currentProjects)
  }, [currentProjects])

  useEcho(`projects`, 'ProjectUpdated', (e) => {
    let newProjectList = []
    currentProjects.forEach((project) => {
      if (project.id === e.project_id) newProjectList.push(e.project_id)
    })

    if (newProjectList.length > 0) getUpdatedProjects(newProjectList)
  })

  useEcho('projects', 'ProjectDeleted', (e) => {
    setCurrentProjects((prev) =>
      prev.filter((project) => project.id !== e.projectId),
    )
  })

  return (
    <div className="bg-background text-white p-6 w-full mx-auto pt-16">
      {/* Header */}
      <div className="flex  justify-stretch items-stretch gap-2">
        <div className=" flex flex-col w-1/2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="default" className="h-full max-h-[100px] ">
                Criar Projeto
              </Button>
            </DialogTrigger>{' '}
            <DialogContent className="sm:max-w-[425px]">
              <form className="space-y-4" onSubmit={createProject}>
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
                      className="bg-background "
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
                    <Button type="button" variant="outline">
                      Cancelar
                    </Button>
                  </DialogClose>
                  <Button type="submit">Criar Projeto</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
        {/* command */}

        <div className="relative w-1/2 flex flex-col justify-end">
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
                          router.visit(route('project.show', project.id))
                        }}
                        className="relative flex cursor-default select-none items-center justify-between rounded-lg px-3 py-2.5 text-sm text-foreground outline-none transition-colors "
                      >
                        <CheckCircle className="mr-3 size-4 text-foreground" />
                        <span className="truncate w-full">{project.title}</span>
                        <CornerDownLeft className="mr-3 size-4 text-zinc-500" />
                      </CommandItem>
                    ),
                )}
              </CommandGroup>
            </CommandList>
          </Command>
        </div>
      </div>

      {/* Task Overview */}
      <div className="my-8">
        <p className="font-semibold text-lg mb-4 text-foreground">
          Task Overview
        </p>
        {/* <Button
          onClick={() => {
            router.post(route('projects.invitations.store', 1), {
              email: 'olimpiokbz@gmail.com',
              role: 'member',
            })
          }}
        >
          Butao
        </Button> */}

        <div className="flex space-x-2 mb-6">
          {taskFilters.map((filter, index) => (
            <button
              onClick={() => handleFilterChange(filter)}
              className={`px-4 py-1 rounded transition-colors duration-200 ${
                filter.active ? 'bg-gray-800 text-white' : 'text-gray-400'
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
                  color = 'bg-green-500'
                  break
                case 'Finalizado':
                  color = 'bg-blue-500'
                  break
                case false:
                  color = 'bg-red-500'
                  break
                default:
                  color = 'bg-gray-800'
              }

              return (
                <AlertDialog key={index}>
                  <Card className="flex h-full flex-col transition-all hover:shadow-md">
                    {/* CABEÇALHO: Título do projeto e menu de ações */}
                    <CardHeader className="flex-row items-center justify-between">
                      <CardTitle className="text-lg">
                        <Link
                          href={route('project.show', project.id)}
                          className="flex items-center gap-2 hover:underline"
                        >
                          <div
                            className={`h-2.5 w-2.5 shrink-0 rounded-full ${color}`}
                          ></div>
                          {project.title}
                        </Link>
                      </CardTitle>

                      {/* MENU DE AÇÕES */}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <EllipsisVertical className="size-5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem
                            onSelect={() => toggleActiveProject(project.id)}
                          >
                            <Power
                              className={`mr-2 size-4 ${project.active ? 'text-success' : 'text-destructive'}`}
                            />
                            <span>
                              {project.active ? 'Desativar' : 'Ativar'}
                            </span>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <AlertDialogTrigger asChild>
                            <DropdownMenuItem className="text-destructive focus:bg-destructive/10 focus:text-destructive">
                              <Trash2 className="mr-2 size-4" />
                              <span>Excluir</span>
                            </DropdownMenuItem>
                          </AlertDialogTrigger>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </CardHeader>

                    {/* CONTEÚDO: Descrição e contagem de membros */}
                    <CardContent className="">
                      <Link href={route('project.show', project.id)}>
                        <CardDescription>{project.description}</CardDescription>
                      </Link>
                    </CardContent>

                    {/* RODAPÉ: Status e badge de Ativo/Inativo */}
                    <CardFooter className="flex justify-between">
                      <Badge
                        variant={project.active ? 'default' : 'destructive'}
                      >
                        {project.active ? 'Ativo' : 'Inativo'}
                      </Badge>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Users className="size-4" />
                        <span className="text-sm">
                          {project?.members?.length} membros
                        </span>
                      </div>
                    </CardFooter>
                  </Card>

                  {/* CONTEÚDO DO DIÁLOGO DE CONFIRMAÇÃO */}
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Excluir "{project.title}"?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        Esta ação não pode ser desfeita. Isso excluirá
                        permanentemente o projeto e todos os seus dados
                        associados.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => deleteProject(project.id)}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Excluir
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )
            })}
        </div>
      </div>
    </div>
  )
}

const Home = ({ projects }) => {
  return <Dashboard projects={projects} />
}

Home.layout = (page) => <MainLayout children={page} />
export default Home
