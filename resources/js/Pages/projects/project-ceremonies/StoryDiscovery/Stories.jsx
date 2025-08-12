import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import MotionDivOptions from '@/Components/MotionDivOptions'
import {
  Plus,
  Sparkles,
  X,
  Info,
  Check,
  LoaderCircle,
  Trash,
  ChevronsUp,
  Minus,
} from 'lucide-react'
import { router } from '@inertiajs/react'
import TextareaAutosize from 'react-textarea-autosize'
import axios from 'axios'
import { toast } from 'sonner'
import InfoButton from '@/Components/InfoButton'
import { tooltipInfo } from '@/lib/projectData'
import GenerateIAButton from '@/Components/GenerateIAButton'
export const storyVariants = {
  user: { bg: 'bg-purple-600', title: 'user' },
  system: { bg: 'bg-orange-600', title: 'system' },
}

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
  onChangeStoryType,
}) => {
  const [isHovered, setIsHovered] = useState(false)

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      onSave()
    }
  }

  const selectedVariant = storyVariants[story.type] || storyVariants.user

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative group"
    >
      <Card className="bg-card border-0 transition-all duration-300 ease-in-out">
        <CardContent className="p-2 flex items-center justify-between gap-2">
          <div className="flex flex-col items-start justify-between gap-2 flex-1 min-w-0">
            <Popover
              open={typeSelectId === story.id}
              onOpenChange={onToggleTypeSelect}
            >
              <PopoverTrigger className="flex">
                <Badge
                  variant="outline"
                  className={`border-transparent text-primary-foreground font-bold w-fit cursor-pointer ${selectedVariant.bg}`}
                >
                  {`${story.type === 'system' ? 'SS' : 'US'}${isTemporary ? '' : story.id}`.toUpperCase()}
                </Badge>
              </PopoverTrigger>
              <PopoverContent className="w-auto bg-popover border-border p-1">
                <div className="flex flex-col gap-1">
                  {Object.values(storyVariants).map((variant, i) => (
                    <Button
                      key={i}
                      variant="ghost"
                      className="h-auto p-2 justify-start "
                      onClick={() => onChangeStoryType(story.id, variant.title)}
                    >
                      <Badge
                        variant="outline"
                        className={`border-transparent text-primary-foreground font-bold w-full cursor-pointer ${variant.bg}`}
                      >
                        {`${variant.title === 'system' ? 'ss' : 'us'}`.toUpperCase()}
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
                  className="w-full text-sm border-0 resize-none appearance-none overflow-hidden bg-transparent p-0 m-0 font-normal text-foreground focus-visible:outline-none focus-visible:ring-0"
                  autoFocus
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-7 text-destructive/80 hover:bg-destructive/10"
                  onClick={onCancel}
                >
                  <X className="size-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-7 text-green-500 hover:bg-green-500/10"
                  onClick={onSave}
                >
                  <Check className="size-4" />
                </Button>
              </div>
            ) : (
              <p className="m-0 text-sm text-foreground break-words w-full">
                {story.title}
              </p>
            )}
          </div>

          <div className="flex items-center gap-1">
            {isTemporary && (
              <LoaderCircle className="text-primary animate-spin" />
            )}
          </div>
          <MotionDivOptions
            isHovered={isHovered}
            isEditing={isEditing}
            isTemporary={isTemporary}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        </CardContent>
      </Card>
    </div>
  )
}

const Stories = ({ project, setProject }) => {
  const [editingId, setEditingId] = useState(null)
  const [editValue, setEditValue] = useState('')
  const textareaRef = useRef(null)
  const [typeSelectId, setTypeSelectId] = useState(null)
  const [aiGeneratedStories, setAiGeneratedStories] = useState([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [showAiModal, setShowAiModal] = useState(false)
  const [isModalMinimized, setIsModalMinimized] = useState(false)

  const isTemporary = (story) =>
    typeof story.id === 'string' && story.id.startsWith('temp-')

  const generateStories = async () => {
    setIsGenerating(true)
    setIsModalMinimized(false)

    try {
      const response = await axios.post('/api/stories/generate', {
        project_id: project.id,
      })

      const data = response.data

      const storiesWithSelection = data.message.stories.map((story) => ({
        ...story,
        selected: true,
      }))

      setAiGeneratedStories(storiesWithSelection)
      setShowAiModal(true)
      toast.success('Histórias geradas com sucesso.')
    } catch (error) {
      console.error('Erro ao gerar stories:', error)
      if (error.response && error.response.data) {
        const errorData = error.response.data

        if (errorData.status === 'warning') {
          toast.warning(errorData.message)
        } else {
          toast.error(
            errorData.message || 'Ocorreu um erro desconhecido no servidor.',
          )
        }
      } else {
        toast.error(
          'Não foi possível conectar ao servidor. Verifique sua internet.',
        )
      }
    } finally {
      setIsGenerating(false)
    }
  }

  const toggleStorySelection = (index) => {
    setAiGeneratedStories((prev) =>
      prev.map((story, i) =>
        i === index ? { ...story, selected: !story.selected } : story,
      ),
    )
  }

  const toggleAllStories = () => {
    const allSelected = aiGeneratedStories.every((story) => story.selected)
    setAiGeneratedStories((prev) =>
      prev.map((story) => ({ ...story, selected: !allSelected })),
    )
  }

  const confirmGeneratedStories = () => {
    const selectedStories = aiGeneratedStories.filter((story) => story.selected)
    const remainingStories = aiGeneratedStories.filter(
      (story) => !story.selected,
    )

    if (selectedStories.length === 0) {
      toast.warning('Selecione pelo menos uma story para adicionar.')
      return
    }

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

    const storiesForBackend = selectedStories.map(({ title, type }) => ({
      title,
      type,
      project_id: project.id,
    }))

    router.post(
      route('story.bulk-store'),
      { stories: storiesForBackend },
      {
        preserveState: true,
        preserveScroll: true,
        onSuccess: () => {
          toast.success(
            `${selectedStories.length} storie(s) adicionada(s) com sucesso!`,
          )
          setAiGeneratedStories(remainingStories)
          if (remainingStories.length === 0) {
            setShowAiModal(false)
            setIsModalMinimized(false)
          }
        },
        onError: (errors) => {
          toast.error('Ocorreu um erro ao salvar as stories.')
          console.error('Erro do backend:', errors)
          setProject((prevProject) => {
            const storiesToAddIds = storiesToAdd.map((s) => s.id)
            return {
              ...prevProject,
              stories: prevProject.stories.filter(
                (s) => !storiesToAddIds.includes(s.id),
              ),
            }
          })
        },
      },
    )
  }

  const cancelGeneratedStories = () => {
    setShowAiModal(false)
    setAiGeneratedStories([])
    setIsModalMinimized(false)
  }

  const handleInputChange = (e) => {
    setEditValue(e.target.value)
  }

  const toggleTypeSelect = (storyId) => {
    if (typeSelectId === storyId) {
      setTypeSelectId(null)
    } else {
      setTypeSelectId(storyId)
    }
  }

  const addNewStory = () => {
    setProject({
      ...project,
      stories: [
        ...project.stories,
        {
          id: `temp-${Date.now()}`,
          title: 'Nova Story',
          type: 'user',
        },
      ],
    })

    router.post(
      route('story.store'),
      {
        title: 'Nova Story',
        type: 'user',
        project_id: project.id,
      },
      { preserveState: true, preserveScroll: true },
    )
  }

  const editStory = (story) => {
    if (editingId === story.id) {
      if (story.title !== editValue) {
        const updatedStories = project.stories.map((s) =>
          s.id === story.id
            ? {
                ...s,
                title: editValue,
                updated_at: new Date().toISOString(),
              }
            : s,
        )

        setProject({ ...project, stories: updatedStories })

        router.patch(route('story.update', story.id), {
          title: editValue,
        })
      }
      setEditingId(null)
    } else {
      setEditingId(story.id)
      setEditValue(story.title)
    }
  }

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
          : s,
      )

      setProject({ ...project, stories: updatedStories })

      router.patch(route('story.update', storyId), {
        type: newType,
      })
    }

    setTypeSelectId(null)
  }

  const deleteStory = (storyId) => {
    const updatedStories = project?.stories.filter((s) => s.id !== storyId)
    setProject({ ...project, stories: updatedStories })
    router.delete(route('story.delete', storyId))
  }

  useEffect(() => {
    if (editingId && textareaRef.current) {
      textareaRef.current.focus()
    }
  }, [editingId])

  return (
    <div className="stories rounded grid grid-cols-2 gap-2 w-full p-4 cursor-pointer items-start">
      <div className="col-span-2">
        <Button
          variant="link"
          onClick={() =>
            router.get(
              route('project.show', { project: project.id, page: 'backlog' }),
            )
          }
        >
          Go to Product Backlog
        </Button>
      </div>
      {showAiModal && (
        <div
          className={`
            transition-all duration-300 z-50
            ${
              isModalMinimized
                ? 'fixed bottom-4 right-4 w-[400px]'
                : 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center'
            }
          `}
        >
          <div className="bg-card rounded-lg max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl">
            <div className="flex items-center justify-between p-6 pb-4 flex-shrink-0">
              <h3 className="text-xl font-bold text-foreground flex items-center">
                {!isModalMinimized && 'Stories Geradas por IA'}
                {isModalMinimized && 'Stories Geradas'}
              </h3>
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => setIsModalMinimized(!isModalMinimized)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  {isModalMinimized ? (
                    <ChevronsUp size={20} />
                  ) : (
                    <Minus size={20} />
                  )}
                </Button>
                <Button
                  onClick={cancelGeneratedStories}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X size={24} />
                </Button>
              </div>
            </div>

            {!isModalMinimized && (
              <>
                <div className="flex items-center justify-between mx-6 mb-4 p-3 bg-muted rounded-lg flex-shrink-0">
                  <span className="text-foreground font-medium">
                    {aiGeneratedStories.filter((j) => j.selected).length} de{' '}
                    {aiGeneratedStories.length} selecionadas
                  </span>
                  <Button
                    onClick={toggleAllStories}
                    className="px-3 py-1 bg-primary hover:bg-primary/90 text-primary-foreground text-sm rounded transition-colors"
                  >
                    {aiGeneratedStories.every((story) => story.selected)
                      ? 'Desmarcar Todas'
                      : 'Selecionar Todas'}
                  </Button>
                </div>

                <div className="flex-1 overflow-y-auto px-6 min-h-0">
                  <div className="space-y-2 pb-4">
                    {aiGeneratedStories.map((story, index) => (
                      <div
                        key={index}
                        className={`rounded-lg p-3 border-2 transition-colors flex items-center gap-4 ${
                          story.selected
                            ? 'bg-muted border-primary'
                            : 'bg-muted/50 border-border hover:border-muted-foreground'
                        }`}
                      >
                        <label className="flex items-center cursor-pointer flex-1 gap-4">
                          <input
                            type="checkbox"
                            checked={story.selected}
                            onChange={() => toggleStorySelection(index)}
                            className="sr-only"
                          />
                          <Badge
                            className={`border-none text-primary-foreground font-bold ${
                              story.type === 'system'
                                ? 'bg-secondary'
                                : 'bg-primary'
                            }`}
                          >
                            {story.type === 'system' ? 'SS' : 'US'}
                          </Badge>
                          <span className="text-sm text-foreground">
                            {story.title}
                          </span>
                          <div
                            className={`w-5 h-5 rounded-md flex items-center justify-center transition-all duration-200 flex-shrink-0 ${
                              story.selected
                                ? 'bg-primary border-primary/80'
                                : 'bg-muted-foreground border-border'
                            } `}
                          >
                            {story.selected && (
                              <Check className="w-4 h-4 text-primary-foreground" />
                            )}
                          </div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end space-x-3 p-6 pt-4 border-t border-border flex-shrink-0">
                  <Button
                    onClick={cancelGeneratedStories}
                    className="px-4 py-2 bg-muted hover:bg-muted/80 text-foreground rounded-lg transition-colors"
                  >
                    Cancelar
                  </Button>
                  <Button
                    onClick={confirmGeneratedStories}
                    className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg transition-colors flex items-center"
                    disabled={
                      aiGeneratedStories.filter((j) => j.selected).length === 0
                    }
                  >
                    <Check className="mr-2" size={16} />
                    Confirmar e Adicionar (
                    {aiGeneratedStories.filter((j) => j.selected).length})
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <div className="flex flex-col gap-2 ">
        <InfoButton
          data={tooltipInfo.userStory}
          badgeContent={
            project?.stories?.filter((story) => story.type === 'user').length ||
            0
          }
        />

        {project?.stories?.length > 0 ? (
          project?.stories
            .filter((story) => story.type === 'user')
            .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
            .map((story, i) => {
              return (
                <StoryItem
                  key={story.id}
                  story={story}
                  isEditing={editingId === story.id}
                  editValue={editValue}
                  onValue-change={handleInputChange}
                  onEdit={() => editStory(story)}
                  onSave={() => editStory(story)}
                  onDelete={() => deleteStory(story.id)}
                  onCancel={() => setEditingId(null)}
                  isTemporary={isTemporary(story)}
                  textareaRef={editingId === story.id ? textareaRef : null}
                  typeSelectId={typeSelectId}
                  onToggleTypeSelect={() => toggleTypeSelect(story.id)}
                  onChangeStoryType={changeStoryType}
                />
              )
            })
        ) : (
          <div className="bg-card rounded-lg p-4 shadow-md">
            <div className="flex items-center mb-2">
              <div className="bg-primary text-primary-foreground text-xs font-medium py-1 px-3 rounded-full">
                Em andamento
              </div>
            </div>
            <div className="text-foreground text-base font-medium mb-4">
              criar get da tela de edição update e delete dos psr
            </div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center text-foreground">
                E
              </div>
              <span className="ml-2 text-muted-foreground text-sm">
                Eduardo Rodrigues
              </span>
            </div>
          </div>
        )}
      </div>
      <div className="flex flex-col gap-2 ">
        <InfoButton
          data={tooltipInfo.systemStory}
          badgeContent={
            project?.stories?.filter((story) => story.type === 'system')
              .length || 0
          }
        />
        {project?.stories?.length > 0 &&
          project?.stories
            .filter((story) => story.type === 'system')
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
                  onChangeStoryType={changeStoryType}
                />
              )
            })}
      </div>

      <div className="w-full col-span-2 flex gap-2">
        <Button
          className="flex items-center justify-center w-1/2 py-1 bg-card hover:bg-muted text-primary rounded-lg transition-colors shadow-md"
          onClick={addNewStory}
        >
          <Plus size={18} className="mr-2" />
          <span>Nova story</span>
        </Button>

        <GenerateIAButton
          isGenerating={isGenerating}
          onClick={generateStories}
          tooltipTitle={tooltipInfo.aiGeneratedStory.title}
          tooltipDesctiption={tooltipInfo.aiGeneratedStory.description}
          className="w-1/2"
        />
      </div>
    </div>
  )
}

export default Stories
