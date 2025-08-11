import { Plus } from 'lucide-react'
import { storyVariants } from '../StoryDiscovery/Stories'
import React from 'react'
/**
 * Componente para renderizar um único card de estória.
 * Gerencia seu próprio estado de hover para exibir o botão de adicionar.
 * @param {{ story: object, addEpicStory: () => void }} props
 */
const StoryCard = ({ story, addEpicStory }) => {
  const [isHovered, setIsHovered] = useState(false)

  // Seleciona a variante de cor com base no tipo da estória.
  // Garante um fallback para 'user' caso o tipo seja inválido.
  const selectedVariant = storyVariants[story.type] || storyVariants.user

  return (
    // O container principal precisa ser 'relative' para que o botão de ação,
    // que é 'absolute', possa ser posicionado corretamente em relação a este card.
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative group max-w-md"
    >
      {/* O botão de adicionar só é renderizado quando 'isHovered' for true. */}
      {/* O uso de MotionDivOptions seria aqui, envolvendo este botão para animações. */}
      {isHovered && (
        <div className="absolute top-1 right-1 z-10">
          <Button
            variant="ghost"
            size="icon"
            className="size-7 text-foreground/80 hover:bg-primary/10"
            onClick={addEpicStory}
          >
            <Plus className="size-4" />
          </Button>
        </div>
      )}

      {/* Este é o corpo do card, com o estilo que você solicitou. */}
      <div
        className={`
          flex flex-col flex-1 !max-w-xl items-center justify-start p-2 gap-1 text-xs font-normal text-foreground
          border border-border rounded-md shadow-sm transition-opacity duration-300 min-h-16
        `}
      >
        <div className="mr-auto">
          <Badge
            variant="outline"
            className={`border-transparent text-primary-foreground font-bold w-fit cursor-pointer ${selectedVariant.bg}`}
          >
            {/* Lógica para exibir 'SS' para 'system' e 'US' para 'user', seguido do ID. */}
            {`${story.type === 'system' ? 'SS' : 'US'}${story.id}`.toUpperCase()}
          </Badge>
        </div>

        <p className="text-sm text-center">{story.title}</p>
      </div>
    </div>
  )
}

/**
 * Componente principal que exibe a coluna de "Epic Stories".
 * Ele mapeia as estórias do projeto e renderiza um StoryCard para cada uma.
 * @param {{ project: object, setProject: (project: object) => void }} props
 */
const EpicStories = ({ project, setProject }) => {
  // Função a ser chamada ao clicar no botão de '+'.
  // Por enquanto, apenas loga uma mensagem no console.
  const addEpicStory = (storyId) => {
    setProject((prevProject) => ({
      ...prevProject,
      epic_stories: [
        ...prevProject.epic_stories,
        {
          story_id: storyId,
          project_id: project.id,
          title: 'Nova Epic Story',
          id: project.epic_stories.length + 1,
        },
      ],
    }))
  }

  return (
    <div className="p-4 flex flex-col gap-3">
      {/* Verificação para garantir que project.stories existe e é um array antes de mapear */}
      {project?.stories?.map((story, i) => (
        <React.Fragment key={story.id}>
          <StoryCard
            story={story}
            addEpicStory={() => addEpicStory(story.id)}
          />

          {project?.epic_stories?.map((epicStory) => {
            return story.id === epicStory.story_id ? (
              <StoryCard key={index} story={epicStory} />
            ) : null
          })}
        </React.Fragment>
      ))}
    </div>
  )
}

export default EpicStories
