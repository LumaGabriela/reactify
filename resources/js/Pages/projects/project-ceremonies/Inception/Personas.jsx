import { X, Plus, Edit, Trash, UserCircle2, Check, Info } from 'lucide-react'
import { router } from '@inertiajs/react'
import MotionDivOptions from '@/Components/MotionDivOptions'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
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
import { Separator } from '@/components/ui/separator'
import TextareaAutosize from 'react-textarea-autosize'

const PersonaItem = ({
  item,
  isEditing,
  editValue,
  onValueChange,
  onEdit,
  onSave,
  onDelete,
  textareaRef,
}) => {
  const [isHovered, setIsHovered] = useState(false)

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      onSave()
    }
  }

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative flex min-h-[40px] items-center justify-between rounded p-2 transition-colors font-normal hover:bg-muted/50 cursor-default"
    >
      {isEditing ? (
        <div className="flex w-full items-center gap-2">
          <TextareaAutosize
            ref={textareaRef}
            value={editValue || ''}
            onChange={onValueChange}
            onKeyDown={handleKeyDown}
            className="bg-transparent border-0  w-full rounded text-sm"
            autoFocus
          />
          {/* <div className="flex items-center gap-1">
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
              onClick={() => onEdit(null)}
            >
              <X className="size-4" />
            </Button>
          </div>*/}
        </div>
      ) : (
        <p
          className={`text-sm text-muted-foreground text-left pr-4 ${
            !item ? 'italic text-muted-foreground/50' : ''
          }`}
        >
          {item || 'Clique em editar para adicionar'}
        </p>
      )}

      <MotionDivOptions
        isHovered={isHovered}
        isEditing={isEditing}
        // isTemporary={isTemporary}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    </div>
  )
}

const Personas = ({ project, setProject }) => {
  const textareaRef = useRef(null)
  const [editingField, setEditingField] = useState({
    personaId: null,
    field: null,
    itemIndex: null,
  })
  const [editValue, setEditValue] = useState('')
  const [deleteConfirmItem, setDeleteConfirmItem] = useState({
    personaId: null,
    field: null,
    itemIndex: null,
  })
  const [editingPersona, setEditingPersona] = useState(null)
  const [editPersonaName, setEditPersonaName] = useState('')
  const [deleteConfirmPersona, setDeleteConfirmPersona] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const personaFieldVariants = {
    profile: { text: 'text-primary' },
    expectations: { text: 'text-blue-400' },
    goals: { text: 'text-green-400' },
  }

  const startEditField = (personaId, field, itemIndex) => {
    const persona = project.personas.find((p) => p.id === personaId)
    setEditingField({ personaId, field, itemIndex })
    setEditValue(persona[field][itemIndex])
  }

  const startEditPersona = (personaId) => {
    const persona = project.personas.find((p) => p.id === personaId)
    setEditingPersona(personaId)
    setEditPersonaName(persona.name)
  }

  const confirmDeleteItem = (personaId, field, itemIndex) => {
    setDeleteConfirmItem({ personaId, field, itemIndex })
  }

  const confirmDeletePersona = (personaId) => {
    setDeleteConfirmPersona(personaId)
  }

  const addNewPersona = () => {
    if (isSubmitting) return
    setIsSubmitting(true)

    const newPersona = {
      name: 'Nova Persona',
      profile: [],
      expectations: [],
      goals: [],
      project_id: project.id,
    }

    router.post('/persona', newPersona, {
      preserveState: true,
      preserveScroll: true,
      onSuccess: (page) => {
        const createdPersona = page.props.project.personas.find(
          (p) => !project.personas.find((existingP) => existingP.id === p.id),
        )

        if (createdPersona) {
          setProject({
            ...project,
            personas: [...project.personas, createdPersona],
          })
        }
        setIsSubmitting(false)
      },
      onError: (errors) => {
        console.error('Erro ao criar persona:', errors)
        setIsSubmitting(false)
      },
    })
  }

  const saveEditPersona = () => {
    const personaId = editingPersona
    if (personaId === null || !project.personas) return

    const updatedPersonas = project.personas.map((persona) =>
      persona.id === personaId
        ? { ...persona, name: editPersonaName }
        : persona,
    )

    setProject({ ...project, personas: updatedPersonas })
    setEditingPersona(null)

    router.patch(route('persona.update', personaId), {
      [field]: updatedArray,
      project_id: project.id,
    })
  }

  const saveEditField = () => {
    const { personaId, field, itemIndex } = editingField
    if (!personaId || !field || itemIndex === null) return

    const persona = project.personas.find((p) => p.id === personaId)
    if (!persona) return

    const updatedArray = [...persona[field]]
    updatedArray[itemIndex] = editValue

    const updatedPersonas = project.personas.map((p) =>
      p.id === personaId ? { ...p, [field]: updatedArray } : p,
    )

    setProject({ ...project, personas: updatedPersonas })
    setEditingField({ personaId: null, field: null, itemIndex: null })

    router.patch(route('persona.update', personaId), {
      // ...persona,
      [field]: updatedArray,
      project_id: project.id,
    })
  }

  const deleteItem = () => {
    const { personaId, field, itemIndex } = deleteConfirmItem
    if (personaId === null || field === null || itemIndex === null) return

    const persona = project.personas.find((p) => p.id === personaId)
    if (!persona || !persona[field] || itemIndex >= persona[field].length)
      return

    const updatedArray = [...persona[field]]
    updatedArray.splice(itemIndex, 1)

    if (updatedArray.length === 0) {
      updatedArray.push('')
    }

    const updatedPersonas = project.personas.map((p) =>
      p.id === personaId ? { ...p, [field]: updatedArray } : p,
    )

    setProject({ ...project, personas: updatedPersonas })
    setDeleteConfirmItem({ personaId: null, field: null, itemIndex: null })

    router.patch(route('persona.update', personaId), {
      // ...persona,
      [field]: updatedArray,
      project_id: project.id,
    })
  }

  const handleDeletePersona = () => {
    if (deleteConfirmPersona === null || !project.personas) return

    const updatedPersonas = project.personas.filter(
      (persona) => persona.id !== deleteConfirmPersona,
    )

    setDeleteConfirmPersona(null)

    setProject((prevProject) => ({
      ...prevProject,
      personas: updatedPersonas,
    }))

    router.delete(route('persona.delete', deleteConfirmPersona))
  }

  const addNewItem = (personaId, field) => {
    if (!project.personas) return

    const persona = project.personas.find((p) => p.id === personaId)
    if (!persona) return

    const updatedArray = [...persona[field], '']

    const updatedPersonas = project.personas.map((p) =>
      p.id === personaId ? { ...p, [field]: updatedArray } : p,
    )

    setProject({ ...project, personas: updatedPersonas })

    router.patch(route('persona.update', personaId), {
      // ...persona,
      [field]: updatedArray,
      project_id: project.id,
    })
  }

  const getFieldTitle = (field) => {
    switch (field) {
      case 'profile':
        return 'Perfil'
      case 'expectations':
        return 'Expectativas'
      case 'goals':
        return 'Objetivos'
      default:
        return field
    }
  }

  useEffect(() => {
    if (editingField.personaId && textareaRef.current) {
      textareaRef.current.focus()
    }
  }, [editingField])

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-2 w-full p-4">
      <div className="xl:col-span-2 flex flex-col sm:flex-row gap-2">
        <Button
          variant="secondary"
          onClick={addNewPersona}
          disabled={isSubmitting}
          className="flex items-center justify-center w-full py-1 bg-card hover:bg-accent text-primary rounded-lg transition-colors shadow-md"
        >
          <Plus size={18} className="mr-2" />
          {isSubmitting ? 'Criando...' : 'Nova Persona'}
        </Button>
      </div>

      {project.personas && project.personas.length > 0 ? (
        project.personas
          .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
          .map((persona) => (
            <Card
              key={persona.id}
              className="col-span-1 bg-card border-0 animate-fade-in rounded"
            >
              <CardHeader className="flex-row items-center justify-between">
                <div className="flex items-center gap-3">
                  <UserCircle2 className=" shrink-0 size-8 text-primary" />
                  {editingPersona === persona.id ? (
                    <Input
                      type="text"
                      value={editPersonaName}
                      onChange={(e) => setEditPersonaName(e.target.value)}
                      onKeyUp={(e) => {
                        if (e.key === 'Enter') saveEditPersona()
                      }}
                      className="!text-xl font-bold"
                      autoFocus
                    />
                  ) : (
                    <CardTitle className="ml-3 text-xl">
                      {persona.name}
                    </CardTitle>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  {editingPersona === persona.id ? (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={saveEditPersona}
                    >
                      <Check className="h-4 w-4 text-green-500" />
                    </Button>
                  ) : (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => startEditPersona(persona.id)}
                    >
                      <Edit className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive/80 hover:text-destructive"
                    onClick={() => confirmDeletePersona(persona.id)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="persona grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 p-2 gap-2">
                {['profile', 'expectations', 'goals'].map((field) => (
                  <div
                    key={field}
                    className="flex flex-col gap-2 p-3 rounded-lg bg-card border-border border-2"
                  >
                    <div className="flex items-center justify-between">
                      <h4
                        className={`font-semibold text-sm ${personaFieldVariants[field].text}`}
                      >
                        {getFieldTitle(field)}
                      </h4>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-6"
                        onClick={() => addNewItem(persona.id, field)}
                      >
                        <Plus className="size-4" />
                      </Button>
                    </div>
                    <Separator />
                    <div className="flex flex-col gap-2">
                      {persona[field].map((item, itemIndex) => (
                        <PersonaItem
                          key={itemIndex}
                          item={item}
                          isEditing={
                            editingField.personaId === persona.id &&
                            editingField.field === field &&
                            editingField.itemIndex === itemIndex
                          }
                          editValue={editValue}
                          onValueChange={(e) => setEditValue(e.target.value)}
                          onEdit={() =>
                            startEditField(persona.id, field, itemIndex)
                          }
                          onSave={saveEditField}
                          onDelete={() =>
                            confirmDeleteItem(persona.id, field, itemIndex)
                          }
                          textareaRef={
                            editingField.personaId === persona.id &&
                            editingField.field === field &&
                            editingField.itemIndex === itemIndex
                              ? textareaRef
                              : null
                          }
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))
      ) : (
        <div className="col-span-1 flex flex-col items-center justify-center p-10 bg-muted/50 border-dashed border rounded-lg text-center">
          <UserCircle2 size={40} className="mb-4 text-primary" />
          <h3 className="text-xl font-semibold">Nenhuma persona definida</h3>
          <p className="text-muted-foreground mt-2">
            Crie sua primeira persona para mapear os usuários do seu projeto.
          </p>
        </div>
      )}

      <AlertDialog
        open={deleteConfirmPersona !== null}
        onOpenChange={() => setDeleteConfirmPersona(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Isso excluirá permanentemente a
              persona e todos os seus dados.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeletePersona}>
              Sim, excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={deleteConfirmItem.personaId !== null}
        onOpenChange={() =>
          setDeleteConfirmItem({
            personaId: null,
            field: null,
            itemIndex: null,
          })
        }
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir este item?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={deleteItem}>
              Sim, excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default Personas
