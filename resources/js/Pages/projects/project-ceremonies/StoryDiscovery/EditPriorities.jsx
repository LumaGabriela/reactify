import React, { useState } from 'react'
import { router } from '@inertiajs/react'

// --- NOVO: Ícones adicionais para o novo design ---
import { Trash2, Check, Bookmark, Info } from 'lucide-react'

// Estrutura de dados das cores (sem alterações)
const PREDEFINED_COLORS = [
  { name: 'Padrão', value: '#78716c' },
  { name: 'Cinza', value: '#a3a3a3' },
  { name: 'Marrom', value: '#78716c' },
  { name: 'Laranja', value: '#f97316' },
  { name: 'Amarelo', value: '#eab308' },
  { name: 'Verde', value: '#22c55e' },
  { name: 'Azul', value: '#3b82f6' },
  { name: 'Roxo', value: '#8b5cf6' },
  { name: 'Rosa', value: '#ec4899' },
  { name: 'Vermelho', value: '#ef4444' },
]

// Componente ColorPickerPopover (sem alterações)
const ColorPickerPopover = ({ value, onChange, disabled = false }) => {
  const [isOpen, setIsOpen] = useState(false)
  const handleColorSelect = (colorValue) => {
    onChange(colorValue)
    setIsOpen(false)
  }
  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="default" className="w-10 h-10 p-0" disabled={disabled}>
          <div
            className="w-8 h-8 rounded-md border"
            style={{ backgroundColor: value }}
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-52 p-2" align="start">
        <div className="space-y-1">
          <h4 className="font-medium text-sm px-2 py-1.5">Cores</h4>
          {PREDEFINED_COLORS.map((color) => (
            <Button
              key={color.name}
              onClick={() => handleColorSelect(color.value)}
              className="w-full "
            >
              <div
                className="w-4 h-4 rounded-sm"
                style={{ backgroundColor: color.value }}
              />
              <span className="ml-2">{color.name}</span>
              {value === color.value && <Check className="ml-auto h-4 w-4" />}
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}

// --- NOVO: Componente Popover para Edição Individual ---
// Este componente substitui o antigo PriorityEditForm e encapsula toda a lógica de edição.
const PriorityEditPopover = ({ priority, children }) => {
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
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className="w-64 p-2" align="start">
        <form onSubmit={handleSubmit} className="space-y-2">
          {/* Campo de edição de nome */}
          <div className="relative">
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="pr-8"
              disabled={isProcessing}
            />
            <Info className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>

          {/* Ações */}
          <Button
            onClick={handleDelete}
            variant="ghost"
            className="w-full justify-start text-red-500 hover:text-red-500"
            disabled={isProcessing}
          >
            <Trash2 className="mr-2 h-4 w-4" /> Excluir
          </Button>
          <Button variant="ghost" className="w-full justify-start" disabled>
            <Bookmark className="mr-2 h-4 w-4" /> Definir como padrão
          </Button>
          <Separator />

          {/* Seletor de Cor */}
          <div className="p-2 space-y-1">
            <h4 className="font-medium text-sm">Cores</h4>
            {PREDEFINED_COLORS.map((c) => (
              <button
                key={c.name}
                type="button"
                onClick={() => setColor(c.value)}
                className="w-full flex items-center p-2 rounded-md text-sm hover:bg-accent"
              >
                <div
                  className="w-4 h-4 rounded-sm"
                  style={{ backgroundColor: c.value }}
                />
                <span className="ml-2">{c.name}</span>
                {color === c.value && <Check className="ml-auto h-4 w-4" />}
              </button>
            ))}
          </div>

          <Button type="submit" className="w-full" disabled={isProcessing}>
            Salvar Alterações
          </Button>
        </form>
      </PopoverContent>
    </Popover>
  )
}

// --- ATUALIZADO: Componente principal do Sheet ---
// Agora ele renderiza uma lista de botões que abrem o Popover de edição.
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
          <div className="space-y-2">
            <h4 className="font-medium text-foreground px-1">
              Prioridades Existentes
            </h4>
            {/* Mapeia as prioridades para botões que abrem o popover */}
            {priorities.map((p) => (
              <PriorityEditPopover key={p.id} priority={p}>
                <Button
                  style={{ backgroundColor: p.color + '33' }}
                  variant="ghost"
                  className={`w-full justify-start h-7 `}
                >
                  <div
                    className="w-2.5 h-2.5 rounded-full mr-2"
                    style={{ backgroundColor: p.color }}
                  />
                  {p.name}
                </Button>
              </PriorityEditPopover>
            ))}
          </div>

          <Separator />

          {/* Formulário para adicionar nova prioridade (sem alterações) */}
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
