// resources/js/Pages/Project/project-ceremonies/Sprint/SprintList.jsx
import { router } from '@inertiajs/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Play, Check, Calendar, Trash2, Eye, Info, Edit } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'

const SprintList = ({ sprints, setActiveSprint, setView, project, updateProject }) => {
  const [editingSprint, setEditingSprint] = useState(null)
  const [editForm, setEditForm] = useState({})

  const handleEditSprint = (sprint) => {
    setEditingSprint(sprint.id)
    setEditForm({
      name: sprint.name,
      start_date: sprint.start_date.split('T')[0],
      end_date: sprint.end_date.split('T')[0]
    })
  }

  const handleSaveEdit = (sprintId) => {
    router.patch(route('sprint.update', sprintId), editForm, {
      preserveState: true,
      preserveScroll: true,
      onSuccess: (page) => {
        setEditingSprint(null)
        if (page.props.project) {
          updateProject(page.props.project)
        }
        toast.success('Sprint atualizada com sucesso!')
      },
      onError: (errors) => {
        console.error('Erro ao editar sprint:', errors)
        toast.error('Erro ao atualizar sprint. Tente novamente.')

      }
    })
  }

  const handleCancelEdit = () => {
    setEditingSprint(null)
    setEditForm({})
  }

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
    switch (status) {
      case 'active':
        return <Play className="w-4 h-4 text-green-600" />
      case 'completed':
        return <Check className="w-4 h-4 text-gray-600" />
      case 'planning':
        return <Calendar className="w-4 h-4 text-blue-600" />
      default:
        return <Check className="w-4 h-4 text-gray-400" />
    }
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
              {editingSprint === sprint.id ? (
                <div className="flex items-center gap-2 flex-1">
                  <Input
                    value={editForm.name}
                    onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                    className="max-w-xs"
                  />
                </div>
              ) : (
                <CardTitle className="flex items-center gap-2">
                  {getStatusIcon(sprint.status)}
                  {sprint.name}
                </CardTitle>
              )}
              
              <div className="flex gap-2">
                {editingSprint === sprint.id ? (
                  <>
                    <Button 
                      variant="outline"
                      size="sm"
                      onClick={() => handleSaveEdit(sprint.id)}
                    >
                      Salvar
                    </Button>
                    <Button 
                      variant="ghost"
                      size="sm"
                      onClick={handleCancelEdit}
                    >
                      Cancelar
                    </Button>
                  </>
                ) : (
                  <>
                    <Button 
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewKanban(sprint)}
                      disabled={sprint.status !== 'active'}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Sprint Kanban
                    </Button>
                    
                    {sprint.status !== 'active' && (
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="ghost" size="sm" className="p-1">
                            <Info className="w-4 h-4 text-muted-foreground" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80">
                          <div className="space-y-2">
                            <h4 className="font-medium">Kanban não disponível</h4>
                            <p className="text-sm text-muted-foreground">
                              O Kanban board só pode ser acessado quando a sprint está com status <strong>"Ativa"</strong>.
                              Esta sprint está com status: <Badge variant="outline" className="ml-1">{sprint.status === 'planning' ? 'Planejada' : sprint.status === 'completed' ? 'Concluída' : sprint.status}</Badge>
                            </p>
                          </div>
                        </PopoverContent>
                      </Popover>
                    )}
                    
                    <Button 
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditSprint(sprint)}
                      disabled={sprint.status === 'completed'}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    
                    <Button 
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteSprint(sprint)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </>
                )}
              </div>
            </div>
          </CardHeader>

          <CardContent>
            {editingSprint === sprint.id ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Data de Início</label>
                    <Input
                      type="date"
                      value={editForm.start_date}
                      min={new Date().toISOString().split('T')[0]}
                      onChange={(e) => setEditForm({...editForm, start_date: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Data de Fim</label>
                    <Input
                      type="date"
                      value={editForm.end_date}
                      min={new Date().toISOString().split('T')[0]}
                      onChange={(e) => setEditForm({...editForm, end_date: e.target.value})}
                    />
                  </div>
                </div>
              </div>
            ) : (
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
            )}
            
            {/* Stories da sprint - só mostra quando não está editando */}
            {editingSprint !== sprint.id && sprint.stories && sprint.stories.length > 0 && (
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