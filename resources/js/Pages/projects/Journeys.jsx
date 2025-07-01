import React, { useState, useEffect, useRef } from "react"
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core"
import {
  useSortable,
  arrayMove,
  SortableContext,
  rectSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { motion, AnimatePresence } from "framer-motion"
import {
  X,
  Circle,
  Plus,
  Check,
  Edit,
  Trash,
  Map,
  CornerUpRight,
  ChevronDown,
  ChevronRight,
  Sparkles,
  Loader2,
  Info,
  Minus, 
  ChevronsUp,
} from "lucide-react"
import { router } from "@inertiajs/react"
import { toast } from "sonner"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  PopoverArrow,
} from "@/components/ui/popover"
import { Switch } from "@/components/ui/switch"
import TextareaAutosize from "react-textarea-autosize"

const SortableJourneyStepItem = (props) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: props.step.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : "auto",
    boxShadow: isDragging ? "0px 10px 20px rgba(0,0,0,0.2)" : "none",
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
    >
      <JourneyStepItem {...props} />
    </div>
  )
}

const JourneyStepItem = ({
  step,
  stepIndex,
  isLastStep,
  color,
  isEditing,
  editValue,
  onValueChange,
  onEdit,
  onSave,
  onCancel,
  onDelete,
  textareaRef,
}) => {
  const [isHovered, setIsHovered] = useState(false)
  const [showDeletePopover, setShowDeletePopover] = useState(false) 
  const [touchpointChecked, setTouchpointChecked] = useState(step.is_touchpoint)

  useEffect(() => {
    setTouchpointChecked(step.is_touchpoint)
  }, [step.is_touchpoint])

  const handleSave = () => {
    onSave(editValue, touchpointChecked)
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSave()
    }
  }

  const handleConfirmDelete = () => {
    onDelete()
    setShowDeletePopover(false)
  }

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative group flex items-center"
    >
      {/* Circulo */}
      <Badge
        variant="numberIcon"
        className={`${color.bg} z-40`}
      >
        <p className={`m-0 text-gray-900`}>{stepIndex + 1}</p>
      </Badge>
      {/* card de conteudo */}
      <Card className="w-full dark:!bg-gray-900 bg-white border-gray-800 transition-shadow hover:shadow-lg z-20">
        <CardContent className="flex-row items-start justify-between gap-2 p-2 min-h-[60px]">
          <div className="flex items-center flex-1 min-w-0 ">
            <div className="flex-1">
              {isEditing ? (
                <TextareaAutosize
                  ref={textareaRef}
                  value={editValue}
                  onChange={onValueChange}
                  onKeyDown={handleKeyDown}
                  className="w-full text-sm border-0 resize-none appearance-none overflow-hidden bg-transparent p-0 m-0 font-normal dark:text-slate-200 focus-visible:outline-none focus-visible:ring-0"
                  autoFocus
                />
              ) : (
                <p className="m-0 text-sm dark:text-slate-200 break-words w-full">
                  {step.description || "..."}
                </p>
              )}
            </div>
          </div>
          {step.is_touchpoint && !isEditing && (
            <Circle
              size={16}
              className="fill-violet-600 stroke-violet-600 mt-1"
            />
          )}

          <div className="flex items-center gap-1">
            {/* {isTemporary && (
              <LoaderCircle className="text-indigo-400 animate-spin" />
            )} */}
            {isEditing ? (
              <>
                <Switch
                  id={`touchpoint-switch-${stepIndex}`}
                  checked={touchpointChecked}
                  onCheckedChange={setTouchpointChecked}
                  className="data-[state=checked]:!bg-violet-900 data-[state=unchecked]:bg-neutral-200 ring-gray-800 focus-visible:ring-1 focus-visible:ring-gray-800"
                />

                <Button
                  variant="ghost"
                  size="icon"
                  className="size-7 text-red-500/80 hover:bg-red-500/10"
                  onClick={onCancel}
                >
                  <X className="size-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-7 text-green-400 hover:bg-green-500/10"
                  onClick={handleSave}
                >
                  <Check />
                </Button>
              </>
            ) : (
              <div></div>
            )}
          </div>
        </CardContent>
      </Card>

      <AnimatePresence>
        {isHovered && !isEditing && (
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.2 }}
            className="z-40 absolute top-3 right-3 flex items-center rounded-md bg-gray-900/50 backdrop-blur-sm border border-gray-700 shadow-xl"
          >
            <Button
              variant="motiondiv"
              size="icon"
              className="text-gray-300 hover:text-white"
              onClick={onEdit}
            >
              <Edit />
            </Button>
            {/* Usando a lógica do Popover que implementamos */}
            <Popover
              open={showDeletePopover}
              onOpenChange={setShowDeletePopover}
            >
              <PopoverTrigger asChild>
                <Button
                  variant="motiondiv"
                  size="icon"
                  className="text-red-500/80 hover:text-red-500"
                >
                  <Trash />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-56 bg-gray-800 border-gray-700 text-white">
                <div className="space-y-4">
                  <div className="space-y-1">
                    <h4 className="font-medium leading-none">
                      Confirmar Exclusão
                    </h4>
                    <p className="text-sm text-gray-400">
                      Deseja realmente excluir este passo?
                    </p>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowDeletePopover(false)}
                    >
                      Cancelar
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={handleConfirmDelete}
                    >
                      Excluir
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </motion.div>
        )}
      </AnimatePresence>

      {!isLastStep && (
        <div className="absolute top-1/2 -right-3 translate-x-1 -translate-y-1/2 text-gray-300 z-0">
          <CornerUpRight
            size={20}
            strokeWidth={1.5}
          />
        </div>
      )}
      {/* </div> */}
    </div>
  )
}

const Journeys = ({ project, setProject }) => {
  const [expandedJourney, setExpandedJourney] = useState(null)
  const [editingStep, setEditingStep] = useState({
    journeyId: null,
    stepIndex: null,
  })
  const [editValue, setEditValue] = useState("")
  const [editingJourney, setEditingJourney] = useState(null)
  const [editJourneyName, setEditJourneyTitle] = useState("")
  const [isGeneratingAI, setIsGeneratingAI] = useState(false)
  const [generatedJourneys, setGeneratedJourneys] = useState([])
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [isModalMinimized, setIsModalMinimized] = useState(false)
  const textareaRef = useRef(null)
  const colors = [
    {
      text: "text-orange-500",
      border: "border-orange-500",
      bg: "bg-orange-500",
    },
    {
      text: "text-violet-500",
      border: "border-violet-500",
      bg: "bg-violet-500",
    },
    { text: "text-blue-500", border: "border-blue-500", bg: "bg-blue-500" },
    {
      text: "text-emerald-500",
      border: "border-emerald-500",
      bg: "bg-emerald-500",
    },
    { text: "text-rose-500", border: "border-rose-500", bg: "bg-rose-500" },
    { text: "text-cyan-500", border: "border-cyan-500", bg: "bg-cyan-500" },
    { text: "text-teal-500", border: "border-teal-500", bg: "bg-teal-500" },
  ]

  const sensors = useSensors(
    useSensor(PointerSensor, {
      // Requer um pequeno movimento antes de iniciar o arrasto
      activationConstraint: {
        distance: 14,
      },
    })
  )

  // Função que será chamada quando o arrasto terminar
  const handleDragEnd = (event, journeyId) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const journey = project.journeys.find((j) => j.id === journeyId)
      const steps = journey.steps
      const oldIndex = steps.findIndex((step) => step.id === active.id)
      const newIndex = steps.findIndex((step) => step.id === over.id)

      // Usa a função `arrayMove` do dnd-kit para reordenar o array
      const reorderedSteps = arrayMove(steps, oldIndex, newIndex)

      // Chama a sua função existente para atualizar o estado e a API
      handleReorderSteps(journeyId, reorderedSteps)
    }
  }
  // Função para gerar journeys com IA
  const generateJourneysWithAI = async () => {
    setIsGeneratingAI(true)
    setIsModalMinimized(false) 

    try {
      const response = await fetch("/api/journeys/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Requested-With": "XMLHttpRequest",
          "X-CSRF-TOKEN":
            document
              .querySelector('meta[name="csrf-token"]')
              ?.getAttribute("content") || "",
        },
        body: JSON.stringify({
          project_id: project.id,
        }),
      })

      const data = await response.json()

      if (data.status === "sucesso") {
        console.log(data.journeys)
        const journeysWithSelection = data.journeys.map((journey) => ({
          ...journey,
          selected: true, // Por padrão, todas vêm selecionadas
        }))
        setGeneratedJourneys(journeysWithSelection)
        setShowConfirmModal(true)
        toast.success("Journeys geradas com sucesso.")
      } else {
        if (data.status == "warning")
          toast.warning(data.message)
        else
          toast.error(data.message)
      }
    } catch (error) {
      toast.error("Erro ao comunicar com o servidor")
    } finally {
      setIsGeneratingAI(false)
    }
  }

  // Função para alternar seleção de uma journey
  const toggleJourneySelection = (index) => {
    setGeneratedJourneys((prev) =>
      prev.map((journey, i) =>
        i === index ? { ...journey, selected: !journey.selected } : journey
      )
    )
  }

  // Função para selecionar/deselecionar todas as journeys
  const toggleAllJourneys = () => {
    const allSelected = generatedJourneys.every((journey) => journey.selected)
    setGeneratedJourneys((prev) =>
      prev.map((journey) => ({ ...journey, selected: !allSelected }))
    )
  }

  // Função para confirmar e adicionar as journeys selecionadas
  const confirmGeneratedJourneys = () => {
    const selectedJourneys = generatedJourneys.filter(
      (journey) => journey.selected
    )
    const remainingJourneys = generatedJourneys.filter(
      (journey) => !journey.selected
    )

    if (selectedJourneys.length === 0) {
      toast.warning("Selecione pelo menos uma journey para adicionar.")
      return
    }

    // Mapeia as jornadas selecionadas para o formato esperado pelo estado local
    const journeysToAdd = selectedJourneys.map((journey) => {
      const { selected, ...rest } = journey
      return {
        id: Date.now() + Math.random(),
        created_at: new Date().toISOString(),
        project_id: project.id,
        ...rest,
      }
    })

    // Adiciona as novas jornadas ao estado do projeto
    const updatedProjectJourneys = project.journeys
      ? [...project.journeys, ...journeysToAdd]
      : [...journeysToAdd]
    setProject({ ...project, journeys: updatedProjectJourneys })

    // Prepara os dados para o backend (sem os campos gerados localmente)
    const journeysForBackend = selectedJourneys.map(
      ({ id, created_at, project_id, selected, ...rest }) => ({
        ...rest,
        steps: rest.steps.map((step) => ({
          description: step.description,
          is_touchpoint: step.is_touchpoint || false,
        })),
      })
    )

    // Persiste no backend
    router.post(
      route("journey.bulk-store"),
      {
        project_id: project.id,
        journeys: journeysForBackend,
      },
      {
        preserveState: true,
        preserveScroll: true,
        onSuccess: () => {
          toast.success(
            `${selectedJourneys.length} journey(s) adicionada(s) com sucesso!`
          )
          // Atualiza o estado do modal com as jornadas restantes
          setGeneratedJourneys(remainingJourneys)

          // Se não houver mais jornadas restantes, fecha o modal
          if (remainingJourneys.length === 0) {
            setShowConfirmModal(false)
            setIsModalMinimized(false)
          }
        },
        onError: () => {
          toast.error("Ocorreu um erro ao adicionar as jornadas.")
        },
      }
    )
  }

  // Função para cancelar e limpar as journeys geradas
  const cancelGeneratedJourneys = () => {
    setShowConfirmModal(false)
    setGeneratedJourneys([]) 
    setIsModalMinimized(false) 
  }

  // Todas as funções existentes permanecem inalteradas
  const toggleJourney = (JourneyId) => {
    if (expandedJourney === JourneyId) {
      setExpandedJourney(null)
    } else {
      setExpandedJourney(JourneyId)
    }
  }

  // Função para iniciar a edição de um step
  const startEditStep = (journeyId, stepIndex) => {
    const step =
      project.journeys.find((j) => j.id === journeyId)?.steps?.[stepIndex] ??
      null
    setEditingStep({ journeyId, stepIndex })
    setEditValue(step.description)
  }

  // Função para iniciar a edição de uma journey
  const startEditJourney = (JourneyId) => {
    const journey = project.journeys.find((j) => j.id === JourneyId)
    setEditingJourney(JourneyId)
    setEditJourneyTitle(journey.title)
  }

  // Função para adicionar uma nova journey
  const addNewJourney = () => {
    const newJourney = {
      title: "Nova Journey",
      steps: [],
    }

    const updatedJourneys = project.journeys
      ? [...project.journeys, newJourney]
      : [newJourney]
    setProject({ ...project, journeys: updatedJourneys })

    router.post(
      route("journey.store"),
      {
        title: newJourney.title,
        steps: [],
        project_id: project.id,
      },
      { preserveState: true, preserveScroll: true }
    )

    // Expandir a journey recém-criada (último índice)
    setExpandedJourney(updatedJourneys.length - 1)
  }

  // Função para adicionar um novo step a uma journey
  const addNewStep = (JourneyId) => {
    if (!project.journeys) return
    const currentSteps =
      project.journeys.find((journey) => journey.id === JourneyId)?.steps || []
    const newStep = {
      id: `step_${Date.now()}`,
      step: currentSteps.length + 1,
      description: "Novo passo",
      is_touchpoint: false,
    }

    const updatedJourneys = project.journeys.map((journey) => {
      if (journey.id === JourneyId) {
        return {
          ...journey,
          steps: [...journey.steps, newStep],
        }
      }
      return journey
    })

    setProject({ ...project, journeys: updatedJourneys })
    router.patch(route("journey.update", JourneyId), {
      steps: [...currentSteps, newStep],
    })
  }
  // Função para salvar a edição de uma journey
  const saveEditJourney = () => {
    const journeyId = editingJourney
    if (journeyId === null || !project.journeys) return

    const updatedJourneys = project.journeys.map((journey) =>
      journey.id === journeyId
        ? { ...journey, title: editJourneyName }
        : journey
    )

    setProject({ ...project, journeys: updatedJourneys })
    setEditingJourney(null)

    router.patch(route("journey.update", journeyId), {
      title: editJourneyName,
    })
  }

  // Função para salvar a edição de um step
  const saveEditStep = (description, isTouchpoint) => {
    const { journeyId, stepIndex } = editingStep
    if (!journeyId || stepIndex === null) return
    const journey = project.journeys.find((j) => j.id === journeyId)
    if (!journey) return
    const updatedSteps = journey.steps.map((s, i) =>
      i === stepIndex
        ? { ...s, description: description, is_touchpoint: isTouchpoint }
        : s
    )
    const updatedJourneys = project.journeys.map((j) =>
      j.id === journeyId ? { ...j, steps: updatedSteps } : j
    )
    setProject({ ...project, journeys: updatedJourneys })
    cancelEditStep()
    router.patch(route("journey.update", journeyId), { steps: updatedSteps })
  }

  // Crie uma função para cancelar a edição
  const cancelEditStep = () => {
    setEditingStep({ journeyId: null, stepIndex: null })
  }

  // Função para excluir um step
  const deleteStep = (journeyId, stepIndex) => {
    if (journeyId === null || stepIndex === null) return

    const journey = project.journeys.find((j) => j.id === journeyId)
    if (!journey || !journey.steps || stepIndex >= journey.steps.length) return

    const updatedSteps = [...journey.steps]
    updatedSteps.splice(stepIndex, 1)

    const reorderedSteps = updatedSteps.map((s, idx) => ({
      ...s,
      step: idx + 1,
    }))

    const updatedJourneys = project.journeys.map((j) =>
      j.id === journeyId ? { ...j, steps: reorderedSteps } : j
    )

    setProject({ ...project, journeys: updatedJourneys })

    router.patch(route("journey.update", journeyId), {
      steps: reorderedSteps,
    })
  }

  // Função para excluir uma journey inteira
  const deleteJourney = (journeyIdToDelete) => {
    if (journeyIdToDelete === null) return

    const updatedJourneys = project.journeys.filter(
      (journey) => journey.id !== journeyIdToDelete
    )

    if (expandedJourney === journeyIdToDelete) {
      setExpandedJourney(null)
    }

    setProject((prevProject) => ({
      ...prevProject,
      journeys: updatedJourneys,
    }))

    router.delete(route("journey.delete", journeyIdToDelete), {
      preserveScroll: true,
    })
  }
  // reordena os steps
  const handleReorderSteps = (journeyId, reorderedSteps) => {
    const newStepsWithCorrectOrder = reorderedSteps.map((step, index) => ({
      ...step,
      step: index + 1,
    }))

    const updatedJourneys = project.journeys.map((j) =>
      j.id === journeyId ? { ...j, steps: newStepsWithCorrectOrder } : j
    )
    setProject({ ...project, journeys: updatedJourneys })

    router.patch(
      route("journey.update", journeyId),
      {
        steps: newStepsWithCorrectOrder,
      },
      {
        preserveState: true,
        preserveScroll: true,
      }
    )
  }

  return (
    <div className="flex flex-col gap-4 p-4 w-full">
      {/* Modal de confirmação das journeys geradas */}
      {showConfirmModal && (
        <div
          className={`
            transition-all duration-300 z-50
            ${
              isModalMinimized
                ? "fixed bottom-4 right-4 w-[400px]" // Estilo minimizado
                : "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center" // Estilo maximizado
            }
          `}
        >
          <div className="bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl">
            {/* Cabeçalho fixo */}
            <div className="flex items-center justify-between p-6 pb-4 flex-shrink-0">
              <h3 className="text-xl font-bold text-white flex items-center">
                <Sparkles
                  className="mr-2 text-yellow-400"
                  size={24}
                />
                {!isModalMinimized && "Journeys Geradas pela IA"}
                 {isModalMinimized && "Journeys Geradas"}
              </h3>
              <div className="flex items-center gap-2">
                 <button
                  onClick={() => setIsModalMinimized(!isModalMinimized)}
                  className="text-gray-400 hover:text-white"
                >
                  {isModalMinimized ? <ChevronsUp size={20} /> : <Minus size={20} />}
                </button>
                <button
                  onClick={cancelGeneratedJourneys}
                  className="text-gray-400 hover:text-white"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            {!isModalMinimized && (
            <>
              {/* Controle para selecionar/deselecionar todos - fixo */}
              <div className="flex items-center justify-between mx-6 mb-4 p-3 bg-gray-700 rounded-lg flex-shrink-0">
                <span className="text-white font-medium">
                  {generatedJourneys.filter((j) => j.selected).length} de{" "}
                  {generatedJourneys.length} selecionadas
                </span>
                <button
                  onClick={toggleAllJourneys}
                  className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white text-sm rounded transition-colors"
                >
                  {generatedJourneys.every((journey) => journey.selected)
                    ? "Desmarcar Todas"
                    : "Selecionar Todas"}
                </button>
              </div>

              {/* Área rolável das journeys */}
              <div className="flex-1 overflow-y-auto px-6 min-h-0">
                <div className="space-y-4 pb-4">
                  {generatedJourneys.map((journey, index) => (
                    <div
                      key={index}
                      className={`rounded-lg p-4 border-2 transition-colors ${
                        journey.selected
                          ? "bg-gray-700 border-blue-500"
                          : "bg-gray-600 border-gray-500"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-white font-medium">
                          {journey.title}
                        </h4>
                        <label className="flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={journey.selected}
                            onChange={() => toggleJourneySelection(index)}
                            className="mr-2 w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
                          />
                        </label>
                      </div>
                      <div className="space-y-2">
                        {journey.steps.map((step, stepIndex) => (
                          <div
                            key={stepIndex}
                            className="flex items-center text-sm text-gray-300"
                          >
                            <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs mr-2">
                              {stepIndex + 1}
                            </span>
                            <span className="flex-1">{step.description}</span>
                            {step.is_touchpoint && (
                              <span className="bg-green-500 text-white text-xs px-2 py-1 rounded ml-2">
                                Touchpoint
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Botões fixos na parte inferior */}
              <div className="flex justify-end space-x-3 p-6 pt-4 border-t border-gray-700 flex-shrink-0">
                <button
                  onClick={cancelGeneratedJourneys}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmGeneratedJourneys}
                  className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg transition-colors flex items-center"
                  disabled={
                    generatedJourneys.filter((j) => j.selected).length === 0
                  }
                >
                  <Check
                    className="mr-2"
                    size={16}
                  />
                  Confirmar e Adicionar (
                  {generatedJourneys.filter((j) => j.selected).length})
                </button>
              </div>
            </>
            )}
          </div>
        </div>
      )}

      {project.journeys && project.journeys.length > 0 ? (
        project.journeys
          .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
          .map((journey, i) => (
            <div
              key={i}
              className="bg-gray-800 rounded-lg shadow-md overflow-hidden"
            >
              {/* Cabeçalho da Journey */}
              <div
                className="flex items-center justify-between py-2 px-3 cursor-pointer bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
                onClick={() => toggleJourney(journey.id)}
              >
                <div className="flex items-center text-2xl">
                  <Map
                    className="text-purple-2 mr-2"
                    size={20}
                  />
                  {editingJourney === journey.id ? (
                    <input
                      type="text"
                      value={editJourneyName}
                      onChange={(e) => setEditJourneyTitle(e.target.value)}
                      onKeyUp={(e) => {
                        if (e.key === "Enter") saveEditJourney()
                      }}
                      className=" text-white p-0 bg-transparent border-none focus:ring-0 font-medium text-2xl rounded h-full focus:outline-none"
                      autoFocus
                    />
                  ) : (
                    <h4 className="text-white font-medium m-0">
                      {journey.title}
                    </h4>
                  )}
                </div>

                <div className="flex items-center">
                  {editingJourney === journey.id ? (
                    <button
                      className="p-1 bg-green-600/60 hover:bg-green-600 transition-colors rounded-full mr-2"
                      onClick={(e) => {
                        e.stopPropagation()
                        saveEditJourney()
                      }}
                    >
                      <Check
                        size={20}
                        className="stroke-gray-300"
                      />
                    </button>
                  ) : (
                    <button
                      className="p-1 hover:bg-gray-500 rounded-full mr-2"
                      onClick={(e) => {
                        e.stopPropagation()
                        startEditJourney(journey.id)
                      }}
                    >
                      <Edit
                        size={20}
                        className="stroke-gray-300"
                      />
                    </button>
                  )}
                  {/* remover journey */}
                  <Popover>
                    <PopoverTrigger asChild>
                      <button
                        className="p-1 hover:bg-gray-500 rounded-full mr-2"
                        onClick={(e) => e.stopPropagation()} // Impede que o toggle da journey seja acionado
                      >
                        <Trash
                          size={20}
                          className="stroke-red-500"
                        />
                      </button>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-60 bg-gray-800 border-gray-700 text-white"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="space-y-3">
                        <div className="space-y-1">
                          <h4 className="font-medium">Excluir Journey</h4>
                          <p className="text-sm text-gray-400">
                            Tem certeza? Todos os passos desta jornada serão
                            perdidos.
                          </p>
                        </div>
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => deleteJourney(journey.id)}
                          >
                            Excluir
                          </Button>
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>

                  {expandedJourney === journey.id ? (
                    <ChevronRight
                      className="text-white animate-rotate-90"
                      size={20}
                    />
                  ) : (
                    <ChevronDown
                      className="text-white animate-rotate-90-reverse"
                      size={20}
                    />
                  )}
                </div>
              </div>

              {/* Conteúdo da Journey (Steps) */}
              {expandedJourney === journey.id && (
                <>
                  {journey.steps && journey.steps.length > 0 ? (
                    <div className="flex flex-col">
                      {/* DND-KIT CONTEXT WRAPPER */}
                      <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={(event) => handleDragEnd(event, journey.id)}
                      >
                        <SortableContext
                          items={journey.steps.map((s) => s.id)}
                          strategy={rectSortingStrategy}
                        >
                          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 items-start justify-center p-4">
                            {journey?.steps.map((step, stepIndex) => {
                              const colorIndex = stepIndex % colors.length
                              const currentColor = colors[colorIndex]
                              const isCurrentlyEditing =
                                editingStep.journeyId === journey.id &&
                                editingStep.stepIndex === stepIndex

                              return (
                                <SortableJourneyStepItem
                                  key={step.id}
                                  step={step}
                                  stepIndex={stepIndex}
                                  isLastStep={
                                    stepIndex === journey.steps.length - 1
                                  }
                                  color={currentColor}
                                  isEditing={isCurrentlyEditing}
                                  editValue={
                                    isCurrentlyEditing
                                      ? editValue
                                      : step.description
                                  }
                                  onValueChange={(e) =>
                                    setEditValue(e.target.value)
                                  }
                                  onEdit={() =>
                                    startEditStep(journey.id, stepIndex)
                                  }
                                  onSave={saveEditStep}
                                  onCancel={cancelEditStep}
                                  onDelete={() =>
                                    deleteStep(journey.id, stepIndex)
                                  }
                                  textareaRef={
                                    isCurrentlyEditing ? textareaRef : null
                                  }
                                />
                              )
                            })}
                            <div className="flex justify-start items-center h-full">
                              <button
                                className="w-10 h-10 rounded bg-gray-700 hover:bg-gray-600 flex items-center justify-center text-blue-400"
                                onClick={() => addNewStep(journey.id)}
                              >
                                <Plus size={18} />
                              </button>
                            </div>
                          </div>
                        </SortableContext>
                      </DndContext>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center p-4 text-gray-400">
                      <p className="mb-2">
                        Esta journey ainda não possui passos.
                      </p>
                      <button
                        className="flex items-center justify-center py-1 px-3 bg-gray-700 hover:bg-gray-600 text-blue-400 rounded transition-colors"
                        onClick={() => addNewStep(journey.id)}
                      >
                        <Plus size={16} />
                        <span className="text-sm">
                          Adicionar primeiro passo
                        </span>
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          ))
      ) : (
        <div className="flex flex-col items-center justify-center p-6 bg-gray-800 rounded-lg text-gray-400">
          <Map
            size={40}
            className="mb-4 text-purple-2"
          />
          <p className="mb-2">Nenhuma journey definida ainda.</p>
          <p className="mb-4 text-sm">
            Crie uma nova journey para mapear o fluxo do usuário.
          </p>
        </div>
      )}

      {/* Container dos botões */}
      <div className="flex gap-2 w-full items-center">
        <button
          className="flex-1 flex items-center justify-center py-2 px-4 bg-gray-800 hover:bg-gray-700 text-blue-400 rounded-lg transition-colors shadow-md"
          onClick={addNewJourney}
        >
          <Plus
            size={18}
            className="mr-2"
          />
          <span>Nova Journey</span>
        </button>

        <button
          className="flex-1 flex items-center justify-center py-2 px-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={generateJourneysWithAI}
          disabled={isGeneratingAI}
        >
          {isGeneratingAI ? (
            <Loader2
              className="animate-spin mr-2"
              size={18}
            />
          ) : (
            <Sparkles
              className="mr-2"
              size={18}
            />
          )}
          <span>{isGeneratingAI ? "Gerando..." : "Gerar com IA"}</span>

          <Popover>
            <PopoverTrigger asChild>
              <Info
                onClick={(e) => e.stopPropagation()}
                className="text-gray-400 cursor-pointer transition-colors hover:text-gray-300 mx-2"
                size={15}
              />
            </PopoverTrigger>
            <PopoverContent className="bg-gray-800 text-white ">
              Esta função utiliza IA para gerar jornadas personalizadas baseadas
              nas Goals definidas nas Personas.
              <PopoverArrow className="fill-gray-800" />
            </PopoverContent>
          </Popover>
        </button>
      </div>
    </div>
  )
}

export default Journeys