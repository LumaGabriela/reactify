import { router } from '@inertiajs/react'
import { Plus } from 'lucide-react'
import SprintList from './SprintList'
import KanbanBoard from './KanbanBoard'
import { toast } from 'sonner'

const Sprint = ({ project, setProject }) => {
  const [activeSprint, setActiveSprint] = useState(null)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [view, setView] = useState('list')

  const sprints = project?.sprints || []

  const handleCreateSprint = (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)

    const sprintData = {
      name: formData.get('name'),
      start_date: formData.get('start_date'),
      end_date: formData.get('end_date'),
      project_id: project.id,
      status: 'planning',
    }

    router.post(route('sprint.store'), sprintData, {
      preserveState: true,
      preserveScroll: true,
      onSuccess: (page) => {
        setShowCreateForm(false)
        if (page.props.project) {
          setProject(page.props.project)
        }
      },
      onError: (errors) => {
        console.error('Erro ao criar sprint:', errors)

        const mensagens = Object.values(errors || {})
        if (mensagens.length > 0) {
          toast.warning(mensagens.join('\n'))
        } else {
          toast.error('Erro ao criar a sprint. Tente novamente.')
        }
      },
    })
  }

  const updateProjectData = (updatedProject) => {
    setProject(updatedProject)
  }

  return (
    <div className="w-full space-y-6 p-4">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl">Sprint Management</CardTitle>
            <div className="flex gap-2">
              <Tabs value={view} onValueChange={setView}>
                <TabsList>
                  <TabsTrigger value="list">Sprint List</TabsTrigger>
                  <TabsTrigger
                    value="kanban"
                    disabled={!activeSprint || activeSprint.status !== 'active'}
                  >
                    Kanban Board
                  </TabsTrigger>
                </TabsList>
              </Tabs>
              <Button onClick={() => setShowCreateForm(!showCreateForm)}>
                <Plus className="w-4 h-4 mr-2" />
                New Sprint
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Form de Criação de Sprint */}
      {showCreateForm && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Sprint</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateSprint} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Sprint Name</label>
                <Input
                  type="text"
                  name="name"
                  defaultValue={`Sprint ${sprints.length + 1}`}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Start Date</label>
                  <Input
                    type="date"
                    name="start_date"
                    min={new Date().toISOString().split('T')[0]}
                    defaultValue={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">End Date</label>
                  <Input
                    type="date"
                    name="end_date"
                    min={new Date().toISOString().split('T')[0]}
                    defaultValue={
                      new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
                        .toISOString()
                        .split('T')[0]
                    }
                    required
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button type="submit">Create Sprint</Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowCreateForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Content */}
      {view === 'list' ? (
        <SprintList
          sprints={sprints}
          setActiveSprint={setActiveSprint}
          setView={setView}
          project={project}
          updateProject={updateProjectData}
        />
      ) : (
        <KanbanBoard
          sprint={activeSprint}
          project={project}
          setView={setView}
          updateProject={updateProjectData}
        />
      )}
    </div>
  )
}

export default Sprint
