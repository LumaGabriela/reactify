import React, { useState } from "react"
import {
  Plus,
  ChevronDown,
  ChevronRight,
  Map,
  Circle,
  CornerUpRight,
  Sparkles,
  Check,
  X,
  Loader2,
  Info
} from "lucide-react"
import { ModalConfirmation } from "@/Components/Modals"
import TextArea from "@/Components/TextArea"
import { router } from "@inertiajs/react"
import {
  Popover,
  PopoverArrow,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

const Journeys = ({ project, setProject }) => {
  // Estados existentes
  const [expandedJourney, setExpandedJourney] = useState(0)
  const [editingStep, setEditingStep] = useState({
    JourneyId: null,
    stepIndex: null,
  })
  const [editValue, setEditValue] = useState("")
  const [deleteConfirmStep, setDeleteConfirmStep] = useState({
    JourneyId: null,
    stepIndex: null,
  })
  const [editingJourney, setEditingJourney] = useState(null)
  const [editJourneyName, setEditJourneyTitle] = useState("")
  const [deleteConfirmJourney, setDeleteConfirmJourney] = useState(null)

  // Novos estados para geração de IA
  const [isGeneratingAI, setIsGeneratingAI] = useState(false)
  const [generatedJourneys, setGeneratedJourneys] = useState([])
  const [showConfirmModal, setShowConfirmModal] = useState(false)

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

  // Função para gerar journeys com IA
  const generateJourneysWithAI = async () => {
    setIsGeneratingAI(true)

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
        // Adicionar propriedade 'selected' para cada journey gerada
        const journeysWithSelection = data.journeys.map((journey) => ({
          ...journey,
          selected: true, // Por padrão, todas vêm selecionadas
        }))
        setGeneratedJourneys(journeysWithSelection)
        setShowConfirmModal(true)
      } else {
        alert("Erro ao gerar journeys: " + data.message)
      }
    } catch (error) {
      console.error("Erro ao gerar journeys:", error)
      alert("Erro ao comunicar com o servidor")
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
    const selectedJourneys = generatedJourneys
      .filter((journey) => journey.selected === true)
      .map((journey) => {
        const { selected, ...rest } = journey
        return {
          id: Date.now() + Math.random(),
          created_at: new Date().toISOString(),
          project_id: project.id,
          ...rest,
        }
      })

    console.log("selec", selectedJourneys)

    if (selectedJourneys.length === 0) {
      alert("Selecione pelo menos uma journey para adicionar.")
      return
    }

    // Adicionar ao estado antes de persistir
    const updatedJourneys = project.journeys
      ? [...project.journeys, ...selectedJourneys]
      : [...selectedJourneys]

    console.log("up", updatedJourneys)

    setProject({ ...project, journeys: updatedJourneys })

    // Preparar dados para envio (remover id e created_at que são gerados localmente)
    const journeysForBackend = selectedJourneys.map(
      ({ id, created_at, project_id, ...rest }) => ({
        ...rest,
        steps: rest.steps.map((step) => ({
          description: step.description,
          is_touchpoint: step.is_touchpoint || false,
        })),
      })
    )

    console.log(journeysForBackend)

    // Persistir no backend
    router.post(
      route("journey.bulk-store"),
      {
        project_id: project.id,
        journeys: journeysForBackend,
      },
      {
        preserveState: true,
        preserveScroll: true,
      }
    )

    setShowConfirmModal(false)
    setGeneratedJourneys([])
  }

  // Função para cancelar as journeys geradas
  const cancelGeneratedJourneys = () => {
    setShowConfirmModal(false)
    setGeneratedJourneys([])
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
  const startEditStep = (JourneyId, stepIndex) => {
    const step =
      project.journeys.find((j) => j.id === JourneyId)?.steps?.[stepIndex] ??
      null
    setEditingStep({ JourneyId, stepIndex })
    setEditValue(step.description)
  }

  // Função para mostrar confirmação de exclusão de step
  const confirmDeleteStep = (JourneyId, stepIndex) => {
    setDeleteConfirmStep({ JourneyId, stepIndex })
  }

  // Função para iniciar a edição de uma journey
  const startEditJourney = (JourneyId) => {
    const journey = project.journeys.find((j) => j.id === JourneyId)
    setEditingJourney(JourneyId)
    setEditJourneyTitle(journey.title)
  }

  // Função para mostrar confirmação de exclusão de journey
  const confirmDeleteJourney = (JourneyId) => {
    setDeleteConfirmJourney(JourneyId)
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
    // const currentSteps = project.journeys[JourneyId].steps || [];
    const newStep = {
      step: currentSteps.length + 1,
      description: "Novo passo",
      touchpoint: false,
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
  const saveEditStep = (touchpoint = false) => {
    const { JourneyId, stepIndex } = editingStep

    if (!JourneyId || stepIndex === null) return

    // Encontra a jornada específica
    const journey = project.journeys.find((j) => j.id === JourneyId)

    let updatedSteps
    // Cria uma nova versão dos steps com a edição aplicada
    if (touchpoint) {
      updatedSteps = journey.steps.map((s, i) =>
        i === stepIndex
          ? {
              ...s,
              description: editValue,
              touchpoint: s.touchpoint ? false : true,
            }
          : s
      )
    } else {
      updatedSteps = journey.steps.map((s, i) =>
        i === stepIndex ? { ...s, description: editValue } : s
      )
    }

    // Cria uma nova lista de journeys com a jornada editada
    const updatedJourneys = project.journeys.map((j) =>
      j.id === JourneyId ? { ...j, steps: updatedSteps } : j
    )

    // Atualiza o estado
    setProject({ ...project, journeys: updatedJourneys })
    setEditingStep({ JourneyId: null, stepIndex: null })

    router.patch(route("journey.update", JourneyId), {
      steps: updatedSteps,
    })
  }

  // Função para excluir um step
  const deleteStep = () => {
    const journeyId = deleteConfirmStep.JourneyId
    const stepIndex = deleteConfirmStep.stepIndex

    if (journeyId === null || stepIndex === null) return

    // Encontra a jornada pelo ID
    const journey = project.journeys.find((j) => j.id === journeyId)
    if (!journey || !journey.steps || stepIndex >= journey.steps.length) return

    // Cria uma nova lista de steps removendo o step no índice especificado
    const updatedSteps = [...journey.steps]
    updatedSteps.splice(stepIndex, 1)

    // Reordena os steps
    const reorderedSteps = updatedSteps.map((s, idx) => ({
      ...s,
      step: idx + 1,
    }))

    // Cria uma nova lista de jornadas com a jornada atualizada
    const updatedJourneys = project.journeys.map((j) =>
      j.id === journeyId ? { ...j, steps: reorderedSteps } : j
    )

    // Atualiza o estado do projeto
    setProject({ ...project, journeys: updatedJourneys })
    setDeleteConfirmStep({ JourneyId: null, stepIndex: null })

    // Envia os steps atualizados ao backend
    router.patch(route("journey.update", journeyId), {
      steps: reorderedSteps,
    })
  }

  // Função para excluir uma journey inteira
  const handleDeleteJourney = () => {
    if (deleteConfirmJourney === null || !project.journeys) return

    const updatedJourneys = project.journeys.filter(
      (journey) => journey.id !== deleteConfirmJourney
    )

    setExpandedJourney(null)
    setDeleteConfirmJourney(null)

    setProject((prevProject) => ({
      ...prevProject,
      journeys: updatedJourneys,
    }))

    router.delete(route("journey.delete", deleteConfirmJourney))
  }

  return (
    <div className="flex flex-col gap-4 p-4 w-full">
      {/* Modal de confirmação das journeys geradas */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg max-w-4xl max-h-[80vh] flex flex-col">
            {/* Cabeçalho fixo */}
            <div className="flex items-center justify-between p-6 pb-4 flex-shrink-0">
              <h3 className="text-xl font-bold text-white flex items-center">
                <Sparkles
                  className="mr-2 text-yellow-400"
                  size={24}
                />
                Journeys Geradas pela IA
              </h3>
              <button
                onClick={cancelGeneratedJourneys}
                className="text-gray-400 hover:text-white"
              >
                <X size={24} />
              </button>
            </div>

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
                      className="p-1 bg-green-700 hover:bg-green-600 rounded-full mr-2"
                      onClick={(e) => {
                        e.stopPropagation()
                        saveEditJourney()
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-green-300"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </button>
                  ) : (
                    <button
                      className="p-1 hover:bg-gray-500 rounded-full mr-2"
                      onClick={(e) => {
                        e.stopPropagation()
                        startEditJourney(journey.id)
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-gray-300"
                      >
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                      </svg>
                    </button>
                  )}

                  <button
                    className="p-1 hover:bg-gray-500 rounded-full mr-2"
                    onClick={(e) => {
                      e.stopPropagation()
                      confirmDeleteJourney(journey.id)
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-red-400"
                    >
                      <path d="M3 6h18"></path>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                  </button>

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

              {/* Diálogo de confirmação de exclusão de journey */}
              {deleteConfirmJourney === journey.id && (
                <ModalConfirmation
                  onConfirm={handleDeleteJourney}
                  onCancel={() => setDeleteConfirmJourney(null)}
                  message="Deseja remover esta journey e todos seus passos?"
                />
              )}

              {/* Conteúdo da Journey (Steps) */}
              {expandedJourney === journey.id && (
                <>
                  {journey.steps && journey.steps.length > 0 ? (
                    <div className="flex flex-col">
                      {/* Grid de steps */}
                      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 items-center justify-center p-4">
                        {/* Steps com setas de conexão */}
                        {journey?.steps.map((step, stepIndex) => {
                          const colorIndex = stepIndex % colors.length
                          const currentColor = colors[colorIndex]
                          return (
                            <div
                              key={stepIndex}
                              className="step relative flex min-h-full min-w-full cursor-pointer rounded hover:bg-gray-700 transition-colors popup-animation"
                            >
                              <div
                                onClick={() =>
                                  startEditStep(journey.id, stepIndex)
                                }
                                className={`rounded-lg border-4 ${currentColor.border} flex min-h-full min-w-full`}
                              >
                                <div
                                  className={`absolute -top-4 -left-1 ${currentColor.bg} text-white rounded-full w-8 h-8 flex items-center justify-center font-bold`}
                                >
                                  {stepIndex + 1}
                                </div>
                                {editingStep.JourneyId === journey.id &&
                                editingStep.stepIndex === stepIndex ? (
                                  <div
                                    className="h-full w-full p-2 text-sm bg-gray-700 rounded"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <TextArea
                                      value={editValue}
                                      onChange={(e) =>
                                        setEditValue(e.target.value)
                                      }
                                      onEnter={() => saveEditStep()}
                                    />
                                    <div className="flex justify-between mt-1">
                                      <button
                                        className="bg-green-600 hover:bg-green-500 text-white text-xs p-1 rounded"
                                        onClick={saveEditStep}
                                      >
                                        Salvar
                                      </button>
                                      <button
                                        className="bg-red-600 hover:bg-red-500 text-white text-xs p-1 rounded"
                                        onClick={() =>
                                          confirmDeleteStep(
                                            journey.id,
                                            stepIndex
                                          )
                                        }
                                      >
                                        Excluir
                                      </button>
                                      <button
                                        onClick={() => saveEditStep(true)}
                                      >
                                        {step.touchpoint ? (
                                          <Circle
                                            size={20}
                                            color="red"
                                            fill="red"
                                          />
                                        ) : (
                                          <Circle
                                            size={20}
                                            color="black"
                                          />
                                        )}
                                      </button>
                                    </div>
                                  </div>
                                ) : (
                                  <p className={` mt-2 p-2 text-white text-sm`}>
                                    {step.description}
                                  </p>
                                )}
                              </div>

                              {/* Diálogo de confirmação de exclusão de step */}
                              {deleteConfirmStep.JourneyId === journey.id &&
                                deleteConfirmStep.stepIndex === stepIndex && (
                                  <div className="absolute top-16 left-1/2 transform -translate-x-1/2 z-10 bg-gray-700 rounded shadow-lg p-2 w-48">
                                    <div className="text-white text-xs mb-2">
                                      Deseja remover este passo?
                                    </div>
                                    <div className="flex justify-between gap-1">
                                      <button
                                        className="bg-red-500 hover:bg-red-600 text-white text-xs py-1 px-2 rounded flex-1"
                                        onClick={deleteStep}
                                      >
                                        Sim
                                      </button>
                                      <button
                                        className="bg-gray-600 hover:bg-gray-500 text-white text-xs py-1 px-2 rounded flex-1"
                                        onClick={() =>
                                          setDeleteConfirmStep({
                                            JourneyId: null,
                                            stepIndex: null,
                                          })
                                        }
                                      >
                                        Não
                                      </button>
                                    </div>
                                  </div>
                                )}
                              {/* Seta apontando para proximo passo caso houver */}
                              {stepIndex < journey.steps.length - 1 && (
                                <div
                                  className={`absolute top-1/2 -right-5 transform -translate-y-1/2 z-10 ${currentColor.text}`}
                                >
                                  <CornerUpRight size={27} />
                                </div>
                              )}
                            </div>
                          )
                        })}

                        {/* Botão para adicionar novo passo */}
                        <div className="ml-2">
                          <button
                            className="w-10 h-10 rounded bg-gray-700 hover:bg-gray-600 flex items-center justify-center text-blue-400"
                            onClick={() => addNewStep(journey.id)}
                          >
                            <Plus size={18} />
                          </button>
                        </div>
                      </div>
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
        {/* Botão "Nova Journey" */}
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

        {/* Botão "Gerar com IA" */}
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
        </button>

        {/* Botão de Info centralizado */}
        <Popover>
          <PopoverTrigger asChild>
            <button className="p-2 rounded-lg hover:bg-gray-700 transition-colors">
              <Info
                className="text-gray-400 hover:text-white cursor-pointer"
                size={18}
              />
            </button>
          </PopoverTrigger>
          <PopoverContent className="bg-gray-800 text-white font-semibold text-sm border-0 shadow-lg">
            Esta função utiliza IA para gerar jornadas personalizadas baseadas nas Goals definidas nas Personas.
            <PopoverArrow className="fill-gray-800" />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  )
}

export default Journeys
