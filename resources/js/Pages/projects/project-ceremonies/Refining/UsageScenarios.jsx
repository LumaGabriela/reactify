import React, { useMemo, useState } from 'react'
import { router } from '@inertiajs/react'
import {
  CornerDownRight,
  ArrowRight,
  Check,
  X,
  Pencil,
  Trash2,
} from 'lucide-react'
import { isTemporary } from '@/lib/utils'
import MotionDivOptions from '@/Components/MotionDivOptions'
import { storyVariants } from '../StoryDiscovery/Stories' // Assuming this path is correct
import { toast } from 'sonner'
import { Input } from '@/components/ui/input'

/**
 * Renders the parent Story card on the left.
 * Its primary purpose is to display story info and provide an "add scenario" action.
 * @param {{ story: object, addScenario: () => void }} props
 */
const StoryCard = ({ story, addScenario }) => {
  const selectedVariant = storyVariants[story.type] || storyVariants.user

  return (
    <div className="relative group w-52 flex-shrink-0">
      <MotionDivOptions isHovered={true} onAdd={addScenario} />

      <div className="flex flex-col h-full items-center justify-start p-2 gap-1 text-xs font-normal text-foreground border border-border bg-card rounded-md shadow-sm ">
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

/**
 * An interactive card for a single Usage Scenario, with editing and deleting capabilities.
 * The internal logic of this component remains unchanged as it's already robust.
 * @param {{ scenario: object, story: object, lastElement: boolean, setProject: Function }} props
 */
const ScenarioCard = ({ scenario, story, lastElement = false, setProject }) => {
  const [isHovered, setIsHovered] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editValues, setEditValues] = useState({
    as: scenario.description.as || '',
    given: scenario.description.given || '',
    when: scenario.description.when || '',
    then_1: scenario.description.then_1 || '',
    and: scenario.description.and || '',
    then_2: scenario.description.then_2 || '',
  })

  const handleEdit = () => {
    setEditValues({
      as: scenario.description.as || '',
      given: scenario.description.given || '',
      when: scenario.description.when || '',
      then_1: scenario.description.then_1 || '',
      and: scenario.description.and || '',
      then_2: scenario.description.then_2 || '',
    })
    setIsEditing(true)
  }

  const handleCancel = () => setIsEditing(false)

  const handleSave = () => {
    // 1. Optimistic UI Update
    setProject((project) => ({
      ...project,
      usage_scenarios: project.usage_scenarios.map((s) =>
        s.id === scenario.id ? { ...s, description: editValues } : s,
      ),
    }))

    // 2. Backend Request
    router.patch(
      route('usage-scenario.update', scenario.id),
      { description: editValues },
      {
        preserveScroll: true,
        onSuccess: () => setIsEditing(false),
      },
    )
  }

  const handleDelete = () => {
    // 1. Optimistic UI Update
    setProject((project) => ({
      ...project,
      usage_scenarios: project.usage_scenarios.filter(
        (s) => s.id !== scenario.id,
      ),
    }))

    // 2. Backend Request
    router.delete(route('usage-scenario.destroy', scenario.id), {
      preserveScroll: true,
    })
  }
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      setIsEditing(false)
      handleSave()
    }
    if (e.key === 'Escape') {
      setIsEditing(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setEditValues((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <section className="flex flex-1 items-center max-w-md md:max-w-4xl gap-1 h-full">
      {lastElement ? (
        <CornerDownRight className="text-primary size-5" />
      ) : (
        <ArrowRight className="text-primary size-5" />
      )}
      <div
        onMouseEnter={() => !isEditing && setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="relative group flex w-full h-full"
      >
        {!isTemporary(scenario.id) && (
          <MotionDivOptions
            isHovered={isHovered}
            isEditing={isEditing}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}

        <div className="flex-1  border border-border bg-card rounded-md shadow-sm p-3">
          {isEditing ? (
            <div className="w-full flex flex-col text-left font-normal items-center gap-3">
              {/* botoes de salvar e sair*/}
              <div className="flex items-center gap-2 self-start">
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
              </div>
              {/* Edit form remains the same */}
              <div className="flex text-xs items-center gap-2 text-primary w-full">
                <span className="w-10 font-bold">AS</span>
                <Input
                  name="as"
                  value={editValues.as}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  className="w-full text-sm h-8 font-semibold"
                  autoFocus
                />
              </div>
              <div className="flex text-xs items-center gap-2 text-primary w-full">
                <span className="w-10 font-bold">GIVEN</span>
                <Input
                  name="given"
                  value={editValues.given}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  className="w-full text-sm "
                />
              </div>
              <div className="flex text-xs items-center gap-2 text-primary w-full">
                <span className="w-10 font-bold">WHEN</span>
                <Input
                  name="when"
                  value={editValues.when}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  className="w-full text-sm "
                />
              </div>
              <div className="flex text-xs items-center gap-2 text-primary w-full">
                <span className="w-10 font-bold">THEN</span>
                <Input
                  name="then_1"
                  value={editValues.then_1}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  className="w-full text-sm "
                />
              </div>
              <div className="flex text-xs items-center gap-2 text-primary w-full">
                <span className="w-10 font-bold">AND</span>
                <Input
                  name="and"
                  value={editValues.and}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  className="w-full text-sm "
                />
              </div>
              <div className="flex text-xs items-center gap-2 text-primary w-full">
                <span className="w-10 font-bold">THEN</span>
                <Input
                  name="then_2"
                  value={editValues.then_2}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  className="w-full text-sm "
                />
              </div>
            </div>
          ) : (
            <div className="w-full bg-card rounded-lg p-2 shadow-sm">
              {/* 1. Cabeçalho (O que antes era o AccordionTrigger) */}
              <div className="flex items-center gap-2">
                <Badge variant="secondary">
                  {`US${scenario.id}`.toUpperCase()}
                </Badge>
                <span className="font-bold text-sm">{scenario.title}</span>
              </div>
              <ul className="space-y-2 text-sm font-normal text-left mt-3 pl-1">
                <li>
                  <span className="font-bold text-primary">AS</span>{' '}
                  {scenario.description.as}
                </li>
                <li>
                  <span className="font-bold text-primary">GIVEN</span>{' '}
                  {scenario.description.given}
                </li>
                <li>
                  <span className="font-bold text-primary">WHEN</span>{' '}
                  {scenario.description.when}
                </li>
                <li>
                  <span className="font-bold text-primary">THEN</span>{' '}
                  {scenario.description.then_1}
                </li>

                {/* ✨ Melhoria: Só renderiza o 'AND' se ele existir */}
                {scenario.description.and && (
                  <li>
                    <span className="font-bold text-primary">AND</span>{' '}
                    {scenario.description.and}
                  </li>
                )}

                {/* ✨ Melhoria: Só renderiza o segundo 'THEN' se ele existir */}
                {scenario.description.then_2 && (
                  <li>
                    <span className="font-bold text-primary">THEN</span>{' '}
                    {scenario.description.then_2}
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

/**
 * Main component to display and manage Usage Scenarios, grouped by their parent Story.
 * @param {{ project: object, setProject: (project: object) => void }} props
 */
const UsageScenarios = ({ project, setProject }) => {
  // Memoize scenarios grouped by their parent `story_id`.
  const scenariosByStoryId = useMemo(() => {
    if (!project?.usage_scenarios) return new Map()

    return project.usage_scenarios.reduce((acc, scenario) => {
      const storyId = scenario.story_id // The key change is here!
      if (!acc.has(storyId)) {
        acc.set(storyId, [])
      }
      acc.get(storyId).push(scenario)
      return acc
    }, new Map())
  }, [project?.usage_scenarios])

  const addScenario = (storyId) => {
    const newScenarioData = {
      story_id: storyId, // Linking to the Story
      project_id: project.id,
      description: {
        as: '...',
        given: '...',
        when: '...',
        then_1: '...',
        and: '...',
        then_2: '...',
      },
    }

    // Optimistic UI update
    const tempId = `temp-${Date.now()}`
    setProject((prev) => ({
      ...prev,
      usage_scenarios: [
        ...prev.usage_scenarios,
        { ...newScenarioData, id: tempId },
      ],
    }))

    // Backend request
    router.post(route('usage-scenario.store'), newScenarioData, {
      preserveScroll: true,
    })
  }

  return (
    <section className="p-2 flex flex-col">
      {project?.stories?.map((story) => {
        const relatedScenarios = scenariosByStoryId.get(story.id) || []
        console.log(relatedScenarios)
        return (
          <section className="py-1 flex gap-2 min-h-60" key={story.id}>
            <StoryCard
              story={story}
              addScenario={() => addScenario(story.id)}
            />

            <div className="flex flex-col gap-2 w-full">
              {relatedScenarios
                .sort((a, b) => a.id - b.id)
                .map((scenario, index, array) => (
                  <ScenarioCard
                    key={scenario.id}
                    scenario={scenario}
                    story={story}
                    setProject={setProject}
                    lastElement={index === array.length - 1 && array.length > 1}
                  />
                ))}
            </div>
          </section>
        )
      })}
    </section>
  )
}

export default UsageScenarios
