import {
  ArrowDownRight,
  ArrowRight,
  CornerDownRight,
  Plus,
  X,
  Check,
} from 'lucide-react'
import MotionDivOptions from '@/Components/MotionDivOptions'
import { storyVariants } from '../StoryDiscovery/Stories'
import React from 'react'
import { router } from '@inertiajs/react'
import { isTemporary } from '@/lib/utils'
import InfoButton from '@/Components/InfoButton'
import { tooltipInfo } from '@/lib/projectData'
/**
 * Componente para renderizar um único card de estória.
 * Gerencia seu próprio estado de hover para exibir o botão de adicionar.
 * @param {{ story: object, addEpicStory: () => void }} props
 */
const StoryCard = ({ story, addEpicStory }) => {
  const selectedVariant = storyVariants[story.type] || storyVariants.user

  return (
    <div className="relative group">
      <MotionDivOptions isHovered={true} onAdd={addEpicStory} />

      {/* Este é o corpo do card, com o estilo que você solicitou. */}
      <div
        className={`
          flex flex-col h-full w-52 items-center justify-start p-2 gap-1 text-xs font-normal text-foreground
          border border-border bg-card rounded-md shadow-sm transition-opacity duration-300 min-h-16
        `}
      >
        <div className="mr-auto">
          <Badge
            variant="outline"
            className={`border-transparent text-primary-foreground font-bold w-fit cursor-pointer ${selectedVariant.bg}`}
          >
            {`${story.type === 'system' ? 'SS' : 'US'}${story.id}`.toUpperCase()}
          </Badge>
        </div>

        <p className="text-sm text-center">{story.title}</p>
      </div>
    </div>
  )
}

const EpicStoryCard = ({
  story,
  epicStory,
  lastElement = false,
  setProject,
}) => {
  // ✨ ESTADOS PARA CONTROLE DA EDIÇÃO
  const [isHovered, setIsHovered] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(epicStory.title)

  const selectedVariant = storyVariants[story.type] || storyVariants.user

  // ⚡️ FUNÇÕES PARA MANIPULAR A EDIÇÃO
  const handleEdit = () => {
    setEditValue(epicStory.title) // Garante que o input comece com o valor atual
    setIsEditing(true)
  }

  const handleCancel = () => {
    setIsEditing(false)
  }

  const handleSave = () => {
    if (editValue === epicStory.title) {
      setIsEditing(false)
      return
    }

    setProject((project) => ({
      ...project,
      epic_stories: project.epic_stories.map((story) => {
        if (story.id === epicStory.id) {
          return { ...story, title: editValue }
        }
        return story
      }),
    }))

    router.patch(
      route('epic-story.update', epicStory.id),
      { title: editValue },
      {
        preserveScroll: true,
        onSuccess: () => setIsEditing(false),
      },
    )
  }
  const handleDelete = () => {
    setProject((project) => ({
      ...project,
      epic_stories: project.epic_stories.filter((s) => s.id !== epicStory.id),
    }))

    router.delete(route('epic-story.destroy', epicStory.id), {
      preserveScroll: true,
    })
  }
  return (
    <section className="epicStory flex flex-1 items-center  max-w-md md:max-w-2xl gap-1">
      {lastElement ? (
        <CornerDownRight className="text-border size-5 " />
      ) : (
        <ArrowRight className="text-border size-5 " />
      )}
      <div
        onMouseEnter={() => !isEditing && setIsHovered(true)} // Desativa o hover durante a edição
        onMouseLeave={() => setIsHovered(false)}
        className="relative group flex w-full h-full"
      >
        <MotionDivOptions
          isHovered={isHovered}
          isEditing={isEditing}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        <div
          className={`
            flex flex-col flex-1 items-center justify-start p-2 gap-2 text-xs font-normal text-foreground bg-card
            border border-border rounded-md shadow-sm transition-opacity duration-300 min-h-16
          `}
        >
          <div className="mr-auto">
            <Badge
              variant="outline"
              className={`border-transparent text-primary-foreground font-bold w-fit cursor-pointer ${selectedVariant.bg}`}
            >
              {`${story.type === 'system' ? 'SS' : 'US'}${story.id}.${
                isTemporary(epicStory.id) ? '' : epicStory.id
              }`.toUpperCase()}
            </Badge>
          </div>

          {/* 🎨 RENDERIZAÇÃO CONDICIONAL: MODO DE EDIÇÃO OU VISUALIZAÇÃO */}
          {isEditing ? (
            <div className="w-full flex flex-col items-center gap-2">
              <Input
                type="text"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                className="w-full text-sm h-8"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSave()
                  if (e.key === 'Escape') handleCancel()
                }}
              />
              {/* <div className="flex items-center gap-2 self-end">
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-7 text-destructive/80 hover:bg-destructive/10"
                  onClick={handleCancel}
                >
                  <X className="size-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-7 text-green-500 hover:bg-green-500/10"
                  onClick={handleSave}
                >
                  <Check className="size-4" />
                </Button>
              </div>*/}
            </div>
          ) : (
            <p className="text-sm text-center w-full min-h-[32px] flex items-center justify-center">
              {epicStory.title}
            </p>
          )}
        </div>
      </div>
    </section>
  )
}
/**
 * Componente principal que exibe a coluna de "Epic Stories".
 * Ele mapeia as estórias do projeto e renderiza um StoryCard para cada uma.
 * @param {{ project: object, setProject: (project: object) => void }} props
 */
const EpicStories = ({ project, setProject }) => {
  // memoriza o estado das epic_stories
  const epicsByStoryId = useMemo(() => {
    if (!project?.epic_stories) return new Map()

    return project.epic_stories.reduce((acc, epicStory) => {
      const storyId = epicStory.story_id
      if (!acc.has(storyId)) {
        acc.set(storyId, [])
      }
      acc.get(storyId).push(epicStory)
      return acc
    }, new Map())
  }, [project?.epic_stories])

  const addEpicStory = (storyId) => {
    router.post(route('epic-story.store'), {
      story_id: storyId,
      project_id: project.id,
      title: 'Nova Epic Story',
    })
    setProject((prevProject) => ({
      ...prevProject,
      epic_stories: [
        ...prevProject.epic_stories,
        {
          story_id: storyId,
          project_id: project.id,
          title: 'Nova Epic Story',
          id: `temp-${new Date()}`,
        },
      ],
    }))
  }

  return (
    <section className="p-2 flex flex-col gap-2">
      <div className="flex flex-col gap-1">
        <div className="flex w-full">
          <span className="w-52" />
          <InfoButton data={tooltipInfo.epicStory} />
        </div>
        {project?.stories?.map((story, i) => {
          const relatedEpics = epicsByStoryId.get(story.id) || []
          return (
            <section className="py-1 flex gap-1 items-stretch" key={story.id}>
              <StoryCard
                story={story}
                addEpicStory={() => addEpicStory(story.id)}
              />

              <div className="flex flex-col gap-1 w-full">
                {[...relatedEpics]
                  .sort((a, b) => a.id - b.id)
                  .map((epicStory, index, array) => (
                    <EpicStoryCard
                      key={epicStory.id}
                      story={story}
                      epicStory={epicStory}
                      lastElement={
                        index === array.length - 1 && array.length > 1
                      }
                      setProject={setProject}
                    />
                  ))}
              </div>
            </section>
          )
        })}
      </div>
    </section>
  )
}

export default EpicStories
