import React, { useState, useEffect, useRef } from "react"
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
} from "lucide-react"
import TextArea from "@/Components/TextArea"
import ProgressIcon from "../../Components/ProgressIcon"
import { router } from "@inertiajs/react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

// Card com capacidade de expansão e contração melhorado
const ExpandableCard = ({
  title,
  content,
  color = "#6366f1",
  icon: IconComponent = CheckCircle,
  col = 1,
  onContentUpdate,
  placeholder = "Clique para adicionar conteúdo..."
}) => {
  const [expanded, setExpanded] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editableContent, setEditableContent] = useState(content || "")
  const [isHovered, setIsHovered] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const textareaRef = useRef(null)

  // Atualiza o conteúdo editável quando o prop content muda
  useEffect(() => {
    setEditableContent(content || "")
  }, [content])

  // Auto-focus no textarea quando entra em modo de edição
  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus()
      // Posiciona o cursor no final do texto
      const length = editableContent.length
      textareaRef.current.setSelectionRange(length, length)
    }
  }, [isEditing])

  const handleSave = async () => {
    if (editableContent.trim() === (content || "").trim()) {
      setIsEditing(false)
      return
    }

    setIsSaving(true)
    try {
      await onContentUpdate(editableContent.trim())
      setIsEditing(false)
    } catch (error) {
      console.error("Erro ao salvar:", error)
      // Mantém o modo de edição em caso de erro
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    setEditableContent(content || "")
    setIsEditing(false)
  }

  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      handleCancel()
    } else if (e.key === "Enter") {
      e.preventDefault()
      handleSave()
    }
  }

  // Verifica se o conteúdo é longo o suficiente para precisar de expansão
  const needsExpansion = typeof content === "string" && content.length > 150
  const hasContent = content && content.trim().length > 0

  return (
    <div
      className={`bg-gray-800 rounded-lg border-t-4 transition-all duration-300 shadow-lg hover:shadow-xl ${
        col === 2 ? "col-span-2" : ""
      } ${expanded ? "row-span-2" : ""} ${
        isEditing ? "ring-2 ring-blue-500 ring-opacity-50" : ""
      }`}
      style={{ borderColor: color }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="p-4 h-full flex flex-col">
        {/* Header do card */}
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center">
            <IconComponent
              size={20}
              color={color}
              className="mr-2 flex-shrink-0"
            />
            <h3 className="text-white font-bold text-lg m-0 truncate">{title}</h3>
          </div>
          
          {/* Botões de ação */}
          <div className="flex items-center gap-2">
            {isEditing ? (
              <>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="text-green-400 hover:text-green-300 transition-colors disabled:opacity-50"
                  title="Salvar (Ctrl+Enter)"
                >
                  <Save size={16} className={isSaving ? "animate-pulse" : ""} />
                </button>
                <button
                  onClick={handleCancel}
                  disabled={isSaving}
                  className="text-red-400 hover:text-red-300 transition-colors disabled:opacity-50"
                  title="Cancelar (Esc)"
                >
                  <X size={16} />
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className={`text-gray-400 hover:text-white transition-colors ${
                  isHovered || !hasContent ? "opacity-100" : "opacity-0"
                }`}
                title="Editar conteúdo"
              >
                <EditIcon size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Conteúdo do card */}
        <div className="flex-1 flex flex-col min-h-0">
          <div className="text-gray-300 text-sm transition-all duration-300 flex-1">
            {isEditing ? (
              <div className="h-full min-h-32">
                <textarea
                  ref={textareaRef}
                  value={editableContent}
                  onChange={(e) => setEditableContent(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={placeholder}
                  className="w-full h-full resize-none bg-gray-700 text-white rounded-md p-3 border border-gray-600 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
                  disabled={isSaving}
                />
                <div className="text-xs text-gray-400 mt-2">
                  Ctrl+Enter para salvar • Esc para cancelar
                </div>
              </div>
            ) : (
              <>
                {hasContent ? (
                  <div
                    className={`whitespace-pre-wrap break-words leading-relaxed ${
                      !expanded && needsExpansion ? "overflow-hidden" : ""
                    }`}
                    style={{
                      display: "-webkit-box",
                      WebkitLineClamp: !expanded && needsExpansion ? 4 : "none",
                      WebkitBoxOrient: "vertical",
                      overflow: !expanded && needsExpansion ? "hidden" : "visible",
                    }}
                  >
                    {content}
                  </div>
                ) : (
                  <div
                    className="text-gray-500 italic cursor-pointer hover:text-gray-400 transition-colors py-8 text-center border-2 border-dashed border-gray-600 rounded-lg hover:border-gray-500"
                    onClick={() => setIsEditing(true)}
                  >
                    {placeholder}
                  </div>
                )}
              </>
            )}
          </div>

          {/* Botão de expansão */}
          {!isEditing && hasContent && needsExpansion && (
            <div className="mt-3 pt-2 border-t border-gray-700">
              <button
                onClick={() => setExpanded(!expanded)}
                className="text-xs text-gray-400 hover:text-gray-200 flex items-center justify-end w-full transition-colors"
              >
                {!expanded ? (
                  <>
                    Mostrar mais <ChevronDown size={14} className="ml-1" />
                  </>
                ) : (
                  <>
                    Mostrar menos <ChevronUp size={14} className="ml-1" />
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

const MainView = ({ project = {}, setProject }) => {
  const [productCanvas, setProductCanvas] = useState(
    project?.product_canvas || {}
  )
  const [colors] = useState({
    red: "#f43f5e",
    blue: "#6366f1",
    cyan: "#06b6d4",
    green: "#22c55e",
    yellow: "#f59e0b",
    gray: "#6b7280",
    purple: "#8b5cf6",
    turquoise: "#14b8a6",
  })

  const [date, setDate] = useState()

  // Função para atualizar o conteúdo de um card específico
  const updateProductCanvas = async (prop, newContent) => {
    const updatedProductCanvas = { ...productCanvas }
    updatedProductCanvas[prop] = newContent

    setProductCanvas(updatedProductCanvas)
    setProject({ ...project, product_canvas: updatedProductCanvas })

    try {
      await router.patch(route("product-canvas.update", productCanvas.id), {
        [prop]: newContent,
      })
    } catch (error) {
      console.error("Erro ao atualizar product canvas:", error)
      throw error
    }
  }

  const updateProject = async (prop, content) => {
    if (!project) {
      console.error("Project object is not defined")
      return
    }

    if (!Object.prototype.hasOwnProperty.call(project, prop)) {
      console.error(`Property '${prop}' does not exist on project object`)
      return
    }

    setProject({ ...project, [prop]: content })

    try {
      await router.patch(route("project.update", project.id), { [prop]: content })
    } catch (error) {
      console.error("Erro ao atualizar projeto:", error)
      throw error
    }
  }

  return (
    <div className="w-full text-white p-4">
      {/* Cabeçalho do dashboard */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <div className="flex items-center text-gray-400">
              <Clock size={16} className="mr-1" />
              <span>Atualizado: {new Date().toLocaleDateString()}</span>
              <span className="mx-2">•</span>
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Ativo
              </span>
            </div>
            <div className="text-left mt-2">
              <div className="text-gray-400 text-sm mb-1">Conclusão</div>
              <div className="flex items-center">
                <div className="w-32 h-2 bg-gray-700 rounded-full mr-2">
                  <div
                    className="h-2 bg-green-500 rounded-full transition-all duration-500"
                    style={{ width: "68%" }}
                  />
                </div>
                <span className="text-sm font-medium">68%</span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col items-center gap-2 cursor-pointer select-none">
            <p className="text-gray-400 text-md m-0">Data de entrega:</p>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-44 justify-start text-left font-normal bg-gray-800 text-white hover:bg-gray-700 border-gray-600",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Definir prazo</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                  className="bg-gray-800 text-white"
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>

      {/* Indicadores de progresso */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6 items-center justify-center bg-gray-800 p-4 rounded-lg">
        <ProgressIcon
          value={project?.stories?.length || 0}
          max={20}
          color={colors.blue}
          label="Stories"
          icon={List}
        />
        <ProgressIcon
          value={project?.personas?.length || 0}
          max={10}
          color={colors.red}
          label="Personas"
          icon={Users}
        />
        <ProgressIcon
          value={project?.goalSketches?.length || 0}
          max={15}
          color={colors.cyan}
          label="Goals"
          icon={Target}
        />
        <ProgressIcon
          value={project?.journeys?.length || 0}
          max={10}
          color={colors.turquoise}
          label="Journeys"
          icon={GitBranch}
        />
      </div>

      {/* Dashboard principal - Layout de grid responsivo */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {/* Cards de informação */}
        <ExpandableCard
          title={project?.title || "Projeto"}
          content={project?.description}
          col={2}
          color={colors.blue}
          icon={List}
          placeholder="Descreva o seu projeto..."
          onContentUpdate={(content) => updateProject("description", content)}
        />
        
        <ExpandableCard
          title="Problemas"
          content={productCanvas.issues}
          color={colors.red}
          icon={AlertCircle}
          placeholder="Quais problemas este projeto resolve?"
          onContentUpdate={(content) => updateProductCanvas("issues", content)}
        />
        
        <ExpandableCard
          title="Soluções"
          content={productCanvas.solutions}
          color={colors.green}
          icon={CheckCircle}
          placeholder="Como o projeto resolve os problemas?"
          onContentUpdate={(content) => updateProductCanvas("solutions", content)}
        />
        
        <ExpandableCard
          title="Personas Envolvidas"
          content={productCanvas.personas}
          color={colors.cyan}
          icon={Users}
          placeholder="Quem são os usuários principais?"
          onContentUpdate={(content) => updateProductCanvas("personas", content)}
        />
        
        <ExpandableCard
          title="Restrições"
          content={productCanvas.restrictions}
          color={colors.yellow}
          icon={Slash}
          placeholder="Quais são as limitações do projeto?"
          onContentUpdate={(content) => updateProductCanvas("restrictions", content)}
        />
        
        <ExpandableCard
          title="É"
          content={productCanvas.product_is}
          color={colors.turquoise}
          icon={Check}
          placeholder="O que este produto É..."
          onContentUpdate={(content) => updateProductCanvas("product_is", content)}
        />
        
        <ExpandableCard
          title="Não É"
          content={productCanvas.product_is_not}
          color={colors.purple}
          icon={X}
          placeholder="O que este produto NÃO É..."
          onContentUpdate={(content) => updateProductCanvas("product_is_not", content)}
        />
      </div>
    </div>
  )
}

export default MainView