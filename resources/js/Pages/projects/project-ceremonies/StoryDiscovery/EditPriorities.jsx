import React, { useState } from 'react'
import { router } from '@inertiajs/react'
import { Trash2 } from 'lucide-react'

// --- NOVO: Lista de cores predefinidas ---
const PREDEFINED_COLORS = [
  '#ef4444',
  '#f97316',
  '#eab308',
  '#84cc16',
  '#22c55e',
  '#14b8a6',
  '#06b6d4',
  '#3b82f6',
  '#8b5cf6',
  '#d946ef',
  '#ec4899',
  '#78716c',
  '#a3a3a3',
  '#ffffff',
  '#000000',
]

// --- NOVO: Componente reutilizável para o seletor de cores ---
const ColorPickerPopover = ({ value, onChange, disabled = false }) => {
  const [isOpen, setIsOpen] = useState(false)

  const handleColorSelect = (color) => {
    onChange(color) // Atualiza o estado no componente pai
    setIsOpen(false) // Fecha o popover após a seleção
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-10 h-10 p-0" disabled={disabled}>
          {/* O div interno mostra a cor selecionada */}
          <div
            className="w-8 h-8 rounded-md border"
            style={{ backgroundColor: value }}
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-2">
        <div className="grid grid-cols-5 gap-2">
          {PREDEFINED_COLORS.map((color) => (
            <button
              key={color}
              onClick={() => handleColorSelect(color)}
              className="w-6 h-6 rounded-full border transform hover:scale-110 transition-transform"
              style={{ backgroundColor: color }}
              aria-label={`Select color ${color}`}
            />
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}

// Subcomponente para editar uma prioridade existente (MODIFICADO)
const PriorityEditForm = ({ priority }) => {
  const [name, setName] = useState(priority.name)
  const [color, setColor] = useState(priority.color)
  const [isProcessing, setIsProcessing] = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    setIsProcessing(true)

    router.patch(
      route('matrix-priority.update', { priority: priority.id }),
      { name, color },
      {
        preserveScroll: true,
        onFinish: () => setIsProcessing(false),
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
        <Label>Cor</Label>
        {/* --- ALTERAÇÃO: Substituímos o Input pelo nosso novo componente --- */}
        <ColorPickerPopover
          value={color}
          onChange={setColor}
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

// Componente principal do Sheet (MODIFICADO)
const EditPriorities = ({ priorities, projectId }) => {
  const [newName, setNewName] = useState('')
  const [newColor, setNewColor] = useState('#ffffff')
  const [isStoring, setIsStoring] = useState(false)

  function handleStore(e) {
    e.preventDefault()
    setIsStoring(true)

    router.post(
      route('matrix-priority.store'),
      { name: newName, color: newColor, project_id: projectId },
      {
        preserveScroll: true,
        onSuccess: () => {
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
                <Label>Cor</Label>
                {/* --- ALTERAÇÃO: Substituímos o Input pelo nosso novo componente --- */}
                <ColorPickerPopover
                  value={newColor}
                  onChange={setNewColor}
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
