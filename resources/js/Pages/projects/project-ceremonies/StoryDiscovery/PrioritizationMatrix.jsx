import { router } from '@inertiajs/react'
import React from 'react'
// Helper para ordenar metas por prioridade (sem alterações)
const priorityOrder = { high: 1, medium: 2, med: 2, low: 3 }
const sortGoals = (a, b) =>
  priorityOrder[a.priority] - priorityOrder[b.priority]

// Componente para um único card de estória
// Estilos refinados com classes do shadcn/ui e transições suaves
const StoryCard = ({ story }) => (
  <div
    draggable
    onDragStart={(e) => {
      e.dataTransfer.setData('storyId', story.id)
      e.dataTransfer.effectAllowed = 'move'
    }}
    className="p-2.5 mb-2 bg-card text-card-foreground border rounded-lg shadow-sm cursor-grab active:cursor-grabbing transition-all hover:shadow-md hover:bg-muted"
  >
    <p className="text-sm font-medium leading-snug">{story.title}</p>
  </div>
)

// Componente para uma célula da matriz
// Estilo atualizado para um visual de "dropzone" com borda tracejada
const MatrixCell = ({ children, onDrop, onDragOver }) => (
  <div
    onDrop={onDrop}
    onDragOver={onDragOver}
    className="h-40 p-2 border-2 border-dashed bg-muted/50 rounded-lg overflow-y-auto flex flex-col"
  >
    {children}
  </div>
)

const PrioritizationMatrix = ({ project: initialProject }) => {
  const [stories, setStories] = useState(initialProject.stories || [])
  const [goals, setGoals] = useState(
    [...(initialProject.goal_sketches || [])].sort(sortGoals),
  )

  useEffect(() => {
    setStories(initialProject.stories || [])
    setGoals([...(initialProject.goal_sketches || [])].sort(sortGoals))
  }, [initialProject])

  const complexities = ['low', 'medium', 'high']
  const unprioritizedStories = stories.filter(
    (s) => s.value === null || s.complexity === null,
  )

  const handleDragOver = (e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = (e, goalIndex, complexityValue) => {
    e.preventDefault()
    const storyId = parseInt(e.dataTransfer.getData('storyId'), 10)
    if (!storyId) return

    const storyToUpdate = stories.find((s) => s.id === storyId)
    if (!storyToUpdate) return

    const originalState = [...stories]
    const businessValue =
      goalIndex !== null ? goals.length - 1 - goalIndex : null

    // Update otimista
    setStories((prevStories) =>
      prevStories.map((story) =>
        story.id === storyId
          ? { ...story, value: businessValue, complexity: complexityValue }
          : story,
      ),
    )
    router.patch(route('story.prioritize', storyId), {
      value: businessValue,
      complexity: complexityValue,
    })
  }

  return (
    <div className="p-4 md:p-6 lg:p-8 text-foreground">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Coluna de Estórias Não Priorizadas */}
        <Card className="w-full lg:w-1/3 xl:w-1/4">
          <CardHeader>
            <CardTitle>Estórias para Priorizar</CardTitle>
          </CardHeader>
          <CardContent
            onDrop={(e) => handleDrop(e, null, null)}
            onDragOver={handleDragOver}
            className="p-4 bg-muted/20 min-h-[200px] lg:min-h-[500px] rounded-b-lg"
          >
            {unprioritizedStories.length > 0 ? (
              unprioritizedStories.map((story) => (
                <StoryCard key={story.id} story={story} />
              ))
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-sm text-muted-foreground text-center">
                  Todas as estórias foram priorizadas.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Matriz de Priorização */}
        <div className="w-full lg:w-2/3 xl:w-3/4">
          <div className="grid grid-cols-4 gap-4 items-center">
            <span className="text-center font-semibold text-muted-foreground capitalize">
              Goal
            </span>
            {complexities.map((complexity) => (
              <h3
                key={complexity}
                className="text-center font-semibold text-muted-foreground capitalize"
              >
                {complexity}
              </h3>
            ))}
            {/* Linhas da Matriz (Metas e Células) */}
            {goals.map((goal, index) => (
              <React.Fragment key={goal.id}>
                <div className="font-semibold text-sm text-right pr-4 h-full flex items-center justify-end">
                  <span className="text-center font-semibold text-muted-foreground capitalize">
                    {goal.title}
                  </span>
                </div>

                {complexities.map((complexity) => {
                  const cellValue = goals.length - 1 - index
                  return (
                    <MatrixCell
                      key={`${goal.id}-${complexity}`}
                      onDrop={(e) => handleDrop(e, index, complexity)}
                      onDragOver={handleDragOver}
                    >
                      {stories
                        .filter(
                          (s) =>
                            s.value === cellValue &&
                            s.complexity === complexity,
                        )
                        .map((story) => (
                          <StoryCard key={story.id} story={story} />
                        ))}
                    </MatrixCell>
                  )
                })}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PrioritizationMatrix
