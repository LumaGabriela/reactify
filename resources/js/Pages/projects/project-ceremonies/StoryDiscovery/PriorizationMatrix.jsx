import React, { useState, useMemo, useEffect } from 'react' // Adicionado useEffect
import {
  DndContext,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  useDraggable,
  useDroppable,
} from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { router } from '@inertiajs/react'

const PRIORITIES = ['Baixa', 'Média', 'Alta', 'Crítica']
const GRID_ROWS = 8

const StoryCard = ({ story }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: `story-${story.id}`,
      data: { story },
    })

  const style = {
    transform: CSS.Transform.toString(transform),
    opacity: isDragging ? 0.5 : 1,
    touchAction: 'none',
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="p-3 bg-primary/10 border border-primary/20 rounded-lg shadow-sm cursor-grab active:cursor-grabbing text-primary"
    >
      <p className="font-semibold text-sm">{story.title}</p>
    </div>
  )
}

const GoalCard = ({ goal }) => {
  return (
    <div className="p-3 bg-accent/10 border border-accent/20 rounded-lg text-accent-foreground">
      <p className="font-semibold text-sm">{goal.title}</p>
    </div>
  )
}

const DroppableCell = ({ id, children, className = '' }) => {
  const { isOver, setNodeRef } = useDroppable({
    id: id,
  })

  return (
    <div
      ref={setNodeRef}
      className={`
        min-h-[60px] flex flex-col justify-center rounded-md transition-all duration-150
        ${isOver ? 'outline-2 outline-offset-2 outline-primary' : 'outline-1 outline-dashed outline-border'}
        ${className}
      `}
    >
      {children}
    </div>
  )
}

// Função auxiliar para transformar o array da API em nosso objeto de estado
const transformArrayToMatrixObject = (priorizations, allProjectStories) => {
  return priorizations.reduce((matrix, item) => {
    const cellId = `cell-${item.priority}-${item.position}`
    const storyDetails = allProjectStories.find((s) => s.id === item.story_id)

    if (storyDetails) {
      matrix[cellId] = {
        id: storyDetails.id,
        title: storyDetails.title,
        project_id: storyDetails.project_id,
        priority: item.priority,
        position: item.position,
      }
    }

    return matrix
  }, {})
}
const PriorizationMatrix = ({ project }) => {
  const [priorizationMatrix, setPriorizationMatrix] = useState(() =>
    transformArrayToMatrixObject(project.priorizations, project.stories),
  )

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor),
  )

  const unassignedStories = useMemo(() => {
    const assignedStoryIds = new Set(
      Object.values(priorizationMatrix)
        .filter(Boolean)
        .map((story) => story.id),
    )
    return project.stories.filter((story) => !assignedStoryIds.has(story.id))
  }, [project.stories, priorizationMatrix])

  function handleDragEnd(event) {
    const { active, over } = event
    console.log(active, over)
    if (!over) return

    const draggedStory = project.stories.find(
      (story) => `story-${story.id}` === active.id,
    )
    if (!draggedStory) return

    setPriorizationMatrix((prevMatrix) => {
      const newMatrix = { ...prevMatrix }
      const oldCellKey = Object.keys(newMatrix).find(
        (key) => newMatrix[key]?.id === draggedStory.id,
      )
      if (oldCellKey) {
        delete newMatrix[oldCellKey]
      }

      // --- PONTO CENTRAL DA MUDANÇA ---
      if (String(over.id).startsWith('cell-')) {
        // Extrai a prioridade do ID da célula (ex: 'cell-Alta-2' -> 'Alta')
        const priority = over.id.split('-')[1]
        const position = Number(over.id.split('-')[2])
        // Constrói o novo objeto com a estrutura desejada
        newMatrix[over.id] = {
          id: draggedStory.id,
          title: draggedStory.title,
          priority: priority,
          position: position,
        }

        router.post(route('priorization.store'), {
          story_id: draggedStory.id,
          project_id: project.id,
          priority: priority,
          position: position,
        })
      } else if (over.id === 'story-list') {
        const deletedCell = project.priorizations.find(
          (cell) => cell.story_id === draggedStory.id,
        )
        router.delete(route('priorization.destroy', deletedCell.id))
      }

      return newMatrix
    })
  }

  // Este useEffect que você adicionou é perfeito para depurar a nova estrutura
  useEffect(() => {
    // console.log(priorizationMatrix)
  }, [priorizationMatrix])

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <div className="flex flex-col lg:flex-row gap-8 p-4 md:p-6 bg-background text-foreground min-h-screen">
        <aside className="lg:w-1/4 xl:w-1/5 space-y-8">
          <section>
            <h2 className="text-lg font-bold mb-3 text-muted-foreground">
              Stories
            </h2>
            <DroppableCell
              id="story-list"
              className="space-y-2 p-3 bg-card text-card-foreground border rounded-xl shadow-sm min-h-[200px]"
            >
              {unassignedStories.length > 0 ? (
                unassignedStories.map((story) => (
                  <StoryCard key={story.id} story={story} />
                ))
              ) : (
                <p className="text-sm text-muted-foreground p-2">
                  Todas as stories foram priorizadas.
                </p>
              )}
            </DroppableCell>
          </section>
          <section>
            <h2 className="text-lg font-bold mb-3 text-muted-foreground">
              Metas (Goals)
            </h2>
            <div className="space-y-2 p-3 bg-card text-card-foreground border rounded-xl shadow-sm">
              {project.goal_sketches.length > 0 ? (
                project.goal_sketches.map((goal) => (
                  <GoalCard key={goal.id} goal={goal} />
                ))
              ) : (
                <p className="text-sm text-muted-foreground p-2">
                  Nenhuma meta definida.
                </p>
              )}
            </div>
          </section>
        </aside>

        <main className="flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {PRIORITIES.map((priority) => (
              <div key={priority} className="bg-muted p-3 rounded-xl">
                <h3 className="font-bold text-center text-md mb-4 text-muted-foreground uppercase tracking-wider">
                  {priority}
                </h3>
                <div className="space-y-3">
                  {Array.from({ length: GRID_ROWS }).map((_, rowIndex) => {
                    const cellId = `cell-${priority}-${rowIndex}`
                    const storyInCell = priorizationMatrix[cellId]
                    return (
                      <DroppableCell key={cellId} id={cellId}>
                        {storyInCell ? (
                          // Isso ainda funciona porque storyInCell tem as chaves 'id' e 'title'
                          <StoryCard story={storyInCell} />
                        ) : (
                          <div className="h-12 w-full flex items-center justify-center text-muted-foreground text-xs">
                            Vazio
                          </div>
                        )}
                      </DroppableCell>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </DndContext>
  )
}

export default PriorizationMatrix
