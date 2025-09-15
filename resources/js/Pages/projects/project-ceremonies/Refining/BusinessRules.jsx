import { ArrowRight, CornerDownRight, X, Check } from 'lucide-react'
import MotionDivOptions from '@/Components/MotionDivOptions'
import { storyVariants } from '../StoryDiscovery/Stories'
import React, { useMemo, useState } from 'react' // Adicionei useState que estava faltando no seu exemplo original para EpicStoryCard
import { router } from '@inertiajs/react'
import { isTemporary } from '@/lib/utils'
import InfoButton from '@/Components/InfoButton'
import { tooltipInfo } from '@/lib/projectData'
import ReactTextareaAutosize from 'react-textarea-autosize'
/**
 * Componente para renderizar um único card de estória.
 * Gerencia seu próprio estado de hover para exibir o botão de adicionar.
 * @param {{ story: object, addBusinessRule: () => void }} props
 */
const StoryCard = ({ story, addBusinessRule }) => {
  const selectedVariant = storyVariants[story.type] || storyVariants.user

  return (
    <div className="relative group">
      {/* O onAdd agora chama a função para adicionar uma regra de negócio */}
      <MotionDivOptions isHovered={true} onAdd={addBusinessRule} />

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

const BusinessRuleCard = ({
  story,
  businessRule,
  lastElement = false,
  setProject,
}) => {
  // ✨ ESTADOS PARA CONTROLE DA EDIÇÃO
  const [isHovered, setIsHovered] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(businessRule.title)

  const selectedVariant = storyVariants[story.type] || storyVariants.user

  // ⚡️ FUNÇÕES PARA MANIPULAR A EDIÇÃO
  const handleEdit = () => {
    setEditValue(businessRule.title) // Garante que o input comece com o valor atual
    setIsEditing(true)
  }

  const handleCancel = () => {
    setIsEditing(false)
  }

  const handleSave = () => {
    if (editValue === businessRule.title) {
      setIsEditing(false)
      return
    }

    setProject((project) => ({
      ...project,
      // Alvo agora é a lista de business_rules
      business_rules: project.business_rules.map((rule) => {
        if (rule.id === businessRule.id) {
          return { ...rule, title: editValue }
        }
        return rule
      }),
    }))

    router.patch(
      // Rota atualizada para o controller de BusinessRule
      route('business-rule.update', businessRule.id),
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
      // Filtra a lista de business_rules
      business_rules: project.business_rules.filter(
        (r) => r.id !== businessRule.id,
      ),
    }))

    router.delete(route('business-rule.destroy', businessRule.id), {
      preserveScroll: true,
    })
  }

  return (
    <section className="businessRule flex flex-1 items-center max-w-md md:max-w-4xl gap-1">
      {lastElement ? (
        <CornerDownRight className="text-primary size-5 " />
      ) : (
        <ArrowRight className="text-primary size-5 " />
      )}
      <div
        onMouseEnter={() => !isEditing && setIsHovered(true)}
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
            flex flex-row flex-1 items-start justify-start p-2 gap-2 text-xs font-normal text-foreground bg-card
            border border-border rounded-md shadow-sm transition-opacity duration-300 min-h-16
          `}
        >
          <Badge
            variant="outline"
            className={`border-transparent text-primary-foreground font-bold w-fit cursor-pointer ${selectedVariant.bg}`}
          >
            {`BR${
              isTemporary(businessRule.id) ? '' : businessRule.id
            }`.toUpperCase()}
          </Badge>

          {/* 🎨 RENDERIZAÇÃO CONDICIONAL: MODO DE EDIÇÃO OU VISUALIZAÇÃO */}
          {isEditing ? (
            <div className="w-full flex flex-col items-center gap-2">
              <ReactTextareaAutosize
                id="description"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                className="bg-transparent border-0 w-full rounded text-sm"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSave()
                  if (e.key === 'Escape') handleCancel()
                }}
              />
            </div>
          ) : (
            <p className="text-sm w-full min-h-[32px] flex items-center justify-start">
              {businessRule.title}
            </p>
          )}
        </div>
      </div>
    </section>
  )
}

/**
 * Componente principal que exibe a coluna de "Business Rules".
 * Ele mapeia as estórias do projeto e renderiza um StoryCard para cada uma.
 * @param {{ project: object, setProject: (project: object) => void }} props
 */
const BusinessRules = ({ project, setProject }) => {
  // Memoriza o estado das business_rules
  const businessRulesByStoryId = useMemo(() => {
    if (!project?.business_rules) return new Map()

    return project.business_rules.reduce((acc, businessRule) => {
      const storyId = businessRule.story_id
      if (!acc.has(storyId)) {
        acc.set(storyId, [])
      }
      acc.get(storyId).push(businessRule)
      return acc
    }, new Map())
  }, [project?.business_rules]) // Dependência atualizada

  const addBusinessRule = (storyId) => {
    router.post(route('business-rule.store'), {
      // Rota atualizada
      story_id: storyId,
      project_id: project.id,
      title: 'Nova Business Rule', // Texto atualizado
    })

    setProject((prevProject) => ({
      ...prevProject,
      // Adiciona na lista de business_rules
      business_rules: [
        ...prevProject.business_rules,
        {
          story_id: storyId,
          project_id: project.id,
          title: 'Nova Business Rule', // Texto atualizado
          id: `temp-${new Date().getTime()}`, // Usei getTime() para maior unicidade
        },
      ],
    }))
  }

  return (
    <section className="p-2 flex flex-col gap-2 ">
      {/* user stories*/}
      {project?.stories
        ?.filter((story) => story.type === 'user')
        .map((story) => {
          const relatedBusinessRules =
            businessRulesByStoryId.get(story.id) || []
          return (
            <section className="py-1 flex gap-1 items-stretch" key={story.id}>
              <StoryCard
                story={story}
                addBusinessRule={() => addBusinessRule(story.id)}
              />

              <div className="flex flex-col gap-1 w-full">
                {[...relatedBusinessRules]
                  .sort((a, b) => a.id - b.id)
                  .map((businessRule, index, array) => (
                    <BusinessRuleCard
                      key={businessRule.id}
                      story={story}
                      businessRule={businessRule}
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
      {/* system stories*/}
      {project?.stories
        ?.filter((story) => story.type === 'system')
        .map((story) => {
          const relatedBusinessRules =
            businessRulesByStoryId.get(story.id) || []
          return (
            <section className="py-1 flex gap-1 items-stretch" key={story.id}>
              <StoryCard
                story={story}
                addBusinessRule={() => addBusinessRule(story.id)}
              />

              <div className="flex flex-col gap-1 w-full">
                {[...relatedBusinessRules]
                  .sort((a, b) => a.id - b.id)
                  .map((businessRule, index, array) => (
                    <BusinessRuleCard
                      key={businessRule.id}
                      story={story}
                      businessRule={businessRule}
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
    </section>
  )
}

export default BusinessRules
