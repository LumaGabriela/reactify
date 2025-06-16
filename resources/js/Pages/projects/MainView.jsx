import React, { useState } from "react"
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
} from "lucide-react"
import TextArea from "@/Components/TextArea"
import ProgressIcon from "../../Components/ProgressIcon"
import { router } from "@inertiajs/react"
import { format, set } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
// Card com capacidade de expansão e contração
const ExpandableCard = ({
  title,
  content,
  color = "#6366f1",
  icon: IconComponent = CheckCircle,
  col = 1,
  onContentUpdate,
}) => {
  const [expanded, setExpanded] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editableContent, setEditableContent] = useState(content)
  const [isHovered, setIsHovered] = useState(false)

  const handleSave = () => {
    onContentUpdate(editableContent)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditableContent(content)
    setIsEditing(false)
  }

  // Verifica se o conteúdo é longo o suficiente para precisar de expansão
  const needsExpansion = typeof content === "string" && content.length > 150

  return (
    <div
      className={`bg-gray-800 rounded-lg border-t-4 transition-all duration-300 shadow-lg hover:shadow-xl cursor-default ${
        col === 2 ? "col-span-2" : ""
      } ${expanded ? "row-span-2" : ""}`}
      style={{ borderColor: color }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="p-4 h-full flex flex-col">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center">
            <IconComponent
              size={20}
              color={color}
              className="mr-2"
            />
            <h3 className="text-white font-bold text-lg m-0">{title}</h3>
          </div>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="text-gray-400 hover:text-white transition-colors"
              title="Editar conteúdo"
            >
              <EditIcon size={20} />
            </button>
          )}
          {isEditing && (
            <button
              onClick={handleCancel}
              className="text-gray-400 hover:text-white transition-colors"
              title="Cancelar edição"
            >
              <X size={20} />
            </button>
          )}
        </div>

        <div className="flex-1 flex flex-col">
          <div className="text-gray-300 text-sm transition-all duration-300 flex-1">
            {isEditing ? (
              <div className="h-32">
                <TextArea
                  value={editableContent}
                  onChange={(e) => setEditableContent(e.target.value)}
                  onEnter={handleSave}
                  className="w-full h-full resize-none"
                />
              </div>
            ) : (
              <div
                className={`whitespace-pre-wrap break-words ${
                  !expanded && needsExpansion ? "overflow-hidden" : ""
                }`}
                style={{
                  display: "-webkit-box",
                  WebkitLineClamp: !expanded && needsExpansion ? 3 : "none",
                  WebkitBoxOrient: "vertical",
                  overflow: !expanded && needsExpansion ? "hidden" : "visible",
                }}
              >
                {content || "Conteúdo do card"}
              </div>
            )}
          </div>

          {!isEditing && needsExpansion && (
            <div className="mt-3 pt-2 ">
              {!expanded ? (
                <button
                  onClick={() => setExpanded(true)}
                  className="text-xs text-gray-400 hover:text-gray-200 flex items-center justify-end w-full transition-colors"
                >
                  Mostrar mais{" "}
                  <ChevronDown
                    size={14}
                    className="ml-1"
                  />
                </button>
              ) : (
                <button
                  onClick={() => setExpanded(false)}
                  className="text-xs text-gray-400 hover:text-gray-200 flex items-center justify-end w-full transition-colors"
                >
                  Mostrar menos{" "}
                  <ChevronUp
                    size={14}
                    className="ml-1"
                  />
                </button>
              )}
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
  const updateProductCanvas = (prop, newContent) => {
    const updatedProductCanvas = { ...productCanvas }
    updatedProductCanvas[prop] = newContent

    setProductCanvas(updatedProductCanvas)

    setProject({ ...project, product_canvas: updatedProductCanvas })

    router.patch(route("product-canvas.update", productCanvas.id), {
      [prop]: newContent,
    })
  }

  const updateProject = (prop, content) => {
    if (!project) {
      console.error("Project object is not defined")
      return
    }

    if (!Object.prototype.hasOwnProperty.call(project, prop)) {
      console.error(`Property '${prop}' does not exist on project object`)
      return
    }
    console.log(prop, content)
    setProject({ ...project, [prop]: content })

    router.patch(route("project.update", project.id), { [prop]: content })
  }
  return (
    <div className=" w-full text-white p-4">
      {/* Cabeçalho do dashboard */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <div className="flex items-center text-gray-400">
              <Clock
                size={16}
                className="mr-1"
              />
              <span>Atualizado: {new Date().toLocaleDateString()}</span>
              <span className="mx-2">•</span>
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Ativo
              </span>
            </div>
            <div className="text-left">
              <div className="text-gray-400 text-sm mb-1">Conclusão</div>
              <div className="flex items-center">
                <div className="w-32 h-2 bg-gray-700 rounded-full mr-2">
                  <div
                    className="h-2 bg-green-500 rounded-full"
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
                    "w-44 justify-start text-left font-normal bg-gray-800 text-white hover:bg-gray-700",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Prazo</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  animate
                  mode="single"
                  captionLayout="dropdown"
                  fromYear={2021}
                  toYear={2030}
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                  classNames={{
                    root: "bg-gray-800 text-white hover:bg-gray-700 transition-colors duration-300",
                    caption_dropdowns: "flex gap-2 justify-center items-center",
                    caption_label: "hidden",
                    dropdown: cn(
                      "bg-gray-900 text-white border-gray-600 rounded-md p-1",
                      "focus:outline-none focus:ring-2 focus:ring-gray-600",
                      "hover:bg-gray-700"
                    ),
                    dropdown_month: "",
                    dropdown_year: "",
                    cell: cn(),
                    day: cn(
                      "h-9 w-9 p-0 font-normal rounded-xl",
                      "text-white hover:bg-gray-800",
                      "aria-selected:bg-blue-800 aria-selected:text-white transition-colors duration-300 "
                    ),
                    day_today: "bg-gray-600 text-white",
                    day_selected:
                      "border-2 border-sky-700 text-white rounded-xl",
                    day_disabled: "text-gray-400 opacity-50",
                  }}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>

      {/* Indicadores de progresso */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4 items-center justify-center bg-gray-800 p-4 rounded-lg">
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
        {/* Cards de informação */}
        <ExpandableCard
          title={project?.title || "Projeto"}
          content={project?.description || "Descrição do projeto"}
          col={2}
          color={colors.blue}
          icon={List}
          onContentUpdate={(content) => updateProject("description", content)}
        />
        <ExpandableCard
          title="Problemas"
          content={productCanvas.issues}
          color={colors.red}
          icon={AlertCircle}
          onContentUpdate={(content) => updateProductCanvas("issues", content)}
        />
        <ExpandableCard
          title="Soluções"
          content={productCanvas.solutions}
          color={colors.red}
          icon={CheckCircle}
          onContentUpdate={(content) =>
            updateProductCanvas("solutions", content)
          }
        />
        <ExpandableCard
          title="Personas envolvidas"
          content={productCanvas.personas}
          color={colors.cyan}
          icon={Users}
          onContentUpdate={(content) =>
            updateProductCanvas("personas", content)
          }
        />
        <ExpandableCard
          title="Restrições"
          content={productCanvas.restrictions}
          color={colors.cyan}
          icon={Slash}
          onContentUpdate={(content) =>
            updateProductCanvas("restrictions", content)
          }
        />
        <ExpandableCard
          title="É"
          content={productCanvas.product_is}
          color={colors.turquoise}
          icon={Check}
          onContentUpdate={(content) =>
            updateProductCanvas("product_is", content)
          }
        />
        <ExpandableCard
          title="Não É"
          content={productCanvas.product_is_not}
          color={colors.turquoise}
          icon={X}
          onContentUpdate={(content) =>
            updateProductCanvas("product_is_not", content)
          }
        />
      </div>
    </div>
  )
}

export default MainView
