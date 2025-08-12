import { Info, Sparkles } from 'lucide-react'
const GenerateIAButton = ({
  isGenerating,
  onClick,
  tooltipTitle,
  tooltipDesctiption,
  className = '',
}) => {
  return (
    <div
      className={` flex items-center justify-center rounded-lg shadow-md transition-colors ${className}  ${
        isGenerating
          ? 'bg-muted text-muted-foreground'
          : 'bg-gradient-to-r from-primary to-secondary text-foreground'
      }`}
    >
      <Button
        onClick={onClick}
        disabled={isGenerating}
        variant="hollow"
        className="flex flex-1 items-center justify-center py-2"
      >
        {isGenerating ? (
          <>
            <div className="animate-spin rounded-full size-4 border-2 border-muted-foreground border-t-transparent mr-2"></div>
            Gerando...
          </>
        ) : (
          <>
            <Sparkles size={18} className="mr-2" />
            <span>{tooltipTitle}</span>
          </>
        )}
      </Button>

      <Popover>
        <PopoverTrigger asChild>
          <div className="flex items-center justify-center h-full w-14">
            <Info size={15} />
          </div>
        </PopoverTrigger>
        <PopoverContent className="bg-popover text-popover-foreground">
          <PopoverArrow className="fill-popover" />
          {tooltipDesctiption}
        </PopoverContent>
      </Popover>
    </div>
  )
}

export default GenerateIAButton
