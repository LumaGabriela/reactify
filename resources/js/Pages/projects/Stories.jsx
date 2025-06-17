import React, { useState, useEffect } from "react"
import { Plus, Sparkles, FileText, X, Info } from "lucide-react"
import { StoryCard } from "@/Components/Card"
import { router } from "@inertiajs/react"
import { Badge } from "@/components/ui/badge"
import {
  Popover,
  PopoverArrow,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import axios from "axios"

const Stories = ({ project, setProject }) => {
  // Estado para controlar qual story está sendo editada
  const [editingId, setEditingId] = useState(null)
  // Estado para armazenar o valor temporário durante a edição
  const [editValue, setEditValue] = useState("")
  // Estado para controlar qual story está com o seletor de tipo aberto
  const [typeSelectId, setTypeSelectId] = useState(null)
  // Estado para controlar qual story está com o diálogo de confirmação de exclusão aberto
  const [deleteConfirmId, setDeleteConfirmId] = useState(null)
  // Estados para IA
  const [aiInput, setAiInput] = useState("")
  const [aiGeneratedStories, setAiGeneratedStories] = useState([])
  const [showAiInput, setShowAiInput] = useState(false)
  const [showAlert, setShowAlert] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  // Estados para visualização da entrevista
  const [showInterview, setShowInterview] = useState(false)
  const [savedInterview, setSavedInterview] = useState("")

  // Função para gerar stories via IA
  const generateStories = async () => {
    if (!showAiInput) {
      setShowAiInput(true)
      return
    }

    if (!aiInput.trim()) {
      setShowAlert(true)
      setTimeout(() => setShowAlert(false), 3000) // Remove após 3 segundos
      return
    }
    if (aiGeneratedStories != null) {
      discardAllStories()
    }

    setIsGenerating(true)

    try {
      const response = await axios.post("/api/stories/generate", {
        message: aiInput,
      })

      console.log("Resposta completa:", response.data)

      // Atualiza o estado com as stories geradas
      setAiGeneratedStories(response.data.message.stories)
      // Salva a entrevista para visualização posterior
      setSavedInterview(aiInput)
      setShowAiInput(false)
      setAiInput("")
    } catch (error) {
      console.error("Erro ao gerar stories:", error)
      console.error("Detalhes do erro:", error.response?.data)
    } finally {
      setIsGenerating(false)
    }
  }

  const discardAllStories = () => {
    setAiGeneratedStories([])
    // Opcionalmente, também pode limpar a entrevista salva
    // setSavedInterview('');
  }

  // Função para adicionar uma story da IA ao projeto
  const addAiStory = () => {
    const selectedStories = aiGeneratedStories
      .filter((story) => story.selected === true)
      .map((story) => {
        const { selected, ...rest } = story
        return {
          id: Date.now() + Math.random(),
          created_at: new Date().toISOString(),
          project_id: project.id,
          ...rest,
        }
      })

    setProject({
      ...project,
      stories: [...project.stories, ...selectedStories],
    })

    const storiesWithoutId = selectedStories.map(
      ({ id, created_at, ...rest }) => rest
    )

    router.post(
      route("story.bulk-store"),
      { stories: storiesWithoutId },
      {
        preserveState: true,
        preserveScroll: true,
      }
    )
  }

  // Função para lidar com mudanças no input
  const handleInputChange = (e) => {
    setEditValue(e.target.value)
  }

  // Função para alternar a exibição do seletor de tipo
  const toggleTypeSelect = (storyId) => {
    if (typeSelectId === storyId) {
      setTypeSelectId(null)
    } else {
      setTypeSelectId(storyId)
      setDeleteConfirmId(null) // Fecha o diálogo de exclusão caso esteja aberto
    }
  }

  // Função para alternar a exibição do diálogo de confirmação de exclusão
  const toggleDeleteConfirm = (storyId) => {
    if (deleteConfirmId === storyId) {
      setDeleteConfirmId(null)
    } else {
      setDeleteConfirmId(storyId)
      setTypeSelectId(null) // Fecha o seletor de tipo caso esteja aberto
      setEditingId(null) // Fecha a edição caso esteja aberta
    }
  }
  // Função para adicionar uma nova story
  const addNewStory = () => {
    setProject({
      ...project,
      stories: [
        ...project.stories,
        {
          id: `temp-${Date.now()}`,
          title: "Nova Story",
          type: "user",
        },
      ],
    })

    router.post(
      route("story.store"),
      {
        title: "Nova Story",
        type: "user",
        project_id: project.id, // ID do projeto atual
      },
      { preserveState: true, preserveScroll: true }
    )
  }

  // Função para alternar entre modo de edição e visualização
  const editStory = (story) => {
    if (editingId === story.id) {
      // Se já estiver editando esta story, salve as alterações
      if (story.title !== editValue) {
        const updatedStories = project.stories.map((s) =>
          s.id === story.id
            ? {
                ...s,
                title: editValue,
                updated_at: new Date().toISOString(),
              }
            : s
        )

        setProject({ ...project, stories: updatedStories })

        router.patch(route("story.update", story.id), {
          title: editValue,
        })
      }
      setEditingId(null)
    } else {
      // Entra no modo de edição para esta story
      setEditingId(story.id)
      setEditValue(story.title) // Inicializa o campo com o valor atual
    }
  }

  // Função para alterar o tipo da story
  const changeStoryType = (storyId, newType) => {
    const story = project.stories.find((s) => s.id === storyId)

    if (story.type !== newType) {
      const updatedStories = project.stories.map((s) =>
        s.id === storyId
          ? {
              ...s,
              type: newType,
              updated_at: new Date().toISOString(),
            }
          : s
      )

      setProject({ ...project, stories: updatedStories })

      router.patch(route("story.update", storyId), {
        type: newType,
      })
    }

    setTypeSelectId(null) // Fecha o seletor de tipo
  }

  // Função para excluir a story
  const deleteStory = (storyId) => {
    const updatedStories = project?.stories.filter((s) => s.id !== storyId)
    setProject({ ...project, stories: updatedStories })
    setDeleteConfirmId(null) // Fecha o diálogo de confirmação
    router.delete(route("story.delete", storyId))
  }

  useEffect(() => {
    console.log(aiGeneratedStories)
  }, [aiGeneratedStories])

  return (
    <div className="stories rounded grid grid-cols-2 gap-2 w-full p-4 cursor-pointer items-start">
      <div className="flex flex-col gap-2 ">
        <Popover>
          <PopoverTrigger
            asChild
            className=""
          >
            <button className=" flex items-center justify-center gap-2 p-2 rounded-lg text-white bg-gray-800 hover:bg-gray-600 transition-colors">
              <Badge className="bg-violet-600 border-0">
                {
                  project?.stories?.filter((story) => story.type === "user")
                    .length
                }
              </Badge>{" "}
              User Stories
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
        {/* User stories */}
        {project?.stories?.length > 0 ? (
          project?.stories
            .filter((story) => story.type === "user")
            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
            .map((story, i) => {
              return (
                <StoryCard
                  key={story.id}
                  story={story}
                  toggleTypeSelect={toggleTypeSelect}
                  changeStoryType={changeStoryType}
                  setTypeSelectId={setTypeSelectId}
                  typeSelectId={typeSelectId}
                  editingId={editingId}
                  editValue={editValue}
                  handleInputChange={handleInputChange}
                  editStory={editStory}
                  deleteConfirmId={deleteConfirmId}
                  toggleDeleteConfirm={toggleDeleteConfirm}
                  deleteStory={deleteStory}
                  setDeleteConfirmId={setDeleteConfirmId}
                />
              )
            })
        ) : (
          // Exibir um card de exemplo quando não houver stories
          <div className="bg-gray-800 rounded-lg p-4 shadow-md">
            <div className="flex items-center mb-2">
              <div className="bg-blue-600 text-white text-xs font-medium py-1 px-3 rounded-full">
                Em andamento
              </div>
            </div>
            <div className="text-white text-base font-medium mb-4">
              criar get da tela de edição update e delete dos psr
            </div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center text-white">
                E
              </div>
              <span className="ml-2 text-gray-300 text-sm">
                Eduardo Rodrigues
              </span>
            </div>
          </div>
        )}
      </div>
      {/* System stories */}
      <div className="flex flex-col gap-2 ">
        <Popover>
          <PopoverTrigger
            asChild
            className=""
          >
            <button className=" flex items-center justify-center gap-2 p-2 rounded-lg text-white bg-gray-800 hover:bg-gray-600 transition-colors">
             <Badge className="bg-teal-600 border-0">{
                project?.stories?.filter((story) => story.type === "system")
                  .length
              }
              </Badge>{" "}
              System Stories
              <Info
                className="text-gray-400"
                size={18}
              />
            </button>
          </PopoverTrigger>
          <PopoverContent className="bg-gray-800 text-white ">
            As histórias de sistema abordam funcionalidades administrativas e
            técnicas, como o gerenciamento de usuários para controle de acesso e
            outras tarefas que garantem o funcionamento e a manutenção do
            sistema.
            <PopoverArrow className="fill-gray-800" />
          </PopoverContent>
        </Popover>
        {project?.stories?.length > 0 &&
          project?.stories
            .filter((story) => story.type === "system")
            .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
            .map((story, i) => {
              return (
                <StoryCard
                  key={story.id}
                  story={story}
                  toggleTypeSelect={toggleTypeSelect}
                  changeStoryType={changeStoryType}
                  setTypeSelectId={setTypeSelectId}
                  typeSelectId={typeSelectId}
                  editingId={editingId}
                  editValue={editValue}
                  handleInputChange={handleInputChange}
                  editStory={editStory}
                  deleteConfirmId={deleteConfirmId}
                  toggleDeleteConfirm={toggleDeleteConfirm}
                  deleteStory={deleteStory}
                  setDeleteConfirmId={setDeleteConfirmId}
                />
              )
            })}
      </div>

      {/* Botões "Nova story" e "Gerar com IA" */}
      <div className="col-span-2 flex gap-2">
        <button
          className="flex items-center justify-center flex-1 py-1 bg-gray-800 hover:bg-gray-700 text-blue-400 rounded-lg transition-colors rounded shadow-md"
          onClick={addNewStory}
        >
          <Plus
            size={18}
            className="mr-2"
          />
          <span>Nova story</span>
        </button>

        <button
          onClick={() => {
            if (showAiInput) {
              setShowAiInput(false)
              setAiInput("")
            } else {
              generateStories()
            }
          }}
          className="flex items-center justify-center flex-1 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg transition-colors shadow-md"
        >
          <Sparkles
            size={18}
            className="mr-2"
          />
          <span>{showAiInput ? "Cancelar" : "Gerar com IA"}</span>
        </button>
      </div>

      {/* Seção de Input para IA - aparece apenas quando showAiInput for true */}
      {showAiInput && (
        <div className="col-span-2 space-y-2 mt-4">
          <textarea
            placeholder="Descreva o contexto para a IA gerar stories..."
            className="w-full bg-gray-800 rounded-lg p-2 text-white"
            value={aiInput}
            onChange={(e) => setAiInput(e.target.value)}
          />
          {showAlert && (
            <p className="text-red-400 text-sm">
              Por favor, insira a entrevista para gerar as stories.
            </p>
          )}
          <div className="flex gap-2">
            <button
              onClick={generateStories}
              disabled={isGenerating}
              className={`px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700  transition-colors flex items-center ${
                isGenerating
                  ? "bg-purple-400 cursor-not-allowed"
                  : "bg-purple-600 hover:bg-purple-700"
              } text-white`}
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                  Gerando...
                </>
              ) : (
                "Gerar Stories"
              )}
            </button>
            <button
              onClick={() => {
                setShowAiInput(false)
                setAiInput("")
              }}
              className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Listagem de Stories Geradas pela IA */}
      {aiGeneratedStories.length > 0 && (
        <div className="col-span-2 space-y-2 mt-4">
          <div className="flex justify-between items-center">
            <h5 className="text-white">Stories Geradas</h5>
            <div className="flex gap-2">
              {/* Botão para ver a entrevista - versão compacta */}
              {savedInterview && (
                <button
                  onClick={() => setShowInterview(!showInterview)}
                  className="bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white px-2 py-1 rounded transition-colors text-xs flex items-center gap-1"
                >
                  <FileText size={12} />
                  {showInterview ? "Ocultar" : "Entrevista"}
                </button>
              )}
              <button
                onClick={discardAllStories}
                className="flex items-center justify-center flex-1 p-2 bg-gradient-to-r from-rose-400 to-rose-700 hover:from-purple-700 hover:to-blue-700 text-white text-nowrap rounded-lg transition-colors duration-300 shadow-md"
              >
                Descartar Todas
              </button>
              <button
                onClick={addAiStory}
                className="flex items-center justify-center flex-1 p-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white text-nowrap rounded-lg transition-colors duration-300 shadow-md"
              >
                Adicionar Selecionadas
              </button>
            </div>
          </div>

          {/* Painel colapsável da entrevista */}
          {showInterview && savedInterview && (
            <div className="bg-gray-900 rounded-lg border border-gray-700 overflow-hidden">
              <div className="bg-gray-800 px-3 py-2 border-b border-gray-700">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300 text-sm font-medium">
                    Entrevista Original
                  </span>
                  <button
                    onClick={() => setShowInterview(false)}
                    className="text-gray-400 hover:text-gray-200 transition-colors"
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>
              <div className="max-h-40 overflow-y-auto p-3">
                <pre className="text-gray-400 text-xs whitespace-pre-wrap leading-relaxed">
                  {savedInterview}
                </pre>
              </div>
            </div>
          )}

          {aiGeneratedStories.map((story, index) => (
            <div
              key={index}
              className="bg-gray-800 p-2 rounded flex justify-between items-center gap-1"
            >
              <div
                className={`${
                  story.type === "user" ? "bg-violet-600" : "bg-teal-600"
                } text-white text-xs font-medium py-0.5 px-2 rounded-full whitespace-nowrap`}
              >
                {story.type}
              </div>
              <span className="text-white text-xs px-2 flex-1 min-w-0 break-words">
                {story.title}
              </span>
              <label className="p-2 cursor-pointer">
                <input
                  defaultChecked={false}
                  type="checkbox"
                  className="hidden"
                  onChange={(e) =>
                    setAiGeneratedStories((prev) => {
                      const updatedStories = [...prev]
                      updatedStories[index].selected = e.target.checked
                      return updatedStories
                    })
                  }
                />
                <div
                  className={`w-6 h-6 rounded-md flex items-center justify-center transition-all duration-300 ease-in-out ${
                    aiGeneratedStories[index]?.selected
                      ? "bg-gradient-to-r from-purple-500 to-blue-500"
                      : "bg-gray-600"
                  } border-2 ${
                    aiGeneratedStories[index]?.selected
                      ? "border-purple-400"
                      : "border-gray-500"
                  }`}
                >
                  {aiGeneratedStories[index]?.selected && (
                    <svg
                      className="w-4 h-4 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="3"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </div>
              </label>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Stories
