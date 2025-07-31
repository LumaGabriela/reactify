import { useState, useRef, useEffect } from 'react'
import { router } from '@inertiajs/react'
import MotionDivOptions from '@/Components/MotionDivOptions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, Check, X, Edit } from 'lucide-react' // Importei o ícone Edit
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

// Componente Reutilizável: EditableListItem.js (sem alterações)
const EditableListItem = ({
  item,
  isEditing,
  editValue,
  onValueChange,
  onSave,
  onCancel,
  onEdit,
  onDelete,
}) => {
  const [isHovered, setIsHovered] = useState(false)
  const inputRef = useRef(null)

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus()
    }
  }, [isEditing])

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      onSave()
    } else if (e.key === 'Escape') {
      onCancel()
    }
  }

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative flex items-center min-h-[32px] rounded-md transition-colors hover:bg-muted/50 px-2"
    >
      {isEditing ? (
        <div className="flex items-center gap-2 w-full">
          <Input
            ref={inputRef}
            type="text"
            value={editValue}
            onChange={onValueChange}
            onKeyDown={handleKeyDown}
            className="h-8 flex-1"
          />
          <Button
            variant="ghost"
            size="icon"
            className="size-7 text-green-500 hover:bg-green-500/10 hover:text-green-500"
            onClick={onSave}
          >
            <Check className="size-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="size-7 text-destructive hover:bg-destructive/10 hover:text-destructive"
            onClick={onCancel}
          >
            <X className="size-4" />
          </Button>
        </div>
      ) : (
        <>
          <p className="text-sm flex-1">{item}</p>
          <MotionDivOptions
            isHovered={isHovered}
            isEditing={isEditing}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        </>
      )}
    </div>
  )
}

// Componente CRCCard Atualizado
const CRCCard = ({
  card,
  project,
  setProject,
  editingField,
  setEditingField,
  editValue,
  setEditValue,
  confirmDeleteItem,
  // NOVAS PROPS PARA EDIÇÃO DO TÍTULO
  editingTitleId,
  startEditTitle,
  saveEditTitle,
  cancelEditTitle,
}) => {
  // NOVO ESTADO LOCAL para controlar o hover do cabeçalho
  const [isHeaderHovered, setIsHeaderHovered] = useState(false)
  const titleInputRef = useRef(null)

  useEffect(() => {
    if (editingTitleId === card.id) {
      titleInputRef.current?.focus()
    }
  }, [editingTitleId, card.id])

  const handleTitleKeyDown = (e) => {
    if (e.key === 'Enter') saveEditTitle()
    if (e.key === 'Escape') cancelEditTitle()
  }

  const startEdit = (cardId, field, itemIndex) => {
    setEditingField({ cardId, field, itemIndex })
    setEditValue(card[field][itemIndex])
  }

  const addNewItem = (cardId, field) => {
    if (!card[field]) return
    const updatedArray = [...card[field], 'Novo item...']
    const updatedCards = project.crc_cards.map((c) =>
      c.id === cardId ? { ...c, [field]: updatedArray } : c,
    )
    setProject({ ...project, crc_cards: updatedCards })
    // router.patch(
    //   `/crc_cards/${cardId}`,
    //   { [field]: updatedArray, project_id: project.id },
    //   { preserveState: true, preserveScroll: true },
    // )
  }

  return (
    <div className="relative group bg-card border border-border rounded-lg shadow-lg flex flex-col text-muted-foreground">
      {/* LÓGICA DE EDIÇÃO DO TÍTULO ADICIONADA AQUI */}
      <div
        onMouseEnter={() => setIsHeaderHovered(true)}
        onMouseLeave={() => setIsHeaderHovered(false)}
        className="relative flex justify-between items-center text-foreground bg-muted p-3 rounded-t-lg border-border border-b"
      >
        {editingTitleId === card.id ? (
          <div className="flex items-center gap-2 w-full">
            <Input
              ref={titleInputRef}
              type="text"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onKeyDown={handleTitleKeyDown}
              className="h-9 text-lg font-semibold flex-1"
            />
            <Button
              variant="ghost"
              size="icon"
              className="size-8 text-green-500 hover:bg-green-500/10 hover:text-green-500"
              onClick={saveEditTitle}
            >
              <Check className="size-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="size-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
              onClick={cancelEditTitle}
            >
              <X className="size-5" />
            </Button>
          </div>
        ) : (
          <>
            <h3 className="text-lg font-semibold">{card.class}</h3>
            <span className="text-sm font-bold ">{card.id}</span>
            <MotionDivOptions
              isHovered={isHeaderHovered}
              onEdit={() => startEditTitle(card)}
            />
          </>
        )}
      </div>

      <div className="flex flex-grow">
        {/* Seção de Responsabilidades */}
        <div className="w-1/2 p-3 flex flex-col gap-1">
          <div className="flex justify-between items-center mb-1">
            <span></span>
            <h4 className="font-semibold text-sm">Responsabilidades</h4>
            <Button
              variant="ghost"
              size="icon"
              className="size-6"
              onClick={() => addNewItem(card.id, 'responsabilities')}
            >
              <Plus className="size-4" />
            </Button>
          </div>
          {card.responsabilities.map((resp, i) => (
            <EditableListItem
              key={`${card.id}-resp-${i}`}
              item={resp}
              isEditing={
                editingField.cardId === card.id &&
                editingField.field === 'responsabilities' &&
                editingField.itemIndex === i
              }
              editValue={editValue}
              onValueChange={(e) => setEditValue(e.target.value)}
              onEdit={() => startEdit(card.id, 'responsabilities', i)}
              onSave={saveEditTitle}
              onCancel={() =>
                setEditingField({ cardId: null, field: null, itemIndex: null })
              }
              onDelete={() => confirmDeleteItem(card.id, 'responsabilities', i)}
            />
          ))}
        </div>

        {/* Seção de Colaboradores */}
        <div className="w-1/2 bg-muted/50 p-3 border-l border-border rounded-br-lg flex flex-col gap-1">
          <div className="flex justify-between items-center mb-1">
            <span></span>
            <h4 className="font-semibold text-sm">Colaboradores</h4>
            <Button
              variant="ghost"
              size="icon"
              className="size-6"
              onClick={() => addNewItem(card.id, 'collaborators')}
            >
              <Plus className="size-4" />
            </Button>
          </div>
          {card.collaborators.map((collab, i) => (
            <EditableListItem
              key={`${card.id}-collab-${i}`}
              item={collab}
              isEditing={
                editingField.cardId === card.id &&
                editingField.field === 'collaborators' &&
                editingField.itemIndex === i
              }
              editValue={editValue}
              onValueChange={(e) => setEditValue(e.target.value)}
              onEdit={() => startEdit(card.id, 'collaborators', i)}
              onSave={saveEditTitle}
              onCancel={() =>
                setEditingField({ cardId: null, field: null, itemIndex: null })
              }
              onDelete={() => confirmDeleteItem(card.id, 'collaborators', i)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

// Componente Pai com toda a Lógica de Estado
const OverallModel = ({ project, setProject }) => {
  // Estado para editar itens da lista
  const [editingField, setEditingField] = useState({
    cardId: null,
    field: null,
    itemIndex: null,
  })

  // NOVO ESTADO: para editar o título do card
  const [editingTitleId, setEditingTitleId] = useState(null)

  const [editValue, setEditValue] = useState('')
  const [deleteConfirmItem, setDeleteConfirmItem] = useState({
    cardId: null,
    field: null,
    itemIndex: null,
  })

  // NOVAS FUNÇÕES: para o título do card
  const startEditTitle = (card) => {
    setEditingTitleId(card.id)
    setEditValue(card.class)
  }

  const cancelEditTitle = () => {
    setEditingTitleId(null)
    setEditValue('')
  }

  const saveEditTitle = () => {
    if (editingTitleId === null) return

    // 1. Atualiza a UI Otimista
    const updatedCards = project.crc_cards.map((c) =>
      c.id === editingTitleId ? { ...c, class: editValue } : c,
    )
    setProject({ ...project, crc_cards: updatedCards })

    // 2. Envia para o backend
    // router.patch(
    //   `/crc_cards/${editingTitleId}`,
    //   {
    //     class: editValue,
    //     project_id: project.id,
    //   },
    //   {
    //     preserveState: true,
    //     preserveScroll: true,
    //     onSuccess: () => {
    //       cancelEditTitle() // Limpa o estado após sucesso
    //     },
    //   },
    // )
  }

  // Funções existentes para os itens da lista
  const saveEditListItem = () => {
    const { cardId, field, itemIndex } = editingField
    if (cardId === null) return
    const card = project.crc_cards.find((c) => c.id === cardId)
    if (!card) return
    const updatedArray = [...card[field]]
    updatedArray[itemIndex] = editValue
    const updatedCards = project.crc_cards.map((c) =>
      c.id === cardId ? { ...c, [field]: updatedArray } : c,
    )
    setProject({ ...project, crc_cards: updatedCards })
    setEditingField({ cardId: null, field: null, itemIndex: null })
    // router.patch(
    //   `/crc_cards/${cardId}`,
    //   { [field]: updatedArray, project_id: project.id },
    //   { preserveState: true, preserveScroll: true },
    // )
  }

  const handleDeleteItem = () => {
    const { cardId, field, itemIndex } = deleteConfirmItem
    if (cardId === null) return
    const card = project.crc_cards.find((c) => c.id === cardId)
    const updatedArray = card[field].filter((_, i) => i !== itemIndex)
    const updatedCards = project.crc_cards.map((c) =>
      c.id === cardId ? { ...c, [field]: updatedArray } : c,
    )
    setProject({ ...project, crc_cards: updatedCards })
    setDeleteConfirmItem({ cardId: null, field: null, itemIndex: null })
    // router.patch(
    //   `/crc_cards/${cardId}`,
    //   { [field]: updatedArray, project_id: project.id },
    //   { preserveState: true, preserveScroll: true },
    // )
  }

  const confirmDeleteItem = (cardId, field, itemIndex) => {
    setDeleteConfirmItem({ cardId, field, itemIndex })
  }

  // Uma função unificada para salvar, dependendo do que está em edição
  const handleSave = () => {
    if (editingTitleId) {
      saveEditTitle()
    } else if (editingField.cardId) {
      saveEditListItem()
    }
  }

  return (
    <div className="p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {project?.crc_cards?.map((card) => (
          <CRCCard
            key={card.id}
            card={card}
            project={project}
            setProject={setProject}
            // Props para itens da lista
            editingField={editingField}
            setEditingField={setEditingField}
            confirmDeleteItem={confirmDeleteItem}
            // Props para o título do card
            editingTitleId={editingTitleId}
            startEditTitle={startEditTitle}
            saveEditTitle={handleSave}
            cancelEditTitle={cancelEditTitle}
            // Props compartilhadas
            editValue={editValue}
            setEditValue={setEditValue}
          />
        ))}
      </div>

      <AlertDialog
        open={deleteConfirmItem.cardId !== null}
        onOpenChange={() =>
          setDeleteConfirmItem({ cardId: null, field: null, itemIndex: null })
        }
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            {' '}
            <AlertDialogTitle>Excluir este item?</AlertDialogTitle>{' '}
            <AlertDialogDescription>
              {' '}
              Esta ação não pode ser desfeita.{' '}
            </AlertDialogDescription>{' '}
          </AlertDialogHeader>
          <AlertDialogFooter>
            {' '}
            <AlertDialogCancel>Cancelar</AlertDialogCancel>{' '}
            <AlertDialogAction onClick={handleDeleteItem}>
              {' '}
              Sim, excluir{' '}
            </AlertDialogAction>{' '}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default OverallModel
