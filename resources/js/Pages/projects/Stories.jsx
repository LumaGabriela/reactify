import React, { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion" // Importando framer-motion
import {
  Plus,
  Sparkles,
  FileText,
  X,
  Pencil,
  Info,
  Check,
  LoaderCircle,
  Trash,
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
                  className="w-full border-0 resize-none appearance-none overflow-hidden bg-transparent p-0 m-0 font-semibold dark:text-slate-200 focus-visible:outline-none focus-visible:ring-0"
                  autoFocus
                />
              </div>
            ) : (
              <p className="m-0 font-semibold dark:text-slate-200 break-words w-full">
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
              variant="ghost"
              size="icon"
              className="size-8 text-gray-300 hover:text-white hover:bg-gray-500/40"
              onClick={onEdit}
            >
              <Pencil className="size-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="size-8 text-red-500/80 hover:text-red-500 hover:bg-gray-500/40"
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

  //
  const isTemporary = (story) =>
    typeof story.id === "string" && story.id.startsWith("temp-")
  
  // Função para gerar stories via IA - simplificada
  const generateStories = async () => {
    if (aiGeneratedStories.length > 0) {
      discardAllStories()
    }

    setIsGenerating(true)

    try {
      const response = await axios.post("/api/stories/generate", {
        project_id: project.id,
      })

      console.log("Resposta completa:", response.data)

      // Atualiza o estado com as stories geradas
      setAiGeneratedStories(response.data.message.stories)
    } catch (error) {
      console.error("Erro ao gerar stories:", error)
      console.error("Detalhes do erro:", error.response?.data)
    } finally {
      setIsGenerating(false)
    }
  }

  const discardAllStories = () => {
    setAiGeneratedStories([])
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
    console.log(aiGeneratedStories)
  }, [aiGeneratedStories])

  useEffect(() => {
    if (editingId && textareaRef.current) {
      textareaRef.current.focus()
    }
  }, [editingId])

  return (
    <div className="stories rounded grid grid-cols-2 gap-2 w-full p-4 cursor-pointer items-start">
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
              Esta função utiliza IA para gerar Users Stories baseadas nas
              Persona's Goals e System Stories baseadas nas Restrições do
              produto e Constraint Goals.
              <PopoverArrow className="fill-gray-800" />
            </PopoverContent>
          </Popover>
        </button>
      </div>

      {/* Listagem de Stories Geradas pela IA */}
      {aiGeneratedStories.length > 0 && (
        <div className="col-span-2 space-y-2 mt-4">
          <div className="flex justify-between items-center">
            <h5 className="text-white">Stories Geradas</h5>
            <div className="flex gap-2">
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