import { router } from '@inertiajs/react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from '@/components/ui/dialog'
import ChangeRequestForm from '../../../../Components/ChangeRequestForm'

const ChangeLog = ({ project }) => {
  const changeRequests = project.change_requests || []
  const [showForm, setShowForm] = useState(false)

  const getStatusBadge = (status) => {
    const statusColors = {
      SOLICITADA: 'bg-yellow-100 text-yellow-800',
      APROVADA: 'bg-green-100 text-green-800',
      REJEITADA: 'bg-red-100 text-red-800',
      IMPLEMENTADA: 'bg-blue-100 text-blue-800'
    }
    
    const statusLabels = {
      SOLICITADA: 'Solicitada',
      APROVADA: 'Aprovada',
      REJEITADA: 'Rejeitada',
      IMPLEMENTADA: 'Implementada'
    }

    return (
      <Badge className={statusColors[status] || 'bg-gray-100 text-gray-800'}>
        {statusLabels[status] || status}
      </Badge>
    )
  }

  const formatStories = (stories, impactType) => {
    return stories
      .filter(story => story.pivot.impact_type === impactType)
      .map(story => story.code || `US-${story.id}`)
      .join(', ')
  }

  return (
    <div className="p-2">
      <div className="w-full flex justify-between items-center p-4">
        <Button
          variant="link"
          onClick={() =>
            router.get(
              route('project.show', { project: project.id, page: 'backlog' }),
            )
          }
        >
          Go to Product Backlog
        </Button>
        
        <Dialog open={showForm} onOpenChange={setShowForm}>
          <DialogTrigger asChild>
            <Button>Nova Solicitação</Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogTitle>Nova Solicitação de Mudança</DialogTitle>
            <ChangeRequestForm
              project={project}
              stories={project.stories || []}
              onClose={() => setShowForm(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-center">Número</TableHead>
            <TableHead className="text-center">Data da Solicitação</TableHead>
            <TableHead className="text-center">Responsável</TableHead>
            <TableHead className="text-center">Descrição</TableHead>
            <TableHead className="text-center">Status</TableHead>
            <TableHead className="text-center">Impacto</TableHead>
            <TableHead className="text-center">Novas</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {changeRequests.length > 0 ? (
            changeRequests.map((request) => (
              <TableRow key={request.id}>
                <TableCell className="text-center">{request.id}</TableCell>
                <TableCell className="text-center">
                  {new Date(request.request_date).toLocaleDateString('pt-BR')}
                </TableCell>
                <TableCell className="text-center">
                  {request.requester?.name || 'N/A'}
                </TableCell>
                <TableCell className="max-w-xs truncate" title={request.description}>
                  {request.description}
                </TableCell>
                <TableCell className="text-center">
                  {getStatusBadge(request.status)}
                </TableCell>
                <TableCell className="text-center">
                  {formatStories(request.stories || [], 'IMPACTADA') || '-'}
                </TableCell>
                <TableCell className="text-center">
                  {formatStories(request.stories || [], 'NOVA') || '-'}
                </TableCell>
                <TableCell className="text-center">
                  {request.effort || '-'}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={8} className="text-center text-gray-500 py-8">
                Nenhuma solicitação de mudança encontrada
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}

export default ChangeLog