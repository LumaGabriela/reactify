import { Head, router } from '@inertiajs/react'
import ProgressIcon from '@/Components/ProgressIcon'
import { ExpandableCard } from './projects/project-ceremonies/Inception/MainView'
import Interview from '@/Components/Interview'
import { tooltipInfo } from '@/lib/projectData'
import {
  Users,
  Target,
  GitBranch,
  List,
  ArrowLeft,
  Clock,
  ArrowRight,
  Calendar as CalendarIcon,
} from 'lucide-react'
import MainLayout from '@/Layouts/MainLayout'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { cn } from '@/lib/utils'

const getDateObject = (dateInput) => {
  if (!dateInput) {
    return undefined
  }
  const dateOnlyString = dateInput.substring(0, 10)
  const date = new Date(`${dateOnlyString}T00:00:00`)

  if (isNaN(date.getTime())) {
    return undefined
  }
  return date
}
const ceremonies = [
  'inception',
  'storyDiscovery',
  'refining',
  'modeling',
  'inspection',
  'productBacklog',
  'sprint',
]

export const CeremonyCard = ({ item, className }) => {
  const [isHovered, setIsHovered] = useState(false)
  const Icon = item?.icon

  return (
    <Card
      className={cn(
        'group relative w-full p-4 overflow-hidden bg-background cursor-pointer',
        'transition-all duration-300 ease-in-out hover:scale-[1.02] hover:shadow-xl',
        className,
      )}
    >
      <div className="flex items-center gap-4">
        {Icon && (
          <div className="flex-shrink-0">
            <Icon className="size-8 text-muted-foreground transition-colors duration-300 group-hover:text-primary" />
          </div>
        )}
        <div className="flex-grow">
          <div className="flex justify-between">
            <h3 className="text-md font-semibold text-foreground">
              {item.title}
            </h3>
            {/* SETA "VER MAIS" */}
            <div
              className="flex items-center gap-1 text-xs text-muted-foreground
                         opacity-0 transition-all duration-300 ease-in-out
                         group-hover:opacity-100 "
            >
              <span>ver mais</span>
              <ArrowRight className="size-3" />
            </div>
          </div>
          {/* DESCRIÇÃO CONDICIONAL */}
          {/* Começa com altura máxima 0 e opacidade 0. */}
          {/* No hover do `group` (o card), a altura e opacidade aumentam. */}
          <div className="overflow-hidden transition-all duration-300 ease-in-out max-h-0 group-hover:max-h-40">
            <p className="pt-1 text-sm text-muted-foreground opacity-0 transition-opacity duration-300 delay-100 group-hover:opacity-100">
              {item.description}
            </p>
          </div>
        </div>
      </div>
      <BorderBeam
        borderWidth={2}
        size={50}
        colorTo={'var(--primary)'}
        colorFrom={'var(--secondary)'}
      />
    </Card>
  )
}

const Dashboard = ({ project, setProject }) => {
  const [date, setDate] = useState(getDateObject(project.due_date))
  const isInitialMount = useRef(true)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    // console.clear();
    if (!date || !project.created_at) {
      console.log(
        'PARADA: A data do deadline ou a data de criação do projeto não existem.',
      )
      setProgress(0)
      return
    }

    const startDate = new Date(project.created_at)
    const endDate = new Date(date)
    const now = new Date()

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      console.error(
        'ERRO CRÍTICO: A `startDate` ou `endDate` é inválida. Não é possível calcular.',
      )
      setProgress(0)
      return
    }
    startDate.setHours(0, 0, 0, 0)
    endDate.setHours(0, 0, 0, 0)
    now.setHours(0, 0, 0, 0)

    const totalDuration = endDate.getTime() - startDate.getTime()
    const elapsedDuration = now.getTime() - startDate.getTime()
    if (totalDuration <= 0) {
      const finalProgress = now.getTime() >= endDate.getTime() ? 100 : 0
      setProgress(finalProgress)
      return
    }

    const progressPercentage =
      (Math.max(0, elapsedDuration) / totalDuration) * 100
    setProgress(progressPercentage)
  }, [date, project.created_at])

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false
      return
    }
    router.patch(
      route('project.update', project.id),
      {
        due_date: date ? date.toISOString().split('T')[0] : null, // Envia a data no formato YYYY-MM-DD
      },
      {
        preserveScroll: true,
        onError: (errors) => {
          console.error('Failed to update deadline:', errors)
        },
      },
    )
  }, [date])

  const updateProject = async (prop, newContent) => {
    router.patch(
      route('project.update', project.id),
      {
        description: newContent,
      },
      {
        onSuccess: () => {
          setProject((prev) => ({
            ...prev,
            description: newContent,
          }))
        },
      },
    )
  }
  return (
    <main className="flex justify-between">
      <Head title="Dashboard" />
      <section className="flex flex-col p-2 w-4/5">
        <Button
          variant="secondary"
          size="icon"
          onClick={() =>
            router.get(
              route('project.ceremony.show', {
                project: project.id,
                ceremony: 'inception',
              }),
            )
          }
        >
          <ArrowLeft />
        </Button>
        <aside className="flex justify-between">
          <section className="flex flex-col items-start text-muted-foreground">
            Progresso da Conclusão
            {date ? (
              <div className="flex items-center">
                <Progress value={progress} className="w-32 h-2 mr-2" />
                <span className="text-sm font-medium">{`${Math.round(progress)}%`}</span>
              </div>
            ) : (
              <div className="text-sm text-muted-foreground italic">
                Defina um prazo de conclusão para visualizar o progresso.
              </div>
            )}
            <div className="flex items-center">
              <Clock size={16} className="mr-3.5" />
              {project.updated_at ? (
                <span>
                  Atualizado:{' '}
                  {format(new Date(project.updated_at), 'dd/MM/yyyy HH:mm', {
                    locale: ptBR,
                  })}
                </span>
              ) : (
                <span>Atualizado: -</span>
              )}
              <span className="mx-2">•</span>
              <span className="rounded-full text-lg font-medium bg-success/20 text-success">
                {project.status.toUpperCase()}
              </span>
            </div>
          </section>
          <section className="flex flex-col items-center gap-2 cursor-pointer select-none">
            <p className="text-muted-foreground text-md m-0">Prazo</p>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={'outline'}
                  className={cn(
                    'w-[160px] justify-start text-left font-normal',
                    !date && 'text-muted-foreground',
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? (
                    format(date, 'dd/MM/yyyy', { locale: ptBR })
                  ) : (
                    <span>Definir prazo</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  disabled={{ before: new Date() }}
                  initialFocus
                  locale={ptBR}
                />
              </PopoverContent>
            </Popover>
          </section>
        </aside>

        {/* Progress Indicators */}
        <div className="grid grid-cols-1 lg:grid-cols-2 w-full gap-4 mb-6">
          <ExpandableCard
            title={project?.title || 'Project'}
            content={project?.description}
            col={1}
            variant="secondary"
            icon={List}
            placeholder="Describe your project..."
            onContentUpdate={(content) => updateProject('description', content)}
          />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 w-full items-center justify-center bg-card p-4 rounded-lg">
            <ProgressIcon
              value={project?.stories?.length || 0}
              max={20}
              colorClass="text-primary"
              label="Stories"
              icon={List}
            />
            <ProgressIcon
              value={project?.personas?.length || 0}
              max={10}
              colorClass="text-destructive"
              label="Personas"
              icon={Users}
            />
            <ProgressIcon
              value={project?.goal_sketches?.length || 0}
              max={15}
              colorClass="text-info"
              label="Goals"
              icon={Target}
            />
            <ProgressIcon
              value={project?.journeys?.length || 0}
              max={10}
              colorClass="text-accent"
              label="Journeys"
              icon={GitBranch}
            />
          </div>

          <Interview
            className="col-span-2"
            projectId={project.id}
            interviews={project.interviews || []} // Passe a lista de entrevistas do seu projeto
          />
        </div>
      </section>
      <aside className="ceremonies flex flex-col items-center w-1/5 bg-card gap-2 p-2">
        <span>Ceremonies</span>
        {ceremonies.map((ceremony) => (
          <CeremonyCard
            key={ceremony}
            item={tooltipInfo[ceremony]}
            className="flex flex-col p-2"
          />
        ))}
      </aside>
    </main>
  )
}

Dashboard.layout = (page) => {
  return <MainLayout>{page}</MainLayout>
}

export default Dashboard
