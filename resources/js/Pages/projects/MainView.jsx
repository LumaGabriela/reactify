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
import ProgressIcon from "../../Components/ProgressIcon" // Assuming this component is adapted
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
import TextareaAutosize from "react-textarea-autosize"

// Helper to map variants to Tailwind classes
const cardVariants = {
  primary: "border-t-primary text-primary",
  destructive: "border-t-destructive text-destructive",
  warning: "border-t-yellow-500 text-yellow-500", // Example for yellow
  success: "border-t-success text-success",
  info: "border-t-cyan-500 text-cyan-500", // Example for cyan
  secondary: "border-t-secondary text-secondary",
  accent: "border-t-accent text-accent",
};


const ExpandableCard = ({
  title,
  content,
  variant = "primary", // 'primary', 'destructive', 'success', etc.
  icon: IconComponent = CheckCircle,
  col = 1,
  onContentUpdate,
  placeholder = "Click to add content..."
}) => {
  const [expanded, setExpanded] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editableContent, setEditableContent] = useState(content || "")
  const [isHovered, setIsHovered] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const textareaRef = useRef(null)

  useEffect(() => {
    setEditableContent(content || "")
  }, [content])

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus()
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
      console.error("Error saving:", error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    setEditableContent(content || "")
    setIsEditing(false)
  }
  
  const handleKeyDown = (e) => {
    if (e.key === "Escape") handleCancel()
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault()
      handleSave()
    }
  }

  const needsExpansion = typeof content === "string" && content.length > 150
  const hasContent = content && content.trim().length > 0
  const variantClasses = cardVariants[variant] || cardVariants.primary

  return (
    <div
      className={cn(
        "bg-card rounded-lg border-t-4 transition-all duration-300 shadow-lg hover:shadow-xl",
        col === 2 ? "col-span-2" : "",
        expanded ? "row-span-2" : "",
        isEditing ? "ring-2 ring-ring" : "",
        variantClasses.split(' ')[0] // Applies the border color class
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
              className={cn("mr-2 flex-shrink-0", variantClasses.split(' ')[1])} // Applies the text color class
            />
            <h3 className="text-card-foreground font-bold text-lg m-0 truncate">{title}</h3>
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
                  <Save size={16} className={isSaving ? "animate-pulse" : ""} />
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
                  "text-muted-foreground hover:text-foreground transition-colors",
                  isHovered || !hasContent ? "opacity-100" : "opacity-0"
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
                      "whitespace-pre-wrap break-words leading-relaxed",
                      !expanded && needsExpansion && "overflow-hidden"
                    )}
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
                  <>Show more <ChevronDown size={14} className="ml-1" /></>
                ) : (
                  <>Show less <ChevronUp size={14} className="ml-1" /></>
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
  const [productCanvas, setProductCanvas] = useState(project?.product_canvas || {})
  const [date, setDate] = useState()

  // This function would be updated to save the new content
  const updateProductCanvas = async (prop, newContent) => {
    // ... implementation for saving data
  }

  // This function would be updated to save the new content
  const updateProject = async (prop, content) => {
    // ... implementation for saving data
  }

  return (
    <div className="w-full text-foreground p-4">
      {/* Dashboard Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <div className="flex items-center text-muted-foreground">
              <Clock size={16} className="mr-1" />
              <span>Updated: {new Date().toLocaleDateString()}</span>
              <span className="mx-2">•</span>
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-success/20 text-success">
                Active
              </span>
            </div>
            <div className="text-left mt-2">
              <div className="text-muted-foreground text-sm mb-1">Conclusion</div>
              <div className="flex items-center">
                <div className="w-32 h-2 bg-muted rounded-full mr-2">
                  <div
                    className="h-2 bg-success rounded-full transition-all duration-500"
                    style={{ width: "68%" }}
                  />
                </div>
                <span className="text-sm font-medium">68%</span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col items-center gap-2 cursor-pointer select-none">
            <p className="text-muted-foreground text-md m-0">Due date:</p>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-44 justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Set deadline</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>

      {/* Progress Indicators */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6 items-center justify-center bg-card p-4 rounded-lg">
        <ProgressIcon value={project?.stories?.length || 0} max={20} colorClass="text-primary" label="Stories" icon={List} />
        <ProgressIcon value={project?.personas?.length || 0} max={10} colorClass="text-destructive" label="Personas" icon={Users} />
        <ProgressIcon value={project?.goalSketches?.length || 0} max={15} colorClass="text-info" label="Goals" icon={Target} />
        <ProgressIcon value={project?.journeys?.length || 0} max={10} colorClass="text-accent" label="Journeys" icon={GitBranch} />
      </div>

      {/* Main Dashboard - Responsive Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        <ExpandableCard
          title={project?.title || "Project"}
          content={project?.description}
          col={2}
          variant="secondary"
          icon={List}
          placeholder="Describe your project..."
          onContentUpdate={(content) => updateProject("description", content)}
        />
        <ExpandableCard
          title="Problems"
          content={productCanvas.issues}
          variant="destructive"
          icon={AlertCircle}
          placeholder="What problems does this project solve?"
          onContentUpdate={(content) => updateProductCanvas("issues", content)}
        />
        <ExpandableCard
          title="Solutions"
          content={productCanvas.solutions}
          variant="warning"
          icon={CheckCircle}
          placeholder="How does the project solve the problems?"
          onContentUpdate={(content) => updateProductCanvas("solutions", content)}
        />
        <ExpandableCard
          title="Involved Personas"
          content={productCanvas.personas}
          variant="success"
          icon={Users}
          placeholder="Who are the main users?"
          onContentUpdate={(content) => updateProductCanvas("personas", content)}
        />
        <ExpandableCard
          title="Restrictions"
          content={productCanvas.restrictions}
          variant="accent"
          icon={Slash}
          placeholder="What are the project's limitations?"
          onContentUpdate={(content) => updateProductCanvas("restrictions", content)}
        />
        <ExpandableCard
          title="Is"
          content={productCanvas.product_is}
          variant="info"
          icon={Check}
          placeholder="What this product IS..."
          onContentUpdate={(content) => updateProductCanvas("product_is", content)}
        />
        <ExpandableCard
          title="Is Not"
          content={productCanvas.product_is_not}
          variant="secondary"
          icon={X}
          placeholder="What this product IS NOT..."
          onContentUpdate={(content) => updateProductCanvas("product_is_not", content)}
        />
      </div>
    </div>
  )
}

export default MainView