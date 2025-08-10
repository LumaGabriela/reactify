import { darkenColor } from '@/lib/utils'
import {
  DndContext,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  useDraggable,
  useDroppable,
  DragOverlay,
} from '@dnd-kit/core'
import {
  SortableContext,
  useSortable,
  arrayMove,
  horizontalListSortingStrategy, // Estratégia para colunas horizontais
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { router } from '@inertiajs/react'
import EditPriorities from './EditPriorities'

// SUBSTITUA O COMPONENTE INTEIRO POR ESTE
const SortablePriorityColumn = ({ priority, children, itemCount }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: priority.id, data: { type: 'column' } })
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.8 : 1,
    backgroundColor: darkenColor(priority.color, 0.3),
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="rounded-md flex flex-col h-full"
    >
      {/* Cabeçalho da Coluna (agora é a área de arrastar) */}
      <div
        {...attributes}
        {...listeners}
        className="flex items-center justify-between p-3 cursor-grab active:cursor-grabbing"
        style={{ touchAction: 'none' }}
      >
        <section
          style={{ backgroundColor: darkenColor(priority.color, 0.4) }}
          className="flex items-center justify-between px-3 py-1 gap-2 rounded-md w-full text-slate-100"
        >
          <span
            className="size-3 rounded-full"
            style={{ backgroundColor: priority.color }}
          />
          <span className="font-semibold text-sm ">{priority.name}</span>
          <span className="text-sm font-medium ">{itemCount}</span>
        </section>
      </div>

      {/* Área de Conteúdo (Cards) */}
      <div className="p-2 gap-1 flex-1">{children}</div>
    </div>
  )
}
const StoryCard = ({ story, priority = null }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: `story-${story.story_id}`,
      data: { story },
    })

  const style = {
    transform: CSS.Transform.toString(transform),
    touchAction: 'none',
    backgroundColor: priority?.color ? darkenColor(priority.color, 0.4) : '',
    visibility: isDragging ? 'hidden' : 'visible',
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`
        flex flex-1 !max-w-xl items-center justify-center p-2 text-xs font-normal text-foreground ${priority ? 'text-slate-50' : 'border border-border'}  rounded-md shadow-sm  transition-opacity duration-300 min-h-[60px]
        ${story.isTemporary ? 'opacity-50 cursor-not-allowed' : 'cursor-grab active:cursor-grabbing'}`}
    >
      <p className=" ">{story.story_title}</p>
    </div>
  )
}

const GoalCard = ({ goal }) => {
  return (
    <Card className="bg-card border border-border transition-all duration-300 ease-in-out p-0 h-[150px] rounded-md">
      <CardContent className="p-2 h-full flex flex-col gap-2">
        {/* Linha dos Badges (agora estáticos) */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* Badge de Tipo */}
            <Badge className="border-transparent text-white font-bold bg-orange-500">
              {goal.type.toUpperCase()}
            </Badge>

            <Badge className="border-transparent text-white font-bold bg-orange-500">
              {goal.priority.toUpperCase()}
            </Badge>
          </div>
        </div>

        {/* Área do Título (apenas exibição) */}
        <p className="m-0 font-normal text-sm text-foreground break-words w-full min-h-[24px]">
          {goal.title}
        </p>
      </CardContent>
    </Card>
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
        min-h-[150px] flex flex-row justify-center rounded-md transition-all duration-150 border border-slate-900/30
        ${isOver ? ' bg-card/60' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  )
}

// Função auxiliar para transformar o array da API em nosso objeto de estado
const transformArrayToMatrixObject = (prioritizations, allProjectStories) => {
  if (!prioritizations || !allProjectStories) return {}

  return prioritizations.reduce((matrix, item) => {
    const cellId = `cell-${item.priority_id}-${item.position}`
    const storyDetails = allProjectStories.find((s) => s.id === item.story_id)

    if (storyDetails) {
      matrix[cellId] = {
        id: item.id,
        story_id: storyDetails.id,
        story_title: storyDetails.title,
        project_id: storyDetails.project_id,
        priority_id: item.priority_id,
        position: item.position,
      }
    }

    return matrix
  }, {})
}
const PrioritizationMatrix = ({ project }) => {
  const GRID_ROWS = project.goal_sketches.length || 4
  const [activeItem, setActiveItem] = useState(null)
  const [prioritizationMatrix, setPrioritizationMatrix] = useState(() =>
    transformArrayToMatrixObject(project?.prioritizations, project?.stories),
  )
  // --- NOVO: Estado local para a ordem das prioridades ---
  const [orderedPriorities, setOrderedPriorities] = useState(
    // Garante que a ordenação inicial vinda do backend (com a nova coluna) seja respeitada
    project.matrix_priorities.sort((a, b) => a.order_column - b.order_column),
  )
  useEffect(() => {
    const newMatrix = transformArrayToMatrixObject(
      project.prioritizations,
      project.stories,
    )

    // Atualiza o estado interno para refletir as novas props
    setPrioritizationMatrix(newMatrix)
  }, [project])

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor),
  )

  const unassignedStories = useMemo(() => {
    const assignedStoryIds = new Set(
      Object.values(prioritizationMatrix)
        .filter(Boolean)
        .map((story) => story.story_id),
    )
    return project.stories.filter((story) => !assignedStoryIds.has(story.id))
  }, [project.stories, prioritizationMatrix])

  const handleDragStart = (event) => {
    const { active } = event
    setActiveItem(active)
  }

  const handleDragEnd = (event) => {
    setActiveItem(null)
    const { active, over } = event
    if (!over) return
    if (
      active.data.current?.type === 'column' &&
      over.data.current?.type === 'column'
    ) {
      if (active.id !== over.id) {
        setOrderedPriorities((priorities) => {
          const oldIndex = priorities.findIndex((p) => p.id === active.id)
          const newIndex = priorities.findIndex((p) => p.id === over.id)
          const newOrder = arrayMove(priorities, oldIndex, newIndex)

          // Envia a nova ordem para o backend
          const payload = newOrder.map((p, index) => ({
            id: p.id,
            order: index, // A nova ordem é o próprio índice do array
          }))

          router.patch(
            route('matrix-priority.reorder'),
            { priorities: payload },
            {
              preserveState: true,
              preserveScroll: true,
            },
          )

          return newOrder
        })
      }
      return
    } else if (active.data.current?.story?.story_id) {
      const draggedStory = project.stories.find(
        (story) => `story-${story.id}` === active.id,
      )
      if (!draggedStory) return

      setPrioritizationMatrix((prevMatrix) => {
        const newMatrix = { ...prevMatrix }
        const oldCellKey = Object.keys(newMatrix).find(
          (key) => newMatrix[key]?.story_id === draggedStory.id,
        )
        const draggedPrioritization = oldCellKey ? prevMatrix[oldCellKey] : null
        if (draggedPrioritization && draggedPrioritization.isTemporary) {
          console.warn(
            'Ação bloqueada: A story está aguardando confirmação do servidor.',
          )

          return prevMatrix
        }
        //adiciona o elemento de volta a lista
        if (String(over.id).startsWith('story-list') && draggedPrioritization) {
          //remove o elemento do banco de dados e da matriz
          if (oldCellKey) delete newMatrix[oldCellKey]
          router.delete(
            route('prioritization.destroy', {
              prioritization: draggedPrioritization.id,
            }),
            {
              preserveState: true,
              preserveScroll: true,
              only: [],
            },
          )

          return newMatrix
        } else if (String(over.id).startsWith('cell-')) {
          //lida com a adicao de stories nas celulas
          const priority = over.id.split('-')[1]
          const position = Number(over.id.split('-')[2])
          const occupant = prevMatrix[over.id]

          if (occupant) return prevMatrix

          // se a story estiver em uma celula, atualiza a posicao
          if (draggedPrioritization) {
            router.patch(
              route('prioritization.update', {
                prioritization: draggedPrioritization.id,
              }),
              {
                priority_id: priority,
                position: position,
              },
              {
                preserveState: true,
                preserveScroll: true,
                only: [],
              },
            )
          } else {
            //se nao estiver, adiciona em uma celula
            router.post(route('prioritization.store'), {
              story_id: draggedStory.id,
              project_id: project.id,
              priority_id: priority,
              position: position,
            })
          }
          if (oldCellKey) delete newMatrix[oldCellKey]
          // Constrói o novo objeto com a estrutura desejada
          newMatrix[over.id] = {
            id: draggedPrioritization?.id || `temp-${Date.now()}`,
            story_id: draggedStory.id,
            story_title: draggedStory.title,
            priority_id: priority,
            position: position,
            isTemporary: !draggedPrioritization,
          }
          return newMatrix
        }

        return prevMatrix
      })
    }
  }
  const priorityIds = useMemo(
    () => orderedPriorities.map((p) => p.id),
    [orderedPriorities],
  )

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <main className="flex flex-col  gap-4 p-4 md:p-6 bg-background text-foreground min-h-screen">
        <section className=" bg-card text-card-foreground border-0 rounded-xl shadow-sm  w-full max-w-6xl">
          {' '}
          <h2 className="text-lg font-bold my-2 text-muted-foreground">
            Stories
          </h2>
          <DroppableCell
            id="story-list"
            className="grid grid-cols-5 gap-2 p-2  min-h-[200px] items-start"
          >
            {unassignedStories.length > 0 ? (
              unassignedStories.map((story) => {
                const unassignedStory = {
                  story_id: story.id,
                  story_title: story.title,
                }
                return <StoryCard key={story.id} story={unassignedStory} />
              })
            ) : (
              <p className="text-sm text-muted-foreground p-2">
                Todas as stories foram priorizadas.
              </p>
            )}
          </DroppableCell>
        </section>

        <section className="flex-1">
          {/* botao para editar prioridades*/}
          <div className="w-full flex gap-3 justify-start items-center mb-6 relative">
            <EditPriorities
              priorities={project.matrix_priorities}
              projectId={project.id}
            />
          </div>
          <section className="flex gap-2 justify-between">
            <aside className="flex flex-col w-[230px]  bg-card px-2 gap-3 rounded">
              <span className="h-[49px] py-2">Goals</span>
              {project.goal_sketches.map((goal) => (
                <GoalCard key={goal.id} goal={goal}>
                  {goal.title}
                </GoalCard>
              ))}
            </aside>
            <div className="flex-1 grid grid-flow-col auto-cols-[180px] gap-2 pr-2">
              <SortableContext
                items={priorityIds}
                strategy={horizontalListSortingStrategy}
              >
                {orderedPriorities.map((priority) => {
                  const itemCount = Object.values(prioritizationMatrix).filter(
                    (story) => story && story.priority_id == priority.id,
                  ).length
                  return (
                    <SortablePriorityColumn
                      key={priority.id}
                      priority={priority}
                      itemCount={itemCount}
                    >
                      <div className="space-y-3">
                        {Array.from({ length: GRID_ROWS }).map(
                          (_, rowIndex) => {
                            const cellId = `cell-${priority.id}-${rowIndex}`
                            const storyInCell = prioritizationMatrix[cellId]
                            return (
                              <DroppableCell key={cellId} id={cellId}>
                                {storyInCell ? (
                                  <StoryCard
                                    story={storyInCell}
                                    priority={priority}
                                  />
                                ) : (
                                  <div className="h-12 w-full flex items-center justify-center "></div>
                                )}
                              </DroppableCell>
                            )
                          },
                        )}
                      </div>
                    </SortablePriorityColumn>
                  )
                })}
              </SortableContext>
            </div>
          </section>
        </section>
      </main>
      {/* overlay adicionado para manter estilo do card de story mesmo ao arrastar*/}
      <DragOverlay>
        {activeItem
          ? (() => {
              // Se estiver arrastando uma story
              if (activeItem.data.current?.story) {
                const cellKey = Object.keys(prioritizationMatrix).find(
                  (key) =>
                    prioritizationMatrix[key]?.story_id ===
                    activeItem.data.current.story.story_id,
                )
                const priorityData = cellKey
                  ? orderedPriorities.find(
                      (p) => p.id == prioritizationMatrix[cellKey].priority_id,
                    )
                  : null

                return (
                  <StoryCard
                    story={activeItem.data.current.story}
                    priority={priorityData}
                  />
                )
              }

              return null
            })()
          : null}
      </DragOverlay>
    </DndContext>
  )
}

export default PrioritizationMatrix
