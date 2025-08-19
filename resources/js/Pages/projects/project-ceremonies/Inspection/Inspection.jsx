import {
  ArrowRight,
  CornerDownRight,
  X,
  Check,
  LoaderCircle,
} from 'lucide-react'
import MotionDivOptions from '@/Components/MotionDivOptions'
import { storyVariants } from '../StoryDiscovery/Stories'
import { router } from '@inertiajs/react'
import { isTemporary } from '@/lib/utils'
import InfoButton from '@/Components/InfoButton'
import { tooltipInfo } from '@/lib/projectData'

/**
 * Componente para renderizar um único card de estória.
 * A prop de adição foi atualizada para refletir a nova entidade.
 * @param {{ story: object, addInvestCard: () => void }} props
 */
const StoryCard = ({ story, addInvestCard }) => {
  const selectedVariant = storyVariants[story.type] || storyVariants.user

  return (
    <div className="relative group">
      {/* <MotionDivOptions isHovered={true} onAdd={addInvestCard} />*/}

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

const InvestCard = ({ investCard, lastElement = false, setProject }) => {
  const [isHovered, setIsHovered] = useState(false)
  const [investState, setInvestState] = useState({
    independent: investCard.independent,
    negotiable: investCard.negotiable, // Corrigi o typo de 'negociable' para 'negotiable'
    valuable: investCard.valuable,
    estimable: investCard.estimable,
    small: investCard.small,
    testable: investCard.testable,
  })

  // Lista de critérios para renderização dinâmica
  const investOptions = [
    'independent',
    'negotiable',
    'valuable',
    'estimable',
    'small',
    'testable',
  ]

  // Sincroniza o estado interno se a prop externa mudar
  useEffect(() => {
    setInvestState({
      independent: investCard.independent,
      negotiable: investCard.negotiable,
      valuable: investCard.valuable,
      estimable: investCard.estimable,
      small: investCard.small,
      testable: investCard.testable,
    })
  }, [investCard])

  /**
   * Função para lidar com a mudança de valor e salvar automaticamente.
   * @param {string} field O campo que está sendo alterado (ex: 'independent')
   * @param {string} value O novo valor ('true', 'false', ou 'null')
   */
  const handleValueChange = (field, value) => {
    const parsedValue = value === 'null' ? null : value === 'true'
    if (isTemporary(investCard.id)) return
    // 1. Atualização Otimista do Estado Local
    setInvestState((prevState) => ({
      ...prevState,
      [field]: parsedValue,
    }))

    // Atualiza o estado global do projeto também
    setProject((project) => ({
      ...project,
      invest_cards: project.invest_cards.map((card) => {
        if (card.id === investCard.id) {
          return { ...card, [field]: parsedValue }
        }
        return card
      }),
    }))

    // 2. Envia a requisição PATCH para o backend com apenas o campo alterado
    router.patch(
      route('invest-card.update', investCard.id),
      {
        [field]: parsedValue, // Payload dinâmico: { independent: true }
      },
      {
        preserveState: true, // Mantém o estado do React
        preserveScroll: true, // Mantém a posição do scroll
      },
    )
  }

  const handleDelete = () => {
    if (isTemporary(investCard.id)) return
    setProject((project) => ({
      ...project,
      invest_cards: project.invest_cards.filter((c) => c.id !== investCard.id),
    }))

    router.delete(route('invest-card.destroy', investCard.id), {
      preserveScroll: true,
    })
  }

  return (
    <section
      // onMouseEnter={() => setIsHovered(true)}
      // onMouseLeave={() => setIsHovered(false)}
      className="investCard flex flex-1 items-center max-w-lg gap-2"
    >
      {lastElement ? (
        <CornerDownRight className="text-border size-5 shrink-0" />
      ) : (
        <ArrowRight className="text-border size-5 shrink-0" />
      )}
      <div className="relative group w-full">
        {/* {!isTemporary(investCard.id) && (
          <MotionDivOptions
            isHovered={isHovered} // Sempre visível para facilitar acesso
            onDelete={handleDelete}
          />
        )}*/}

        <div className="flex flex-col flex-1 p-3 gap-3 text-sm font-normal text-foreground bg-card border border-border rounded-md shadow-sm">
          {/* Cabeçalho */}
          <div className="grid grid-cols-[1fr_auto_auto_auto] items-center gap-x-4">
            <h3 className="font-bold uppercase text-foreground">Check Card</h3>
            {isTemporary(investCard.id) && (
              <LoaderCircle className="animate-spin text-foreground" />
            )}
            <span className="font-semibold text-xs text-muted-foreground">
              SIM
            </span>
            <span className="font-semibold text-xs text-muted-foreground">
              NÃO
            </span>
            <span className="font-semibold text-xs text-muted-foreground">
              N/A
            </span>
          </div>

          {/* Linhas de Opções (renderizadas dinamicamente) */}
          {investOptions.map((option) => (
            <div
              key={option}
              className="grid grid-cols-[1fr_auto_auto_auto] items-center gap-x-4"
            >
              <Label htmlFor={option} className="uppercase font-medium text-xs">
                {option}
              </Label>
              <RadioGroup
                id={option}
                value={String(investState[option])} // O valor precisa ser string
                onValueChange={(value) => handleValueChange(option, value)}
                className="flex items-center col-span-3 justify-self-end gap-4"
              >
                <RadioGroupItem value="true" id={`${option}-yes`} />
                <RadioGroupItem value="false" id={`${option}-no`} />
                <RadioGroupItem value="null" id={`${option}-na`} />
              </RadioGroup>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

const Inspection = ({ project, setProject }) => {
  const investCardsByStoryId = useMemo(() => {
    if (!project?.invest_cards) return new Map()

    return project.invest_cards.reduce((acc, investCard) => {
      const storyId = investCard.story_id
      if (!acc.has(storyId)) {
        acc.set(storyId, [])
      }
      acc.get(storyId).push(investCard)
      return acc
    }, new Map())
  }, [project?.invest_cards])

  const addInvestCard = (storyId) => {
    let cardExists = false
    setProject((prevProject) => {
      cardExists = prevProject.invest_cards.some(
        (card) => card.story_id === storyId,
      )
      return prevProject
    })

    router.post(route('invest-card.store'), {
      story_id: storyId,
      project_id: project.id,
    })

    if (!cardExists) {
      setProject((prevProject) => ({
        ...prevProject,
        invest_cards: [
          ...prevProject.invest_cards,
          {
            story_id: storyId,
            project_id: project.id,
            independent: false,
            negotiable: false,
            valuable: false,
            estimable: false,
            small: false,
            testable: false,
            id: `temp-${new Date().getTime()}`,
          },
        ],
      }))
    }
  }

  return (
    <section className="p-2 flex flex-col gap-2 items-center justify-evenly">
      <div className="flex w-full">
        <InfoButton data={tooltipInfo.inspection} />
      </div>
      <div className="flex gap-1 justify-around w-full max-w-5xl">
        <section className="flex flex-col gap-1">
          {project?.stories
            ?.filter((story) => story.type === 'system')
            .map((story) => {
              const relatedInvestCards =
                investCardsByStoryId.get(story.id) || []
              return (
                <section
                  className="py-1 flex gap-1 items-stretch  min-h-52"
                  key={story.id}
                >
                  <StoryCard
                    story={story}
                    // addInvestCard={() => addInvestCard(story.id)}
                  />

                  <div className="flex flex-col gap-1 ">
                    {[...relatedInvestCards]
                      .sort((a, b) => a.id - b.id)
                      .map((investCard, index, array) => (
                        <InvestCard
                          key={investCard.id}
                          story={story}
                          investCard={investCard}
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
        <section className="flex flex-col gap-1">
          {project?.stories
            ?.filter((story) => story.type === 'user')
            .map((story) => {
              const relatedInvestCards =
                investCardsByStoryId.get(story.id) || []
              return (
                <section
                  className="py-1 flex gap-1 items-stretch"
                  key={story.id}
                >
                  <StoryCard
                    story={story}
                    addInvestCard={() => addInvestCard(story.id)}
                  />

                  <div className="flex flex-col gap-1 ">
                    {[...relatedInvestCards]
                      .sort((a, b) => a.id - b.id)
                      .map((investCard, index, array) => (
                        <InvestCard
                          key={investCard.id}
                          story={story}
                          investCard={investCard}
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
      </div>
    </section>
  )
}

export default Inspection
