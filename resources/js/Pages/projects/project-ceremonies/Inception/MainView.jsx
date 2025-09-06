import React, { useState, useEffect, useRef } from 'react'
import {
  AlertCircle,
  Users,
  Slash,
  Check,
  Clock,
  CheckCircle,
  Target,
  GitBranch,
  List,
  ChevronDown,
  ChevronUp,
  PenLine as EditIcon,
  X,
  Save,
  Calendar as CalendarIcon,
} from 'lucide-react'
import ProgressIcon from '@/Components/ProgressIcon'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { cn } from '@/lib/utils'
import TextareaAutosize from 'react-textarea-autosize'
import { router } from '@inertiajs/react'
import { Progress } from '@/components/ui/progress'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'


const cardVariants = {
  primary: 'border-t-primary text-primary',
  destructive: 'border-t-destructive text-destructive',
  warning: 'border-t-yellow-500 text-yellow-500',
  success: 'border-t-success text-success',
  info: 'border-t-cyan-500 text-cyan-500',
  secondary: 'border-t-secondary text-secondary w-1/2',
  accent: 'border-t-accent text-accent',
  main: '',
}

const ExpandableCard = ({
  title,
  content,
  variant = 'primary',
  icon: IconComponent = CheckCircle,
  col = 1,
  onContentUpdate,
  placeholder = 'Click to add content...',
}) => {
  const [expanded, setExpanded] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editableContent, setEditableContent] = useState(content || '')
  const [isHovered, setIsHovered] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const textareaRef = useRef(null)

  useEffect(() => {
    setEditableContent(content || '')
  }, [content])

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus()
      const length = editableContent.length
      textareaRef.current.setSelectionRange(length, length)
    }
  }, [isEditing])

  const handleSave = async () => {
    if (editableContent.trim() === (content || '').trim()) {
      setIsEditing(false)
      return
    }
    setIsSaving(true)
    try {
      await onContentUpdate(editableContent.trim())
      setIsEditing(false)
    } catch (error) {
      console.error('Error saving:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    setEditableContent(content || '')
    setIsEditing(false)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') handleCancel()
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault()
      handleSave()
    }
  }

  const needsExpansion = typeof content === 'string' && content.length > 150
  const hasContent = content && content.trim().length > 0
  const variantClasses = cardVariants[variant] || cardVariants.primary

  return (
    <div
      className={cn(
        'bg-card rounded-lg border-t-4 transition-all duration-300 shadow-lg hover:shadow-xl h-full',
        col === 2 ? 'col-span-2' : '',
        expanded ? 'row-span-2' : '',
        isEditing ? 'ring-2 ring-ring' : '',
        variantClasses.split(' ')[0],
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="p-4 h-full flex flex-col">
        {/* Card Header */}
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center">
            <IconComponent
              size={20}
              className={cn('mr-2 flex-shrink-0', variantClasses.split(' ')[1])}
            />
            <h3 className="text-card-foreground font-bold text-lg m-0 truncate">
              {title}
            </h3>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {isEditing ? (
              <>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="text-success hover:text-success/90 transition-colors disabled:opacity-50"
                  title="Save (Ctrl+Enter)"
                >
                  <Save size={16} className={isSaving ? 'animate-pulse' : ''} />
                </button>
                <button
                  onClick={handleCancel}
                  disabled={isSaving}
                  className="text-destructive hover:text-destructive/90 transition-colors disabled:opacity-50"
                  title="Cancel (Esc)"
                >
                  <X size={16} />
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className={cn(
                  'text-muted-foreground hover:text-foreground transition-colors',
                  isHovered || !hasContent ? 'opacity-100' : 'opacity-0',
                )}
                title="Edit content"
              >
                <EditIcon size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Card Content */}
        <div className="flex-1 flex flex-col min-h-0">
          <div className="text-muted-foreground text-sm transition-all duration-300 flex-1">
            {isEditing ? (
              <div className="h-full">
                <TextareaAutosize
                  ref={textareaRef}
                  value={editableContent}
                  onChange={(e) => setEditableContent(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={placeholder}
                  className="w-full resize-none bg-background text-foreground rounded-md p-3 border border-border focus:border-primary focus:outline-none focus:ring-1 focus:ring-ring transition-colors"
                  disabled={isSaving}
                />
                <div className="text-xs text-muted-foreground/80 mt-2">
                  Ctrl+Enter to save • Esc to cancel
                </div>
              </div>
            ) : (
              <>
                {hasContent ? (
                  <div
                    className={cn(
                      'whitespace-pre-wrap break-words leading-relaxed',
                      !expanded && needsExpansion && 'overflow-hidden',
                    )}
                    style={{
                      display: '-webkit-box',
                      WebkitLineClamp: !expanded && needsExpansion ? 4 : 'none',
                      WebkitBoxOrient: 'vertical',
                      overflow:
                        !expanded && needsExpansion ? 'hidden' : 'visible',
                    }}
                  >
                    {content}
                  </div>
                ) : (
                  <div
                    className="text-muted-foreground italic cursor-pointer hover:text-foreground/80 transition-colors py-8 text-center border-2 border-dashed border-border hover:border-border/80 rounded-lg"
                    onClick={() => setIsEditing(true)}
                  >
                    {placeholder}
                  </div>
                )}
              </>
            )}
          </div>

          {/* Expand Button */}
          {!isEditing && hasContent && needsExpansion && (
            <div className="mt-3 pt-2 border-t border-border">
              <button
                onClick={() => setExpanded(!expanded)}
                className="text-xs text-muted-foreground hover:text-foreground flex items-center justify-end w-full transition-colors"
              >
                {!expanded ? (
                  <>
                    Show more <ChevronDown size={14} className="ml-1" />
                  </>
                ) : (
                  <>
                    Show less <ChevronUp size={14} className="ml-1" />
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const getDateObject = (dateInput) => {
  if (!dateInput) {
    return undefined;
  }
  const dateOnlyString = dateInput.substring(0, 10);
  const date = new Date(`${dateOnlyString}T00:00:00`);

  if (isNaN(date.getTime())) {
    return undefined;
  }
  return date;
};

const MainView = ({ project = {}, setProject }) => {
  const [date, setDate] = useState(getDateObject(project.due_date));
  const isInitialMount = useRef(true);
  const [progress, setProgress] = useState(0);

 useEffect(() => {
    // console.clear();
    if (!date || !project.created_at) {
      console.log("PARADA: A data do deadline ou a data de criação do projeto não existem.");
      setProgress(0);
      return;
    }
    // console.log("VALORES DE ENTRADA:");
    // console.log("-> `date` (do estado):", date);
    // console.log("-> `project.created_at` (do backend):", project.created_at);
    const startDate = new Date(project.created_at);
    const endDate = new Date(date);
    const now = new Date();

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      console.error("ERRO CRÍTICO: A `startDate` ou `endDate` é inválida. Não é possível calcular.");
      setProgress(0);
      return;
    }
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(0, 0, 0, 0);
    now.setHours(0, 0, 0, 0);

    //console.log("\nDATAS PROCESSADAS (sem horas):");
    // console.log("-> Start Date:", startDate.toString());
    // console.log("-> End Date:  ", endDate.toString());
    // console.log("-> Now:       ", now.toString());
    const totalDuration = endDate.getTime() - startDate.getTime();
    const elapsedDuration = now.getTime() - startDate.getTime();
    //console.log("-> Duração Total (Fim - Início):", totalDuration);
    //console.log("-> Duração Decorrida (Hoje - Início):", elapsedDuration);
    if (totalDuration <= 0) {
      const finalProgress = now.getTime() >= endDate.getTime() ? 100 : 0;
      //console.log("-> Progresso Final:", finalProgress);
      setProgress(finalProgress);
      return;
    }

    const progressPercentage = (Math.max(0, elapsedDuration) / totalDuration) * 100;
    setProgress(progressPercentage);
  }, [date, project.created_at]);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    router.patch(
      route('project.update', project.id),
      {
        due_date: date ? date.toISOString().split('T')[0] : null, // Envia a data no formato YYYY-MM-DD
      },
      {
        preserveScroll: true,
        onError: (errors) => {
          console.error('Failed to update deadline:', errors);
        }
      },
    );
  }, [date]);


  const updateProductCanvas = async (prop, newContent) => {
    const productCanvasId = project.product_canvas.id
    if (!productCanvasId) return

    router.patch(
      route('product-canvas.update', productCanvasId),
      {
        [prop]: newContent,
      },
      {
        onSuccess: () => {
          setProject((prev) => ({
            ...prev,
            product_canvas: { ...prev.product_canvas, [prop]: newContent },
          }))
        },
      },
    )
  }

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
    <div className="w-full text-foreground p-4">
      {/* Dashboard Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <div className='mt-2'>
            <div className="flex items-center text-muted-foreground">
              <Clock size={16} className="mr-3.5" />
              {project.updated_at ? (
                <span>
                  Atualizado: {format(new Date(project.updated_at), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                </span>
              ) : (
                <span>Atualizado: -</span>
              )}
              <span className="mx-2 ml-3.5">•</span>
              <span className="px-3 py-1 rounded-full text-xl font-medium bg-success/20 text-success">
                {project.status}
              </span>
            </div>

            <div className="text-left mt-2">
              <div className="text-muted-foreground text-xl mb-1">
                Progresso da Conclusão 
              </div>
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
            </div>
          </div>

          <div className="flex flex-col items-center gap-2 cursor-pointer select-none">
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
          </div>
        </div>
      </div>

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
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 w-full items-center justify-center bg-card p-4 rounded-lg">
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
      </div>

      {/* Main Dashboard - Responsive Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ExpandableCard
          title="Problems"
          content={project?.product_canvas?.issues}
          variant="destructive"
          icon={AlertCircle}
          placeholder="What problems does this project solve?"
          onContentUpdate={(content) => updateProductCanvas('issues', content)}
        />
        <ExpandableCard
          title="Solutions"
          content={project?.product_canvas?.solutions}
          variant="warning"
          icon={CheckCircle}
          placeholder="How does the project solve the problems?"
          onContentUpdate={(content) =>
            updateProductCanvas('solutions', content)
          }
        />
        <ExpandableCard
          title="Involved Personas"
          content={project?.product_canvas?.personas}
          variant="success"
          icon={Users}
          placeholder="Who are the main users?"
          onContentUpdate={(content) =>
            updateProductCanvas('personas', content)
          }
        />
        <ExpandableCard
          title="Restrictions"
          content={project?.product_canvas?.restrictions}
          variant="accent"
          icon={Slash}
          placeholder="What are the project's limitations?"
          onContentUpdate={(content) =>
            updateProductCanvas('restrictions', content)
          }
        />
        <ExpandableCard
          title="Is"
          content={project?.product_canvas?.product_is}
          variant="info"
          icon={Check}
          placeholder="What this product IS..."
          onContentUpdate={(content) =>
            updateProductCanvas('product_is', content)
          }
        />
        <ExpandableCard
          title="Is Not"
          content={project?.product_canvas?.product_is_not}
          variant="secondary"
          icon={X}
          placeholder="What this product IS NOT..."
          onContentUpdate={(content) =>
            updateProductCanvas('product_is_not', content)
          }
        />

      </div>
    </div>
  )
}

export default MainView
