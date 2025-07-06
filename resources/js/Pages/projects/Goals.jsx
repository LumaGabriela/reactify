import React, { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, Info, Check, Pencil, X, Trash, LoaderCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  PopoverArrow,
} from "@/components/ui/popover"
import TextareaAutosize from "react-textarea-autosize"
import { router } from "@inertiajs/react"
import { cn } from "@/lib/utils"

// --- NOVO COMPONENTE: GoalItem ---
const GoalItem = ({
  goal,
  isTemporary,
  isEditing,
  editValue,
  onValueChange,
  onEdit,
  onSave,
  onCancel,
  onDelete,
  textareaRef,
  typeSelectId,
  onToggleTypeSelect,
  typeColors,
  onChangeGoalType,
  prioritySelectId,
  onTogglePrioritySelect,
  priorityColors,
  onChangeGoalPriority,
}) => {
  const [isHovered, setIsHovered] = useState(false)

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      onSave()
    }
  }

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative group"
    >
      <Card className="bg-card border-0 transition-all duration-300 ease-in-out">
        <CardContent className="p-2 flex flex-col gap-2">
          {/* Badge Row for Type and Priority */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Popover
                open={typeSelectId === goal.id}
                onOpenChange={onToggleTypeSelect}
              >
                <PopoverTrigger disabled={isTemporary}>
                  <Badge
                    className={cn(
                      "border-transparent text-white font-bold cursor-pointer",
                      typeColors.find((c) => c.title === goal.type)?.color
                    )}
                  >
                    {goal.type.toUpperCase()}
                  </Badge>
                </PopoverTrigger>
                <PopoverContent className="w-auto bg-popover border-border p-1">
                  <div className="flex flex-col gap-1">
                    {typeColors.map((type) => (
                      <Button
                        key={type.title}
                        variant="ghost"
                        className="h-auto p-2 justify-start hover:bg-accent"
                        onClick={() => onChangeGoalType(goal.id, type.title)}
                      >
                        <Badge className={cn("w-full text-white", type.color)}>
                          {type.title.toUpperCase()}
                        </Badge>
                      </Button>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
              <Popover
                open={prioritySelectId === goal.id}
                onOpenChange={onTogglePrioritySelect}
              >
                <PopoverTrigger disabled={isTemporary}>
                  <Badge
                    className={cn(
                      "border-transparent text-white font-bold cursor-pointer",
                      priorityColors.find((c) => c.title === goal.priority)?.color
                    )}
                  >
                    {goal.priority.toUpperCase()}
                  </Badge>
                </PopoverTrigger>
                <PopoverContent className="w-auto bg-popover border-border p-1">
                  <div className="flex flex-col gap-1">
                    {priorityColors.map((p) => (
                      <Button
                        key={p.title}
                        variant="ghost"
                        className="h-auto p-2 justify-start hover:bg-accent"
                        onClick={() => onChangeGoalPriority(goal.id, p.title)}
                      >
                        <Badge className={cn("w-full text-white", p.color)}>
                          {p.title.toUpperCase()}
                        </Badge>
                      </Button>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            </div>
            {isTemporary && (
              <LoaderCircle className="text-primary animate-spin size-4" />
            )}
          </div>

          {/* Title and Editing Area */}
          {isEditing ? (
            <div className="flex w-full items-center gap-2">
              <TextareaAutosize
                ref={textareaRef}
                value={editValue}
                onChange={onValueChange}
                onKeyDown={handleKeyDown}
                className="w-full border-0 resize-none appearance-none overflow-hidden bg-transparent p-0 m-0 font-normal text-sm text-foreground focus-visible:outline-none focus-visible:ring-0"
                autoFocus
              />
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-7 text-destructive/80 hover:bg-destructive/10 hover:text-destructive"
                  onClick={onCancel}
                >
                  <X className="size-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-7 text-success/80 hover:bg-success/10 hover:text-success"
                  onClick={onSave}
                >
                  <Check className="size-4" />
                </Button>
              </div>
            </div>
          ) : (
            <p className="m-0 font-normal text-sm text-foreground break-words w-full min-h-[24px]">
              {goal.title}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Hover Actions */}
      <AnimatePresence>
        {isHovered && !isEditing && !isTemporary && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="absolute right-2 top-4 -translate-y-1 flex items-center rounded-md bg-card border border-border shadow-lg"
          >
            <Button
              variant="motiondiv" // Assuming 'motiondiv' is a custom variant you've defined
              size="icon"
              className="text-muted-foreground hover:text-foreground"
              onClick={onEdit}
            >
              <Pencil />
            </Button>
            <Button
              variant="motiondiv"
              size="icon"
              className="text-destructive/80 hover:text-destructive"
              onClick={onDelete}
            >
              <Trash />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
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
        priority: "med",
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


  return (
    <div className="goalSketches rounded grid grid-cols-2 gap-2 w-full p-4 cursor-pointer items-start">
      {/* --- Column 1: Constraint Goals --- */}
      <div className="flex flex-col gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <button className="flex items-center justify-center gap-2 p-2 rounded-lg text-foreground bg-card hover:bg-accent transition-colors">
              <Badge className={cn("border-0", typeColors[1].color)}>
                {project?.goal_sketches?.filter((goal) => goal.type === "cg").length || 0}
              </Badge>
              Constraint Goals
              <Info className="text-muted-foreground" size={18} />
            </button>
          </PopoverTrigger>
          <PopoverContent className="bg-popover text-popover-foreground border-border">
            User stories focus on the needs of the application's users...
            <PopoverArrow className="fill-popover" />
          </PopoverContent>
        </Popover>
        {project.goal_sketches?.filter((goal) => goal.type === "cg").length > 0 ? (
          project.goal_sketches
            .filter((goal) => goal.type === "cg")
            .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
            .map((goal) => (
              <GoalItem
                key={goal.id}
                goal={goal}
                isTemporary={isTemporary(goal)}
                isEditing={editingId === goal.id}
                editValue={editValue}
                onValueChange={handleInputChange}
                onEdit={() => editGoal(goal)}
                onSave={() => editGoal(goal)}
                onCancel={() => setEditingId(null)}
                onDelete={() => deleteGoal(goal.id)}
                textareaRef={editingId === goal.id ? textareaRef : null}
                typeSelectId={typeSelectId}
                onToggleTypeSelect={() => toggleTypeSelect(goal.id)}
                typeColors={typeColors}
                onChangeGoalType={changeGoalType}
                prioritySelectId={prioritySelectId}
                onTogglePrioritySelect={() => togglePrioritySelect(goal.id)}
                priorityColors={priorityColors}
                onChangeGoalPriority={changeGoalPriority}
              />
            ))
        ) : (
          <Card className="bg-card p-4 shadow-md">
            <div className="flex items-center mb-2 gap-2">
              <Badge className={cn("text-white", typeColors.find(c => c.title === "cg")?.color)}>CG</Badge>
              <Badge className={cn("text-white", priorityColors.find(c => c.title === "med")?.color)}>MED</Badge>
            </div>
            <p className="text-foreground text-sm font-medium">Example of a constraint goal...</p>
          </Card>
        )}
      </div>

      {/* --- Column 2: Business Goals --- */}
      <div className="flex flex-col gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <button className="flex items-center justify-center gap-2 p-2 rounded-lg text-foreground bg-card hover:bg-accent transition-colors">
              <Badge className={cn("border-0", typeColors[0].color)}>
                {project?.goal_sketches?.filter((goal) => goal.type === "bg").length || 0}
              </Badge>
              Business Goals
              <Info className="text-muted-foreground" size={18} />
            </button>
          </PopoverTrigger>
          <PopoverContent className="bg-popover text-popover-foreground border-border">
            User stories focus on the needs of the application's users...
            <PopoverArrow className="fill-popover" />
          </PopoverContent>
        </Popover>
        {project.goal_sketches
          ?.filter((goal) => goal.type === "bg")
          .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
          .map((goal) => (
             <GoalItem
                key={goal.id}
                goal={goal}
                isTemporary={isTemporary(goal)}
                isEditing={editingId === goal.id}
                editValue={editValue}
                onValueChange={handleInputChange}
                onEdit={() => editGoal(goal)}
                onSave={() => editGoal(goal)}
                onCancel={() => setEditingId(null)}
                onDelete={() => deleteGoal(goal.id)}
                textareaRef={editingId === goal.id ? textareaRef : null}
                typeSelectId={typeSelectId}
                onToggleTypeSelect={() => toggleTypeSelect(goal.id)}
                typeColors={typeColors}
                onChangeGoalType={changeGoalType}
                prioritySelectId={prioritySelectId}
                onTogglePrioritySelect={() => togglePrioritySelect(goal.id)}
                priorityColors={priorityColors}
                onChangeGoalPriority={changeGoalPriority}
              />
          ))}
      </div>
      
      {/* --- "New Goal" Button --- */}
      <button
        className="col-span-2 flex items-center justify-center w-full py-1 bg-card hover:bg-accent text-primary rounded-lg transition-colors shadow-md"
        onClick={addNewGoal}
      >
        <Plus size={18} className="mr-2" />
        <span>New goal</span>
      </button>
    </div>
  )
}

export default Goals