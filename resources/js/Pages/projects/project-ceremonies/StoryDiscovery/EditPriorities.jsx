import React, { useState } from 'react' // Adicionado useState
import { router } from '@inertiajs/react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
  SheetFooter,
} from '@/components/ui/sheet' // Importações do ShadCN
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Trash2 } from 'lucide-react'

// Subcomponente para editar uma prioridade existente
const PriorityEditForm = ({ priority }) => {
  // Gerencia o estado dos inputs manualmente com useState
  const [name, setName] = useState(priority.name)
  const [color, setColor] = useState(priority.color)
  const [isProcessing, setIsProcessing] = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    setIsProcessing(true) // Inicia o estado de processamento

    router.patch(
      route('matrix-priority.update', { priority: priority.id }),
      { name, color }, // Passa os dados do estado
      {
        preserveScroll: true,
        onFinish: () => setIsProcessing(false), // Finaliza o processamento
      },
    )
  }

  function handleDelete() {
    if (confirm('Tem certeza que deseja remover esta prioridade?')) {
      router.delete(
        route('matrix-priority.destroy', { priority: priority.id }),
        {
          preserveScroll: true,
        },
      )
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-end gap-2">
      <div className="grid gap-1.5 flex-1">
        <Label htmlFor={`name-${priority.id}`}>Nome</Label>
        <Input
          id={`name-${priority.id}`}
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={isProcessing}
        />
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor={`color-${priority.id}`}>Cor</Label>
        <Input
          id={`color-${priority.id}`}
          type="color"
          className="p-1"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          disabled={isProcessing}
        />
      </div>
      <Button type="submit" disabled={isProcessing}>
        Salvar
      </Button>
      <Button
        type="button"
        variant="destructive"
        size="icon"
        onClick={handleDelete}
        disabled={isProcessing}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </form>
  )
}

// Componente principal do Sheet
const EditPriorities = ({ priorities, projectId }) => {
  // Gerencia o estado do novo formulário manualmente
  const [newName, setNewName] = useState('')
  const [newColor, setNewColor] = useState('#ffffff')
  const [isStoring, setIsStoring] = useState(false)

  function handleStore(e) {
    e.preventDefault()
    setIsStoring(true)

    router.post(
      route('matrix-priority.store'),
      { name: newName, color: newColor, project_id: projectId }, // Passa os dados do estado
      {
        preserveScroll: true,
        onSuccess: () => {
          // Reseta os campos manualmente
          setNewName('')
          setNewColor('#ffffff')
        },
        onFinish: () => setIsStoring(false),
      },
    )
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Editar Prioridades</Button>
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Gerenciar Prioridades da Matriz</SheetTitle>
          <SheetDescription>
            Adicione, edite ou remova as prioridades que são usadas em todos os
            projetos.
          </SheetDescription>
        </SheetHeader>
        <div className="py-4 space-y-6">
          <div className="space-y-4">
            <h4 className="font-medium text-foreground">
              Prioridades Existentes
            </h4>
            {priorities.map((p) => (
              <PriorityEditForm key={p.id} priority={p} />
            ))}
          </div>

          <Separator />

          <form onSubmit={handleStore} className="space-y-4">
            <h4 className="font-medium text-foreground">
              Adicionar Nova Prioridade
            </h4>
            <div className="flex items-end gap-2">
              <div className="grid gap-1.5 flex-1">
                <Label htmlFor="new-name">Nome</Label>
                <Input
                  id="new-name"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  disabled={isStoring}
                />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="new-color">Cor</Label>
                <Input
                  id="new-color"
                  type="color"
                  className="p-1"
                  value={newColor}
                  onChange={(e) => setNewColor(e.target.value)}
                  disabled={isStoring}
                />
              </div>
            </div>
            <SheetFooter>
              <Button type="submit" disabled={isStoring}>
                Adicionar Prioridade
              </Button>
            </SheetFooter>
          </form>
        </div>
      </SheetContent>
    </Sheet>
  )
}

export default EditPriorities
