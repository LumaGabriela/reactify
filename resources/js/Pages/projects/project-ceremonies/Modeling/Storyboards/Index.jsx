import Editor from './Editor'
import {
  LayoutGrid,
  List,
  Plus,
  FileQuestion,
  MoreVertical,
  Trash2,
} from 'lucide-react'

import { router } from '@inertiajs/react'

export const StoryboardCard = ({
  storyboard,
  project,
  viewMode = 'grid',
  setTab,
}) => {
  const handleDelete = (e) => {
    e.stopPropagation()
    router.delete(route('storyboard.destroy', storyboard.id))
  }

  if (viewMode === 'list') {
    return (
      <Card
        className="hover:border-primary transition-colors flex items-center p-3"
        onClick={() => {
          setTab({ tab: 'editor', storyboard: storyboard })
        }}
      >
        <div className="w-32 flex-shrink-0 mr-4">
          <AspectRatio
            ratio={16 / 9}
            className="bg-muted rounded-md overflow-hidden"
          >
            <img
              src={storyboard.image_url}
              alt={`Storyboard for ${storyboard.story_id}`}
              className="w-full h-full object-cover"
            />
          </AspectRatio>
        </div>
        <div className="flex-grow">
          <p className="text-sm font-semibold truncate">Titulo</p>
          <p className="text-xs text-muted-foreground">
            Atualizado em:{' '}
            {new Date(storyboard.updated_at).toLocaleDateString('pt-BR')}
          </p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              onClick={(e) => e.preventDefault()}
              size="icon"
              variant="ghost"
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={handleDelete} className="text-red-500">
              <Trash2 className="mr-2 size-4" />
              Excluir
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </Card>
    )
  }

  // Grid View (default)
  return (
    <Card
      className="hover:border-primary transition-colors"
      onClick={() => {
        setTab({ tab: 'editor', storyboard: storyboard })
      }}
    >
      <CardHeader className="p-0">
        <AspectRatio
          ratio={16 / 9}
          className="bg-muted rounded-t-lg overflow-hidden"
        >
          <img
            src={storyboard.image_url}
            alt={`Storyboard for ${storyboard.story_id}`}
            className="w-full h-full object-cover"
          />
        </AspectRatio>
      </CardHeader>
      <CardContent className="p-4">
        <p
          className="text-sm font-semibold truncate"
          title={storyboard.story_id}
        >
          {storyboard.stor_id}
        </p>
        <p className="text-xs text-muted-foreground">
          Atualizado em:{' '}
          {new Date(storyboard.updated_at).toLocaleDateString('pt-BR')}
        </p>
      </CardContent>
    </Card>
  )
}

const StoryboardsIndex = ({ project, setTab }) => {
  const [viewMode, setViewMode] = useState('grid')

  useEffect(() => {
    const savedViewMode = localStorage.getItem('storyboardViewMode') || 'grid'
    setViewMode(savedViewMode)
  }, [])

  const handleViewModeChange = (value) => {
    if (value) {
      setViewMode(value)
      localStorage.setItem('storyboardViewMode', value)
    }
  }

  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <ToggleGroup
            type="single"
            value={viewMode}
            onValueChange={handleViewModeChange}
            className="text-foreground "
          >
            <ToggleGroupItem value="grid" aria-label="Grid view">
              <LayoutGrid className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="list" aria-label="List view">
              <List className="h-4 w-4" />
            </ToggleGroupItem>
          </ToggleGroup>

          <Button onClick={() => setTab({ storyboard: null, tab: 'editor' })}>
            <Plus className="mr-2 size-4" />
            Adicionar Storyboard
          </Button>
        </div>

        {project?.storyboards?.length > 0 ? (
          <div
            className={`
                transition-all duration-300
                ${
                  viewMode === 'grid'
                    ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'
                    : 'flex flex-col gap-4'
                }
              `}
          >
            {project?.storyboards.map((storyboard) => (
              <StoryboardCard
                key={storyboard.id}
                storyboard={storyboard}
                project={project}
                viewMode={viewMode}
                setTab={setTab}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 px-6 bg-card rounded-lg shadow-sm">
            <FileQuestion className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-semibold text-gray-900 dark:text-white">
              Nenhum storyboard foi criado ainda.
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Comece a dar vida às suas stories.
            </p>
            <div className="mt-6">
              <Button
                onClick={() => setTab({ tab: 'editor', storyboard: null })}
              >
                <Plus className="mr-2 h-4 w-4" />
                Criar seu primeiro Storyboard
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

const Storyboards = ({ project }) => {
  const [tab, setTab] = useState({ tab: 'index', storyboard: null })

  const render = () => {
    switch (tab?.tab) {
      case 'index':
        return <StoryboardsIndex project={project} setTab={setTab} />
      case 'editor':
        return (
          <Editor
            project={project}
            setTab={setTab}
            storyboard={tab.storyboard || null}
          />
        )
      default:
        return null
    }
  }
  return render()
}
export default Storyboards
