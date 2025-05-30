import React, { useEffect, useState, useRef } from "react"
import {
  Plus,
  ChevronDown,
  ChevronRight,
  Map,
  ArrowRight,
  CornerUpRight,
} from "lucide-react"
import { ModalConfirmation } from "@/Components/Modals"
import TextArea from "@/Components/TextArea"
import { router } from "@inertiajs/react"
const Journeys = ({ project, setProject }) => {
  // Estado para controlar qual journey está expandida
  const [expandedJourney, setExpandedJourney] = useState(0)
  // Estado para controlar qual step está sendo editado
  const [editingStep, setEditingStep] = useState({
    JourneyId: null,
    stepIndex: null,
  })
  // Estado para armazenar o valor temporário durante a edição
  const [editValue, setEditValue] = useState("")
  // Estado para controlar qual step está com o diálogo de confirmação de exclusão aberto
  const [deleteConfirmStep, setDeleteConfirmStep] = useState({
    JourneyId: null,
    stepIndex: null,
  })
  // Estado para controlar qual journey está sendo editada
  const [editingJourney, setEditingJourney] = useState(null)
  // Estado para o nome da journey em edição
  const [editJourneyName, setEditJourneyTitle] = useState("")
  // Estado para confirmação de exclusão de journey
  const [deleteConfirmJourney, setDeleteConfirmJourney] = useState(null)
  //Cores usadas nos steps
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

  // Função para expandir/recolher uma journey
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
  const saveEditStep = () => {
    const { JourneyId, stepIndex } = editingStep

    if (!JourneyId || stepIndex === null) return

    // Encontra a jornada específica
    const journey = project.journeys.find((j) => j.id === JourneyId)

    // Cria uma nova versão dos steps com a edição aplicada
    const updatedSteps = journey.steps.map((s, i) =>
      i === stepIndex ? { ...s, description: editValue } : s
    )

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

      {/* Botão "Nova Journey" */}
      <button
        className="flex items-center justify-center py-2 bg-gray-800 hover:bg-gray-700 text-blue-400 rounded-lg transition-colors shadow-md"
        onClick={addNewJourney}
      >
        <Plus
          size={18}
          className="mr-2"
        />
        <span>Nova Journey</span>
      </button>
    </div>
  )
}

export default Journeys
