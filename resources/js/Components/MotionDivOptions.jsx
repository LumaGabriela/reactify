import { motion, AnimatePresence } from 'framer-motion'
import { Pencil, Trash } from 'lucide-react'

const MotionDivOptions = ({
  isHovered,
  isEditing,
  isTemporary = false,
  onEdit,
  onDelete,
  options = { edit: true, delete: true },
}) => {
  return (
    <AnimatePresence>
      {isHovered && !isEditing && !isTemporary && (
        <motion.div
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 10 }}
          transition={{ duration: 0.2 }}
          className="z-50 absolute right-0 top-0 flex items-center rounded-md bg-card border border-border shadow-lg"
        >
          {options.edit && (
            <Button
              variant="motiondiv"
              size="icon"
              className="text-muted-foreground hover:text-foreground"
              onClick={onEdit}
            >
              <Pencil className="size-4" />
            </Button>
          )}
          {options.delete && (
            <Button
              variant="motiondiv"
              size="icon"
              className="text-destructive/80 hover:text-destructive"
              onClick={onDelete}
            >
              <Trash className="size-4" />
            </Button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default MotionDivOptions
