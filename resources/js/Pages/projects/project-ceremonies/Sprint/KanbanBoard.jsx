// resources/js/Pages/Project/project-ceremonies/Sprint/KanbanBoard.jsx
import { useState, useEffect, useMemo } from 'react'
import { router } from '@inertiajs/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, ArrowRight } from 'lucide-react'

const KanbanBoard = ({ sprint, project, setView, updateProject }) => {
  // ✅ Estado local para refletir mudanças imediatas na UI
  const [localStories, setLocalStories] = useState([])

  // ✅ Sincronizar estado local quando sprint muda
  useEffect(() => {
    if (sprint?.stories) {
      setLocalStories(sprint.stories)
    }
  }, [sprint])

  // ✅ Usar localStories ao invés de sprint.stories
  const stories = useMemo(() => {
    if (!localStories.length) {
      return {
        todo: [],
        in_progress: [],
        testing: [],
        done: []
      }
    }

    return {
      todo: localStories.filter(s => !s.pivot?.kanban_status || s.pivot?.kanban_status === 'todo'),
      in_progress: localStories.filter(s => s.pivot?.kanban_status === 'in_progress'),
      testing: localStories.filter(s => s.pivot?.kanban_status === 'testing'),
      done: localStories.filter(s => s.pivot?.kanban_status === 'done')
    }
  }, [localStories])

  const moveStory = (storyId, newStatus) => {
    // ✅ Atualizar estado local ANTES da requisição
    setLocalStories(prevStories => 
      prevStories.map(story => 
        story.id === storyId 
          ? {
              ...story,
              pivot: {
                ...story.pivot,
                kanban_status: newStatus
              }
            }
          : story
      )
    )

    router.patch(route('sprint-stories.update', sprint.id), {
      story_id: storyId,
      kanban_status: newStatus
    }, {
      preserveState: true,
      preserveScroll: true,
      onSuccess: (page) => {
        // ✅ Sincronizar com dados do servidor em caso de sucesso
        if (page.props.project) {
          updateProject(page.props.project)
          const updatedSprint = page.props.project.sprints?.find(s => s.id === sprint.id)
          if (updatedSprint?.stories) {
            setLocalStories(updatedSprint.stories)
          }
        }
      },
      onError: (errors) => {
        console.error('Erro ao mover story:', errors)
        // ✅ Reverter estado local em caso de erro
        if (sprint?.stories) {
          setLocalStories(sprint.stories)
        }
      }
    })
  }

  const columns = [
    { key: 'todo', title: 'To Do', variant: 'secondary' },
    { key: 'in_progress', title: 'In Progress', variant: 'default' },
    { key: 'testing', title: 'Testing', variant: 'outline' },
    { key: 'done', title: 'Done', variant: 'secondary' }
  ]

  const getActionButtons = (story, columnKey) => {
    const buttons = []
    
    switch (columnKey) {
      case 'todo':
        buttons.push(
          <Button
            key="start"
            size="sm"
            variant="outline"
            onClick={() => moveStory(story.id, 'in_progress')}
          >
            Start <ArrowRight className="w-3 h-3 ml-1" />
          </Button>
        )
        break
      case 'in_progress':
        buttons.push(
          <Button
            key="back"
            size="sm"
            variant="outline"
            onClick={() => moveStory(story.id, 'todo')}
          >
            <ArrowLeft className="w-3 h-3 mr-1" /> Back
          </Button>,
          <Button
            key="test"
            size="sm"
            variant="outline"
            onClick={() => moveStory(story.id, 'testing')}
          >
            Test <ArrowRight className="w-3 h-3 ml-1" />
          </Button>
        )
        break
      case 'testing':
        buttons.push(
          <Button
            key="back"
            size="sm"
            variant="outline"
            onClick={() => moveStory(story.id, 'in_progress')}
          >
            <ArrowLeft className="w-3 h-3 mr-1" /> Back
          </Button>,
          <Button
            key="done"
            size="sm"
            variant="outline"
            onClick={() => moveStory(story.id, 'done')}
          >
            Done <ArrowRight className="w-3 h-3 ml-1" />
          </Button>
        )
        break
      case 'done':
        buttons.push(
          <Button
            key="back"
            size="sm"
            variant="outline"
            onClick={() => moveStory(story.id, 'testing')}
          >
            <ArrowLeft className="w-3 h-3 mr-1" /> Back
          </Button>
        )
        break
    }
    
    return buttons
  }

  if (!sprint) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => setView('list')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="text-center py-8">
          <p className="text-muted-foreground">Nenhuma sprint selecionada</p>
        </CardContent>
      </Card>
    )
  }

  const totalStories = Object.values(stories).reduce((sum, arr) => sum + arr.length, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => setView('list')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
            </Button>
            <CardTitle>{sprint.name} - Kanban Board</CardTitle>
            <Badge variant="outline">
              {totalStories} stories total
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Empty State */}
      {totalStories === 0 && (
        <Card className="border-dashed border-2 border-muted-foreground/25">
          <CardContent className="flex flex-col items-center justify-center py-8 text-center">
            <p className="text-muted-foreground mb-4">
              Esta sprint não possui stories ainda.
            </p>
            <Button 
              variant="outline"
              onClick={() => setView('list')}
            >
              Voltar para a lista de sprints
            </Button>
            <p className="text-sm text-muted-foreground mt-2">
              e adicione stories do Product Backlog.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {columns.map((column) => (
          <Card key={column.key} className="min-h-96">
            <CardHeader className="pb-4">
              <CardTitle className="flex justify-between items-center text-base">
                <span className="capitalize">{column.title}</span>
                <Badge variant={column.variant}>
                  {stories[column.key].length}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {stories[column.key].map((story) => (
                <Card key={story.id} className="p-3">
                  <div className="space-y-2">
                    <div className="flex justify-between items-start">
                      <Badge variant="outline" className="text-xs">
                        US{story.id}
                      </Badge>
                    </div>
                    <p className="text-sm font-medium">{story.title}</p>
                    <p className="text-xs text-muted-foreground">
                      Status: {story.pivot?.kanban_status || 'todo'}
                    </p>
                    
                    {/* Action Buttons */}
                    <div className="flex gap-1 flex-wrap">
                      {getActionButtons(story, column.key)}
                    </div>
                  </div>
                </Card>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default KanbanBoard