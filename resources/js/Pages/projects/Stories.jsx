import React, { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Plus,
  Sparkles,
  X,
  Pencil,
  Info,
  Check,
  LoaderCircle,
  Trash,
  ChevronsUp,
  Minus,
} from "lucide-react"
import { router } from "@inertiajs/react"
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
import axios from "axios"
import { toast } from "sonner"

const StoryItem = ({
  story,
  isEditing,
  editValue,
  onValueChange,
  onEdit,
  onSave,
  onCancel,
  onDelete,
  isTemporary,
  textareaRef,
  typeSelectId,
  onToggleTypeSelect,
  colors,
  onChangeStoryType,
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
      <Card className="dark:!bg-gray-800 bg-gray-300 border-0 transition-all duration-300 ease-in-out">
        <CardContent className="p-2 flex items-center justify-between gap-2">
          <div className="flex flex-col items-start gap-2 flex-1 min-w-0">
            <Popover
              open={typeSelectId === story.id}
              onOpenChange={onToggleTypeSelect}
            >
              <PopoverTrigger>
                <Badge
                  className={`border-transparent dark:text-slate-900 font-bold w-fit cursor-pointer ${
                    story.type === "system" ? "!bg-teal-600" : "!bg-violet-600"
                  }`}
                >
                  {`${story.type === "system" ? "SS" : "US"}${
                    isTemporary ? "" : story.id
                  }`.toUpperCase()}
                </Badge>
              </PopoverTrigger>
              <PopoverContent className="w-auto bg-gray-900 border-gray-700 p-1">
                <div className="flex flex-col gap-1">
                  {colors.map((item, i) => (
                    <Button
                      key={i}
                      variant="ghost"
                      className="h-auto p-2 justify-start hover:bg-gray-700/80"
                      onClick={() => onChangeStoryType(story.id, item.title)}
                    >
                      <Badge
                        className={`border-transparent dark:text-slate-900 font-bold w-full cursor-pointer ${item.color}`}
                      >
                        {`${
                          item.title === "system" ? "ss" : "us"
                        }`.toUpperCase()}
                      </Badge>
                    </Button>
                  ))}
                </div>
              </PopoverContent>
            </Popover>

            {isEditing ? (
              <div className="flex w-full items-center gap-2">
                <TextareaAutosize
                  ref={textareaRef}
                  value={editValue}
                  onChange={onValueChange}
                  onKeyDown={handleKeyDown}
                  className="w-full text-sm border-0 resize-none appearance-none overflow-hidden bg-transparent p-0 m-0 font-normal dark:text-slate-200 focus-visible:outline-none focus-visible:ring-0"
                  autoFocus
                />
              </div>
            ) : (
              <p className="m-0 text-sm dark:text-slate-200 break-words w-full">
                {story.title}
              </p>
            )}
          </div>

          <div className="flex items-center gap-1">
            {isTemporary && (
              <LoaderCircle className="text-indigo-400 animate-spin" />
            )}

            {isEditing ? (
              <>
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
                  onClick={onSave}
                >
                  <Check className="size-4" />
                </Button>
              </>
            ) : (
              <div className="size-7" />
            )}
          </div>
        </CardContent>
      </Card>

      {/* Ações que aparecem no Hover */}
      <AnimatePresence>
        {isHovered && !isEditing && !isTemporary && (
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.2 }}
            className="absolute right-2 top-4 -translate-y-1 flex items-center rounded-md bg-gray-800 border border-gray-700 shadow-lg"
          >
            <Button
              variant="motiondiv"
              size="icon"
              className="text-gray-300 hover:text-white"
              onClick={onEdit}
            >
              <Pencil className="size-4" />
            </Button>
            <Button
              variant="motiondiv"
              size="icon"
              className="text-red-500/80 hover:text-red-500 "
              onClick={onDelete}
            >
              <Trash className="size-4" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

const Stories = ({ project, setProject }) => {
  const colors = [
    { color: "!bg-violet-600", title: "user" },
    { color: "!bg-teal-600", title: "system" },
  ]
  // Estado para controlar qual story está sendo editada
  const [editingId, setEditingId] = useState(null)
  // Estado para armazenar o valor temporário durante a edição
  const [editValue, setEditValue] = useState("")

  const textareaRef = useRef(null)
  // Estado para controlar qual story está com o seletor de tipo aberto
  const [typeSelectId, setTypeSelectId] = useState(null)
  // Estados para IA
  const [aiGeneratedStories, setAiGeneratedStories] = useState([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [showAiModal, setShowAiModal] = useState(false)
  const [isModalMinimized, setIsModalMinimized] = useState(false)

  //
  const isTemporary = (story) =>
    typeof story.id === "string" && story.id.startsWith("temp-")

  // Função para gerar stories via IA
  const generateStories = async () => {
    setIsGenerating(true);
    setIsModalMinimized(false);

    try {
      const response = await axios.post("/api/stories/generate", {
        project_id: project.id,
      });

      const data = response.data;
      
      const storiesWithSelection = data.message.stories.map((story) => ({
        ...story,
        selected: true, // Por padrão, todas vêm selecionadas
      }));

      setAiGeneratedStories(storiesWithSelection);
      setShowAiModal(true);
      toast.success("Histórias geradas com sucesso.");

    } catch (error) {
      console.error("Erro ao gerar stories:", error);
      if (error.response && error.response.data) {
        const errorData = error.response.data;
        
        if (errorData.status === 'warning') {
          toast.warning(errorData.message);
        } else {
          toast.error(errorData.message || 'Ocorreu um erro desconhecido no servidor.');
        }
      } else {
        toast.error('Não foi possível conectar ao servidor. Verifique sua internet.');
      }
    } finally {
      setIsGenerating(false);
    }
  };

  // Função para alternar seleção de uma story
  const toggleStorySelection = (index) => {
    setAiGeneratedStories((prev) =>
      prev.map((story, i) =>
        i === index ? { ...story, selected: !story.selected } : story
      )
    )
  }

  // Função para selecionar/deselecionar todas as stories
  const toggleAllStories = () => {
    const allSelected = aiGeneratedStories.every((story) => story.selected)
    setAiGeneratedStories((prev) =>
      prev.map((story) => ({ ...story, selected: !allSelected }))
    )
  }

  // Função para confirmar e adicionar as stories selecionadas
  const confirmGeneratedStories = () => {
    const selectedStories = aiGeneratedStories.filter(
      (story) => story.selected
    )
    const remainingStories = aiGeneratedStories.filter(
      (story) => !story.selected
    )

    if (selectedStories.length === 0) {
      toast.warning("Selecione pelo menos uma story para adicionar.")
      return
    }

    // Adiciona as novas stories ao estado local para uma UI otimista
    const storiesToAdd = selectedStories.map((story) => ({
      id: `temp-${Date.now()}-${Math.random()}`,
      created_at: new Date().toISOString(),
      project_id: project.id,
      ...story,
    }))

    setProject((prevProject) => ({
      ...prevProject,
      stories: [...(prevProject.stories || []), ...storiesToAdd],
    }))

    // Prepara os dados para o backend, incluindo apenas os campos necessários
    const storiesForBackend = selectedStories.map(({ title, type }) => ({
      title,
      type,
      project_id: project.id,
    }))

    // Persiste no backend
    router.post(
      route("story.bulk-store"),
      { stories: storiesForBackend },
      {
        preserveState: true,
        preserveScroll: true,
        onSuccess: () => {
          toast.success(
            `${selectedStories.length} storie(s) adicionada(s) com sucesso!`
          )
          setAiGeneratedStories(remainingStories)
          if (remainingStories.length === 0) {
            setShowAiModal(false)
            setIsModalMinimized(false)
          }
        },
        onError: (errors) => {
          toast.error("Ocorreu um erro ao salvar as stories.")
          console.error("Erro do backend:", errors)
          // Reverte a UI otimista em caso de erro
          setProject((prevProject) => {
            const storiesToAddIds = storiesToAdd.map((s) => s.id)
            return {
              ...prevProject,
              stories: prevProject.stories.filter(
                (s) => !storiesToAddIds.includes(s.id)
              ),
            }
          })
        },
      }
    )
  }

  // Função para cancelar e limpar as stories geradas
  const cancelGeneratedStories = () => {
    setShowAiModal(false)
    setAiGeneratedStories([])
    setIsModalMinimized(false)
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
    router.delete(route("story.delete", storyId))
  }

  useEffect(() => {
    if (editingId && textareaRef.current) {
      textareaRef.current.focus()
    }
  }, [editingId])

  return (
    <div className="stories rounded grid grid-cols-2 gap-2 w-full p-4 cursor-pointer items-start">
      {/* Modal de confirmação das stories geradas */}
      {showAiModal && (
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
          <div className="bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl">
            {/* Cabeçalho fixo */}
            <div className="flex items-center justify-between p-6 pb-4 flex-shrink-0">
              <h3 className="text-xl font-bold text-white flex items-center">
                {/* <Sparkles
                  className="mr-2 text-yellow-400"
                  size={24}
                /> */}
                {!isModalMinimized && "Stories Geradas por IA"}
                {isModalMinimized && "Stories Geradas"}
              </h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsModalMinimized(!isModalMinimized)}
                  className="text-gray-400 hover:text-white"
                >
                  {isModalMinimized ? (
                    <ChevronsUp size={20} />
                  ) : (
                    <Minus size={20} />
                  )}
                </button>
                <button
                  onClick={cancelGeneratedStories}
                  className="text-gray-400 hover:text-white"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            {!isModalMinimized && (
              <>
                {/* Controle para selecionar/deselecionar todos */}
                <div className="flex items-center justify-between mx-6 mb-4 p-3 bg-gray-700 rounded-lg flex-shrink-0">
                  <span className="text-white font-medium">
                    {aiGeneratedStories.filter((j) => j.selected).length} de{" "}
                    {aiGeneratedStories.length} selecionadas
                  </span>
                  <button
                    onClick={toggleAllStories}
                    className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white text-sm rounded transition-colors"
                  >
                    {aiGeneratedStories.every((story) => story.selected)
                      ? "Desmarcar Todas"
                      : "Selecionar Todas"}
                  </button>
                </div>

                {/* Área rolável das stories */}
                <div className="flex-1 overflow-y-auto px-6 min-h-0">
                  <div className="space-y-2 pb-4">
                    {aiGeneratedStories.map((story, index) => (
                      <div
                        key={index}
                        className={`rounded-lg p-3 border-2 transition-colors flex items-center gap-4 ${
                          story.selected
                            ? "bg-gray-700 border-blue-500"
                            : "bg-gray-600 border-gray-500 hover:border-gray-400"
                        }`}
                      >
                        <label className="flex items-center cursor-pointer flex-1 gap-4">
                          <input
                            type="checkbox"
                            checked={story.selected}
                            onChange={() => toggleStorySelection(index)}
                            className="sr-only" // Esconde o checkbox padrão
                          />
                          <Badge
                            className={`border-none dark:text-slate-900 font-bold ${
                              story.type === "system"
                                ? "!bg-teal-600"
                                : "!bg-violet-600"
                            }`}
                          >
                            {story.type === "system" ? "SS" : "US"}
                          </Badge>
                          <span className="text-sm text-gray-200">
                            {story.title}
                          </span>
                          <div
                            className={`w-5 h-5 rounded-md flex items-center justify-center transition-all duration-200 flex-shrink-0 ${
                              story.selected
                                ? "bg-blue-500 border-blue-400"
                                : "bg-gray-500 border-gray-400"
                            } `}
                          >
                            {story.selected && (
                              <Check className="w-4 h-4 text-white" />
                            )}
                          </div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Botões fixos na parte inferior */}
                <div className="flex justify-end space-x-3 p-6 pt-4 border-t border-gray-700 flex-shrink-0">
                  <button
                    onClick={cancelGeneratedStories}
                    className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={confirmGeneratedStories}
                    className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg transition-colors flex items-center"
                    disabled={
                      aiGeneratedStories.filter((j) => j.selected).length === 0
                    }
                  >
                    <Check
                      className="mr-2"
                      size={16}
                    />
                    Confirmar e Adicionar (
                    {aiGeneratedStories.filter((j) => j.selected).length})
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <div className="flex flex-col gap-2 ">
        <Popover>
          <PopoverTrigger
            asChild
            className=""
          >
            <button className=" flex items-center justify-center gap-2 p-2 rounded-lg text-white bg-gray-800 hover:bg-gray-600 transition-colors">
              <Badge className="!bg-violet-600 border-0">
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
            .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
            .map((story, i) => {
              return (
                // card das user stories
                <StoryItem
                  key={story.id}
                  story={story}
                  isEditing={editingId === story.id}
                  editValue={editValue}
                  onValueChange={handleInputChange}
                  onEdit={() => editStory(story)}
                  onSave={() => editStory(story)}
                  onDelete={() => deleteStory(story.id)}
                  onCancel={() => setEditingId(null)}
                  isTemporary={isTemporary(story)}
                  textareaRef={editingId === story.id ? textareaRef : null}
                  typeSelectId={typeSelectId}
                  onToggleTypeSelect={() => toggleTypeSelect(story.id)}
                  colors={colors}
                  onChangeStoryType={changeStoryType}
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
              <Badge className="!bg-teal-600 border-0">
                {
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
            .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
            .map((story, i) => {
              return (
                <StoryItem
                  key={story.id}
                  story={story}
                  isEditing={editingId === story.id}
                  editValue={editValue}
                  onValueChange={handleInputChange}
                  onEdit={() => editStory(story)}
                  onSave={() => editStory(story)}
                  onDelete={() => deleteStory(story)}
                  onCancel={() => setEditingId(null)}
                  isTemporary={isTemporary(story)}
                  textareaRef={editingId === story.id ? textareaRef : null}
                  typeSelectId={typeSelectId}
                  onToggleTypeSelect={() => toggleTypeSelect(story.id)}
                  colors={colors}
                  onChangeStoryType={changeStoryType}
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
          onClick={generateStories}
          disabled={isGenerating}
          className={`flex items-center justify-center flex-1 py-2 rounded-lg transition-colors shadow-md ${
            isGenerating
              ? "bg-gray-600 cursor-not-allowed text-gray-400"
              : "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
          }`}
        >
          {isGenerating ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-400 border-t-transparent mr-2"></div>
              Gerando...
            </>
          ) : (
            <>
              <Sparkles
                size={18}
                className="mr-2"
              />
              <span>Gerar com IA</span>
            </>
          )}
          {/* Botão de Info centralizado */}
          <Popover>
            <PopoverTrigger asChild>
              <Info
                onClick={(e) => e.stopPropagation()}
                className="text-gray-400 mx-2 cursor-pointer"
                size={15}
              />
            </PopoverTrigger>
            <PopoverContent className="bg-gray-800 text-white ">
              Esta função utiliza IA para gerar Users Stories baseadas nos
              Objetivos das Personas e Journeys do Produto e gerar System
              Stories baseadas nas Restrições do Produto e Goals do tipo
              Constraint(CG).
              <PopoverArrow className="fill-gray-800" />
            </PopoverContent>
          </Popover>
        </button>
      </div>
    </div>
  )
}

export default Stories