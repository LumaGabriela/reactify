import React, { useState, useEffect, useRef } from "react"
import { GoalCard } from "@/Components/Card"
import {
  Plus,
  Sparkles,
  FileText,
  X,
  Pencil,
  Info,
  Check,
  LoaderCircle,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import TextareaAutosize from "react-textarea-autosize"
import {
  Popover,
  PopoverArrow,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Card, CardContent } from "@/components/ui/card"
import { router } from "@inertiajs/react"
const Goals = ({ project, setProject }) => {
  const typeColors = [
    { color: "!bg-orange-600", title: "bg" },
    { color: "!bg-purple-600", title: "cg" },
  ]
  const priorityColors = [
    { color: "!bg-red-600", title: "high" },
    { color: "!bg-yellow-600", title: "med" },
    { color: "!bg-green-600", title: "low" },
    { color: "!bg-pink-600", title: "urgent" },
  ]
  // Estado para controlar qual goal está sendo editada
  const [editingId, setEditingId] = useState(null)
  // Estado para armazenar o valor temporário durante a edição
  const [editValue, setEditValue] = useState("")

  const textareaRef = useRef(null)
  // Estado para controlar qual goal está com o seletor de tipo aberto
  const [typeSelectId, setTypeSelectId] = useState(null)
  // Estado para controlar qual goal está com o seletor de prioridade aberto
  const [prioritySelectId, setPrioritySelectId] = useState(null)
  // Estado para controlar qual goal está com o diálogo de confirmação de exclusão aberto
  const [deleteConfirmId, setDeleteConfirmId] = useState(null)

  const isTemporary = (goal) =>
    typeof goal.id === "string" && goal.id.startsWith("temp-")

  // Função para lidar com mudanças no input
  const handleInputChange = (e) => {
    setEditValue(e.target.value)
  }

  // Função para alternar a exibição do seletor de tipo
  const toggleTypeSelect = (goalId) => {
    if (typeSelectId === goalId) {
      setTypeSelectId(null)
    } else {
      setTypeSelectId(goalId)
      setPrioritySelectId(null) // Fecha outros seletores
      setDeleteConfirmId(null) // Fecha o diálogo de exclusão caso esteja aberto
    }
  }

  // Função para alternar a exibição do seletor de prioridade
  const togglePrioritySelect = (goalId) => {
    if (prioritySelectId === goalId) {
      setPrioritySelectId(null)
    } else {
      setPrioritySelectId(goalId)
      setTypeSelectId(null) // Fecha outros seletores
      setDeleteConfirmId(null) // Fecha o diálogo de exclusão caso esteja aberto
    }
  }

  // Função para alternar a exibição do diálogo de confirmação de exclusão
  const toggleDeleteConfirm = (goalId) => {
    if (deleteConfirmId === goalId) {
      setDeleteConfirmId(null)
    } else {
      setDeleteConfirmId(goalId)
      setTypeSelectId(null) // Fecha o seletor de tipo caso esteja aberto
      setPrioritySelectId(null) // Fecha o seletor de prioridade caso esteja aberto
      setEditingId(null) // Fecha a edição caso esteja aberta
    }
  }

  // Função para adicionar uma nova goal
  const addNewGoal = () => {
    setProject({
      ...project,
      goal_sketches: [
        ...(project.goal_sketches || []),
        {
          id: `temp-${Date.now()}`,
          title: "New Goal",
          type: "bg",
          priority: "med",
        },
      ],
    })

    router.post(
      route("goal.store"),
      {
        title: "New Goal",
        type: "bg",
        priority: "high",
        project_id: project.id,
      },
      { preserveState: true, preserveScroll: true }
    )
  }

  // Função para alternar entre modo de edição e visualização
  const editGoal = (goal) => {
    if (editingId === goal.id) {
      if (goal.title !== editValue) {
        // Se já estiver editando esta goal, salve as alterações
        const updatedGoals = (project.goal_sketches || []).map((g) =>
          g.id === goal.id
            ? {
                ...g,
                title: editValue,
                updated_at: new Date().toISOString(),
              }
            : g
        )
        setProject({ ...project, goal_sketches: updatedGoals })

        router.patch(route("goal.update", goal.id), {
          title: editValue,
        })
      }
      setEditingId(null) // Sai do modo de edição
    } else {
      // Entra no modo de edição para esta goal
      setEditingId(goal.id)
      setEditValue(goal.title) // Inicializa o campo com o valor atual
    }
  }

  // Função para alterar o tipo da goal
  const changeGoalType = (goalId, newType) => {
    const goal = project.goal_sketches.find((g) => g.id === goalId)

    if (goal.type !== newType) {
      const updatedGoals = (project.goal_sketches || []).map((g) =>
        g.id === goalId
          ? {
              ...g,
              type: newType,
              updated_at: new Date().toISOString(),
            }
          : g
      )

      setProject({ ...project, goal_sketches: updatedGoals })

      router.patch(route("goal.update", goalId), {
        type: newType,
      })
    }

    setTypeSelectId(null) // Fecha o seletor de tipo
  }

  // Função para alterar a prioridade da goal
  const changeGoalPriority = (goalId, newPriority) => {
    const goal = project.goal_sketches.find((g) => g.id === goalId)
    if (goal.priority !== newPriority) {
      const updatedGoals = (project.goal_sketches || []).map((g) =>
        g.id === goalId
          ? {
              ...g,
              priority: newPriority,
              updated_at: new Date().toISOString(),
            }
          : g
      )

      setProject({ ...project, goal_sketches: updatedGoals })

      router.patch(route("goal.update", goalId), {
        priority: newPriority,
      })
    }
    setPrioritySelectId(null) // Fecha o seletor de prioridade
  }

  // Função para excluir a goal
  const deleteGoal = (goalId) => {
    const updatedGoals = (project.goal_sketches || []).filter(
      (g) => g.id !== goalId
    )
    setProject({ ...project, goal_sketches: updatedGoals })
    setDeleteConfirmId(null) // Fecha o diálogo de confirmação
    router.delete(route("goal.delete", goalId))
  }

  // Helper para definir a cor de fundo baseada na prioridade

  return (
    <div className="goalSketches  rounded grid grid-cols-2 gap-2 w-full p-4 cursor-pointer items-start">
      <div className="flex flex-col gap-2 ">
        {/* tooltip sobre as goals */}
        <Popover>
          <PopoverTrigger
            asChild
            className=""
          >
            <button className=" flex items-center justify-center gap-2 p-2 rounded-lg text-white bg-gray-800 hover:bg-gray-600 transition-colors">
              <Badge className={`border-0 ${typeColors[1].color}`}>
                {
                  project?.goal_sketches?.filter((goal) => goal.type === "bg")
                    .length
                }
              </Badge>{" "}
              Constraint Goals
              <Info
                className="text-gray-400"
                size={18}
              />
            </button>
          </PopoverTrigger>
          <PopoverContent className="bg-gray-800 text-white ">
            As histórias de usuário focam nas necessidades dos usuários do
            aplicativo, como a criação de contas para acessar o sistema, a
            gestão de playlists para organizar músicas e outras funcionalidades
            voltadas para a experiência do usuário.
            <PopoverArrow className="fill-gray-800" />
          </PopoverContent>
        </Popover>
        {project.goal_sketches && project.goal_sketches.length > 0 ? (
          project?.goal_sketches
            .filter((goal) => goal.type === "cg")
            .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
            .map((goal, i) => (
              <Card
                key={goal.id}
                className="dark:!bg-gray-800 bg-gray-300 border-0"
              >
                <CardContent className="p-2 flex items-center justify-between gap-2">
                  <div className="flex flex-col items-start gap-2 flex-1 min-w-0">
                    {/* Badge com Popover para Mudar o Tipo */}
                    <div className="flex items-center gap-2">
                      <Popover
                        open={typeSelectId === goal.id}
                        onOpenChange={() => toggleTypeSelect(goal.id)}
                      >
                        <PopoverTrigger>
                          <Badge
                            className={`border-transparent dark:text-slate-900 font-bold w-full cursor-pointer 
                              ${
                                typeColors.find(
                                  (color) => color.title === goal.type
                                )?.color
                              }
                              `}
                          >
                            {`CG${goal.id}`}
                            {`CG${isTemporary(goal) ? "" : goal.id}`}
                          </Badge>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto bg-gray-900 border-gray-700 p-1">
                          <div className="flex flex-col gap-1">
                            {typeColors.map((type, i) => (
                              <Button
                                key={i}
                                variant="ghost"
                                className="h-auto p-2 justify-start hover:bg-gray-700/80"
                                onClick={() =>
                                  changeGoalType(goal.id, type.title)
                                }
                              >
                                <Badge
                                  className={`border-transparent dark:text-slate-900 font-bold w-full cursor-pointer ${type.color}`}
                                >
                                  {`${type.title.toUpperCase()}${goal.id}`}
                                </Badge>
                              </Button>
                            ))}
                          </div>
                        </PopoverContent>
                      </Popover>

                      {/* popover com badge para mudar a prioridade  */}
                      <Popover
                        open={prioritySelectId === goal.id}
                        onOpenChange={() => togglePrioritySelect(goal.id)}
                      >
                        <PopoverTrigger>
                          <Badge
                            className={`border-transparent dark:text-slate-900 font-bold w-fit cursor-pointer 
                              ${
                                priorityColors.find(
                                  (color) => color.title === goal.priority
                                )?.color
                              }
                              `}
                          >
                            {goal.priority.toUpperCase()}
                          </Badge>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto bg-gray-900 border-gray-700 p-1">
                          <div className="flex flex-col gap-1">
                            {priorityColors.map((type, i) => (
                              <Button
                                key={i}
                                variant="ghost"
                                className="h-auto p-2 justify-start hover:bg-gray-700/80"
                                onClick={() =>
                                  changeGoalPriority(goal.id, type.title)
                                }
                              >
                                <Badge
                                  className={`border-transparent dark:text-slate-900 font-bold w-full cursor-pointer ${type.color}`}
                                >
                                  {type.title.toUpperCase()}
                                </Badge>
                              </Button>
                            ))}
                          </div>
                        </PopoverContent>
                      </Popover>
                    </div>
                    {/* Lógica de Edição Corrigida */}
                    {editingId === goal.id ? (
                      <TextareaAutosize
                        ref={editingId === goal.id ? textareaRef : null} // Associa o ref apenas ao textarea ativo
                        value={editValue}
                        onChange={handleInputChange}
                        className="w-full border-0 resize-none appearance-none overflow-hidden bg-transparent p-0 m-0 font-semibold dark:text-slate-200 focus-visible:outline-none focus-visible:ring-0"
                      />
                    ) : (
                      <p className="m-0 font-semibold dark:text-slate-200 break-words w-full">
                        {goal.title}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    {isTemporary(goal) && (
                      <LoaderCircle className="text-indigo-400 animate-spin" />
                    )}
                    {/* Botão de Editar/Salvar */}
                    <Button
                      disabled={isTemporary(goal)}
                      variant="ghost"
                      size="icon"
                      onClick={() => editGoal(goal)}
                      className="hover:bg-slate-500/60"
                      aria-label={editingId === goal.id ? "Salvar" : "Editar"}
                    >
                      {editingId === goal.id ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <Pencil className="h-4 w-4 dark:text-slate-400" />
                      )}
                    </Button>
                    {/* Botão de Excluir com Popover de Confirmação */}
                    <Popover
                      open={deleteConfirmId === goal.id}
                      onOpenChange={() => toggleDeleteConfirm(goal.id)}
                    >
                      <PopoverTrigger asChild>
                        <Button
                          disabled={isTemporary(goal)}
                          variant="ghost"
                          size="icon"
                          className="hover:bg-slate-500/60"
                          onClick={() => toggleDeleteConfirm(goal.id)}
                          aria-label="Excluir"
                        >
                          <X className="h-4 w-4 dark:text-slate-400" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto bg-stone-950/50 backdrop-blur  text-white p-2">
                        <p className="text-sm">Excluir {`US${goal.id}`}?</p>
                        <Button
                          variant="destructive"
                          size="sm"
                          className="w-full mt-2"
                          onClick={() => deleteGoal(goal.id)}
                        >
                          Excluir
                        </Button>
                      </PopoverContent>
                    </Popover>
                  </div>
                </CardContent>
              </Card>
            ))
        ) : (
          // Exibir um card de exemplo quando não houver goals
          <div className="bg-gray-800 rounded-lg p-4 shadow-md">
            <div className="flex items-center mb-2 gap-2">
              <div className="bg-purple-600 text-white text-xs font-medium py-1 px-3 rounded-full">
                BG
              </div>
              <div className="bg-yellow-600 text-white text-xs font-medium py-1 px-3 rounded-full">
                med
              </div>
            </div>
            <div className="text-white text-base font-medium mb-4">
              Descobrir quem está por trás do desaparecimento dos artefatos
            </div>
          </div>
        )}
      </div>
      <div className="flex flex-col gap-2 ">
        {/* tooltip sobre as goals */}
        <Popover>
          <PopoverTrigger
            asChild
            className=""
          >
            <button className=" flex items-center justify-center gap-2 p-2 rounded-lg text-white bg-gray-800 hover:bg-gray-600 transition-colors">
              <Badge className={`border-0 ${typeColors[0].color}`}>
                {
                  project?.goal_sketches?.filter((goal) => goal.type === "bg")
                    .length
                }
              </Badge>{" "}
              Business Goals
              <Info
                className="text-gray-400"
                size={18}
              />
            </button>
          </PopoverTrigger>
          <PopoverContent className="bg-gray-800 text-white ">
            As histórias de usuário focam nas necessidades dos usuários do
            aplicativo, como a criação de contas para acessar o sistema, a
            gestão de playlists para organizar músicas e outras funcionalidades
            voltadas para a experiência do usuário.
            <PopoverArrow className="fill-gray-800" />
          </PopoverContent>
        </Popover>
        {/* cards de goals */}
        {project?.goal_sketches
          .filter((goal) => goal.type === "bg")
          .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
          .map((goal, i) => (
            <Card
              key={goal.id}
              className="dark:!bg-gray-800 bg-gray-300 border-0"
            >
              <CardContent className="p-2 flex items-center justify-between gap-2">
                <div className="flex flex-col items-start gap-2 flex-1 min-w-0">
                  {/* Badge com Popover para Mudar o Tipo */}
                  <div className="flex items-center gap-2">
                    <Popover
                      open={typeSelectId === goal.id}
                      onOpenChange={() => toggleTypeSelect(goal.id)}
                    >
                      <PopoverTrigger>
                        <Badge
                          className={`border-transparent dark:text-slate-900 font-bold w-fit cursor-pointer 
                              ${
                                typeColors.find(
                                  (color) => color.title === goal.type
                                )?.color
                              }
                              `}
                        >
                          {`BG${goal.id}`}
                          {`BG${isTemporary(goal) ? "" : goal.id}`}
                        </Badge>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto bg-gray-900 border-gray-700 p-1">
                        <div className="flex flex-col gap-1">
                          {typeColors.map((type, i) => (
                            <Button
                              key={i}
                              variant="ghost"
                              className="h-auto p-2 justify-start hover:bg-gray-700/80"
                              onClick={() =>
                                changeGoalType(goal.id, type.title)
                              }
                            >
                              <Badge
                                className={`border-transparent dark:text-slate-900 font-bold w-full cursor-pointer ${type.color}`}
                              >
                                {`${type.title.toUpperCase()}${goal.id}`}
                              </Badge>
                            </Button>
                          ))}
                        </div>
                      </PopoverContent>
                    </Popover>

                    {/* popover com badge para mudar a prioridade  */}
                    <Popover
                      open={prioritySelectId === goal.id}
                      onOpenChange={() => togglePrioritySelect(goal.id)}
                    >
                      <PopoverTrigger>
                        <Badge
                          className={`border-transparent dark:text-slate-900 font-bold w-fit cursor-pointer 
                              ${
                                priorityColors.find(
                                  (color) => color.title === goal.priority
                                )?.color
                              }
                              `}
                        >
                          {goal.priority.toUpperCase()}
                        </Badge>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto bg-gray-900 border-gray-700 p-1">
                        <div className="flex flex-col gap-1">
                          {priorityColors.map((type, i) => (
                            <Button
                              key={i}
                              variant="ghost"
                              className="h-auto p-2 justify-start hover:bg-gray-700/80"
                              onClick={() =>
                                changeGoalPriority(goal.id, type.title)
                              }
                            >
                              <Badge
                                className={`border-transparent dark:text-slate-900 font-bold w-full cursor-pointer ${type.color}`}
                              >
                                {type.title.toUpperCase()}
                              </Badge>
                            </Button>
                          ))}
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                  {/* Lógica de Edição Corrigida */}
                  {editingId === goal.id ? (
                    <TextareaAutosize
                      ref={editingId === goal.id ? textareaRef : null} // Associa o ref apenas ao textarea ativo
                      value={editValue}
                      onChange={handleInputChange}
                      className="w-full border-0 resize-none appearance-none overflow-hidden bg-transparent p-0 m-0 font-semibold dark:text-slate-200 focus-visible:outline-none focus-visible:ring-0"
                    />
                  ) : (
                    <p className="m-0 font-semibold dark:text-slate-200 break-words w-full">
                      {goal.title}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-1">
                  {isTemporary(goal) && (
                    <LoaderCircle className="text-indigo-400 animate-spin" />
                  )}
                  {/* Botão de Editar/Salvar */}
                  <Button
                    disabled={isTemporary(goal)}
                    variant="ghost"
                    size="icon"
                    onClick={() => editGoal(goal)}
                    className="hover:bg-slate-500/60"
                    aria-label={editingId === goal.id ? "Salvar" : "Editar"}
                  >
                    {editingId === goal.id ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <Pencil className="h-4 w-4 dark:text-slate-400" />
                    )}
                  </Button>
                  {/* Botão de Excluir com Popover de Confirmação */}
                  <Popover
                    open={deleteConfirmId === goal.id}
                    onOpenChange={() => toggleDeleteConfirm(goal.id)}
                  >
                    <PopoverTrigger asChild>
                      <Button
                        disabled={isTemporary(goal)}
                        variant="ghost"
                        size="icon"
                        className="hover:bg-slate-500/60"
                        onClick={() => toggleDeleteConfirm(goal.id)}
                        aria-label="Excluir"
                      >
                        <X className="h-4 w-4 dark:text-slate-400" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto bg-stone-950/50 backdrop-blur  text-white p-2">
                      <p className="text-sm">Excluir {`US${goal.id}`}?</p>
                      <Button
                        variant="destructive"
                        size="sm"
                        className="w-full mt-2"
                        onClick={() => deleteGoal(goal.id)}
                      >
                        Excluir
                      </Button>
                    </PopoverContent>
                  </Popover>
                </div>
              </CardContent>
            </Card>
          ))}
      </div>
      {/* Botão "Nova goal" */}
      <button
        className="col-span-2 flex items-center justify-center w-full py-1 bg-gray-800 hover:bg-gray-700 text-blue-400 rounded-lg transition-colors rounded shadow-md"
        onClick={addNewGoal}
      >
        <Plus
          size={18}
          className="mr-2"
        />
        <span>Nova goal</span>
      </button>
    </div>
  )
}

export default Goals
