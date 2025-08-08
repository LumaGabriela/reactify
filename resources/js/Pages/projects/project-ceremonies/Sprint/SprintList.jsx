// resources/js/Pages/Project/project-ceremonies/Sprint/SprintList.jsx
import { router } from '@inertiajs/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Play, Square, Calendar, Trash2, Eye } from 'lucide-react'

const SprintList = ({ sprints, setActiveSprint, setView, project, updateProject }) => {

  const handleDeleteSprint = (sprint) => {
    if (confirm('Tem certeza que deseja deletar esta sprint?')) {
      router.delete(route('sprint.destroy', sprint.id), {
        preserveState: true,
        preserveScroll: true,
        onSuccess: (page) => {
          if (page.props.project) {
            updateProject(page.props.project)
          }
        },
        onError: (errors) => {
          console.error('Erro ao deletar sprint:', errors)
        }
      })
    }
  }

  const handleViewKanban = (sprint) => {
    setActiveSprint(sprint)
    setView('kanban')
  }

  const formatDate = (dateString) => {
    if (!dateString) return ''
    
    const dateOnly = dateString.split('T')[0]
    const [year, month, day] = dateOnly.split('-')
    
    return `${day}/${month}/${year}`
  }

  const getSprintDuration = (startDate, endDate) => {
    if (!startDate || !endDate) return ''
    
    const startOnly = startDate.split('T')[0]
    const endOnly = endDate.split('T')[0]
    
    const start = new Date(startOnly + 'T00:00:00')
    const end = new Date(endOnly + 'T00:00:00')
    
    const diffTime = Math.abs(end - start)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1 // +1 para incluir ambos os dias
    
    return `${diffDays} dias`
  }

  const isSprintOverdue = (endDate, status) => {
    if (!endDate || status === 'completed') return false
    
    const today = new Date()
    const todayString = today.getFullYear() + '-' + 
                       String(today.getMonth() + 1).padStart(2, '0') + '-' + 
                       String(today.getDate()).padStart(2, '0')
    
    const endOnly = endDate.split('T')[0]
    
    return todayString > endOnly && status === 'active'
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'default'
      case 'completed':
        return 'secondary'
      case 'planning':
        return 'outline'
      default:
        return 'secondary'
    }
  }

  const getStatusIcon = (status) => {
    return status === 'active' ? 
      <Play className="w-4 h-4" /> : 
      <Square className="w-4 h-4" />
  }

  if (sprints.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <p className="text-muted-foreground">
            Nenhuma sprint criada ainda. Crie uma para começar!
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {sprints.map((sprint) => (
        <Card key={sprint.id}>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center gap-2">
                {getStatusIcon(sprint.status)}
                {sprint.name}
              </CardTitle>
              <div className="flex gap-2">
                <Button 
                  variant="outline"
                  size="sm"
                  onClick={() => handleViewKanban(sprint)}
                  disabled={sprint.status !== 'active' && sprint.status !== 'planning'}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Ver Kanban
                </Button>
                <Button 
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDeleteSprint(sprint)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4 flex-wrap">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span className="font-medium">
                  {formatDate(sprint.start_date)} até {formatDate(sprint.end_date)}
                </span>
                <span className="text-xs bg-muted px-2 py-1 rounded">
                  {getSprintDuration(sprint.start_date, sprint.end_date)}
                </span>
                {isSprintOverdue(sprint.end_date, sprint.status) && (
                  <Badge variant="destructive" className="text-xs">
                    Atrasada
                  </Badge>
                )}
              </div>
              
              <Badge variant={getStatusColor(sprint.status)} className="capitalize">
                {sprint.status === 'planning' ? 'Planejamento' : 
                 sprint.status === 'active' ? 'Ativa' : 
                 sprint.status === 'completed' ? 'Concluída' : sprint.status}
              </Badge>
              
              <span>
                Stories: {sprint.stories ? sprint.stories.length : 0}
              </span>
            </div>
            
            {/* Stories da sprint */}
            {sprint.stories && sprint.stories.length > 0 && (
              <div className="pt-4 border-t">
                <h4 className="text-sm font-medium mb-2">Stories nesta sprint:</h4>
                <div className="flex flex-wrap gap-2">
                  {sprint.stories.map(story => (
                    <Badge key={story.id} variant="secondary">
                      US{story.id} - {story.title.substring(0, 30)}...
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default SprintList