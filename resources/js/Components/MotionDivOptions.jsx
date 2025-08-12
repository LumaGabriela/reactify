import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Pencil, Trash } from 'lucide-react'

const MotionDivOptions = ({
  isHovered,
  isEditing,
  isTemporary = false,
  onAdd,
  onEdit,
  onDelete,
}) => {
  return (
    // 1. O Provider envolve tudo para que os tooltips funcionem
    <TooltipProvider delayDuration={100}>
      <AnimatePresence>
        {isHovered && !isEditing && !isTemporary && (
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.2 }}
            className="z-50 absolute right-0 top-0 flex items-center rounded-md bg-card border border-border shadow-lg"
          >
            {/* Botão Adicionar com Tooltip */}
            {onAdd && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="motiondiv"
                    size="icon"
                    className="text-muted-foreground hover:text-foreground"
                    onClick={onAdd}
                  >
                    <Plus className="size-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Adicionar</p>
                </TooltipContent>
              </Tooltip>
            )}

            {/* Botão Editar com Tooltip */}
            {onEdit && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="motiondiv"
                    size="icon"
                    className="text-muted-foreground hover:text-foreground"
                    onClick={onEdit}
                  >
                    <Pencil className="size-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Editar</p>
                </TooltipContent>
              </Tooltip>
            )}

            {/* Botão Deletar com Tooltip */}
            {onDelete && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="motiondiv"
                    size="icon"
                    className="text-destructive/80 hover:text-destructive"
                    onClick={onDelete}
                  >
                    <Trash className="size-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Deletar</p>
                </TooltipContent>
              </Tooltip>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </TooltipProvider>
  )
}

export default MotionDivOptions
