import React, { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion" // Importando framer-motion
import { X, Plus, Edit, Trash, UserCircle2, Check, Info } from "lucide-react"
import { router } from "@inertiajs/react"

// Componentes Shadcn (permanecem os mesmos)
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Separator } from "@/components/ui/separator"
import TextareaAutosize from "react-textarea-autosize"

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

  // Função para salvar ao pressionar Enter e não Shift+Enter
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      onSave()
    }
  }

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative flex min-h-[40px] items-center justify-between rounded-md p-2 transition-colors hover:bg-gray-700/50 cursor-default"
    >
      {isEditing ? (
        // --- NOVO MODO DE EDIÇÃO: Textarea com ícones ao lado ---
        <div className="flex flex-col w-full items-center gap-2">
          <TextareaAutosize
            ref={textareaRef}
            value={editValue || ""}
            onChange={onValueChange}
            onKeyDown={handleKeyDown}
            className="flex-1 resize-none rounded-md border border-gray-700 bg-gray-900/50 p-2 text-sm transition-colors duration-200 focus-visible:border-indigo-500"
            autoFocus
          />
          <div className="flex items-center gap-1">
            {/* Botão de Salvar (agora como ícone 'Check') */}
            <Button
              variant="ghost"
              size="icon"
              className="size-7 text-green-400 hover:bg-green-500/10 hover:text-green-400"
              onClick={onSave}
            >
              <Check className="size-4" />
            </Button>
            {/* Botão de Cancelar (agora como ícone 'X') */}
            <Button
              variant="ghost"
              size="icon"
              className="size-7 text-red-500/80 hover:bg-red-500/10 hover:text-red-500"
              onClick={() => onEdit(null)}
            >
              <X className="size-4" />
            </Button>
          </div>
        </div>
      ) : (
        // --- MODO DE VISUALIZAÇÃO ---
        <p
          className={`text-sm text-gray-300 pr-4 ${
            // Padding para não sobrepor o texto
            !item ? "italic text-gray-500" : ""
          }`}
        >
          {item || "Clique em editar para adicionar"}
        </p>
      )}

      {/* --- INTERAÇÃO DE HOVER RESTAURADA (versão original que você gostou) --- */}
      <AnimatePresence>
        {isHovered && !isEditing && (
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.2 }}
            className="absolute right-2 -translate-y-1/2 flex items-center rounded-md bg-gray-800 border border-gray-700 shadow-lg"
          >
            <Button
              variant="ghost"
              size="icon"
              className="size-7"
              onClick={onEdit}
            >
              <Edit className="size-4" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-red-500/80 hover:text-red-500"
              onClick={onDelete}
            >
              <Trash className="size-4" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
const Personas = ({ project, setProject }) => {
  const textareaRef = useRef(null)
  // Estado para controlar qual persona está expandida
  const [expandedPersona, setExpandedPersona] = useState(null)
  // Estado para controlar qual item está sendo editado
  const [editingField, setEditingField] = useState({
    personaId: null,
    field: null,
    itemIndex: null,
  })
  // Estado para armazenar o valor temporário durante a edição
  const [editValue, setEditValue] = useState("")
  // Estado para controlar qual item está com o diálogo de confirmação de exclusão aberto
  const [deleteConfirmItem, setDeleteConfirmItem] = useState({
    personaId: null,
    field: null,
    itemIndex: null,
  })
  // Estado para controlar qual persona está sendo editada
  const [editingPersona, setEditingPersona] = useState(null)
  // Estado para o nome da persona em edição
  const [editPersonaName, setEditPersonaName] = useState("")
  // Estado para confirmação de exclusão de persona
  const [deleteConfirmPersona, setDeleteConfirmPersona] = useState(null)
  // Estado para controlar submissão e prevenir múltiplos cliques
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Cores padrão do projeto para cada tipo de campo
  const colors = {
    profile: {
      text: "text-purple-2",
      border: "border-purple-2",
      bg: "bg-purple-2",
    },
    expectations: {
      text: "text-blue-400",
      border: "border-blue-400",
      bg: "bg-blue-400",
    },
    restrictions: {
      text: "text-red-400",
      border: "border-red-400",
      bg: "bg-red-400",
    },
    goals: {
      text: "text-green-400",
      border: "border-green-400",
      bg: "bg-green-400",
    },
  }

  // Função para iniciar a edição de um item
  const startEditField = (personaId, field, itemIndex) => {
    const persona = project.personas.find((p) => p.id === personaId)
    setEditingField({ personaId, field, itemIndex })
    setEditValue(persona[field][itemIndex])
  }

  // Função para iniciar a edição do nome da persona
  const startEditPersona = (personaId) => {
    const persona = project.personas.find((p) => p.id === personaId)
    setEditingPersona(personaId)
    setEditPersonaName(persona.name)
  }

  // Função para mostrar confirmação de exclusão de item
  const confirmDeleteItem = (personaId, field, itemIndex) => {
    setDeleteConfirmItem({ personaId, field, itemIndex })
  }

  // Função para mostrar confirmação de exclusão de persona
  const confirmDeletePersona = (personaId) => {
    setDeleteConfirmPersona(personaId)
  }

  // Função para adicionar uma nova persona
  const addNewPersona = () => {
    if (isSubmitting) return
    setIsSubmitting(true)

    const newPersona = {
      name: "Nova Persona",
      profile: [""],
      expectations: [""],
      restrictions: [""],
      goals: [""],
      project_id: project.id,
    }

    router.post("/persona", newPersona, {
      preserveState: true,
      preserveScroll: true,
      onSuccess: (page) => {
        // Atualiza o estado local apenas após confirmação do servidor
        const createdPersona = page.props.project.personas.find(
          (p) => !project.personas.find((existingP) => existingP.id === p.id)
        )

        if (createdPersona) {
          setProject({
            ...project,
            personas: [...project.personas, createdPersona],
          })
          // Expandir a persona recém-criada
          setExpandedPersona(createdPersona.id)
        }
        setIsSubmitting(false)
      },
      onError: (errors) => {
        console.error("Erro ao criar persona:", errors)
        setIsSubmitting(false)
      },
    })
  }

  // Função para salvar a edição do nome da persona
  const saveEditPersona = () => {
    const personaId = editingPersona
    if (personaId === null || !project.personas) return

    const updatedPersonas = project.personas.map((persona) =>
      persona.id === personaId ? { ...persona, name: editPersonaName } : persona
    )

    setProject({ ...project, personas: updatedPersonas })
    setEditingPersona(null)

    router.patch(`/persona/${personaId}`, {
      name: editPersonaName,
      project_id: project.id,
    })
  }

  // Função para salvar a edição de um item
  const saveEditField = () => {
    const { personaId, field, itemIndex } = editingField
    if (!personaId || !field || itemIndex === null) return

    // Encontra a persona específica
    const persona = project.personas.find((p) => p.id === personaId)
    if (!persona) return

    // Cria uma nova versão do array com a edição aplicada
    const updatedArray = [...persona[field]]
    updatedArray[itemIndex] = editValue

    // Cria uma nova lista de personas com a persona editada
    const updatedPersonas = project.personas.map((p) =>
      p.id === personaId ? { ...p, [field]: updatedArray } : p
    )

    // Atualiza o estado
    setProject({ ...project, personas: updatedPersonas })
    setEditingField({ personaId: null, field: null, itemIndex: null })

    // Envia a atualização para o servidor
    router.patch(`/persona/${personaId}`, {
      ...persona,
      [field]: updatedArray,
      project_id: project.id,
    })
  }

  // Função para excluir um item
  const deleteItem = () => {
    const { personaId, field, itemIndex } = deleteConfirmItem
    if (personaId === null || field === null || itemIndex === null) return

    // Encontra a persona pelo ID
    const persona = project.personas.find((p) => p.id === personaId)
    if (!persona || !persona[field] || itemIndex >= persona[field].length)
      return

    // Cria uma nova lista de itens removendo o item no índice especificado
    const updatedArray = [...persona[field]]
    updatedArray.splice(itemIndex, 1)

    // Se a lista ficou vazia, adiciona um item vazio
    if (updatedArray.length === 0) {
      updatedArray.push("")
    }

    // Cria uma nova lista de personas com a persona atualizada
    const updatedPersonas = project.personas.map((p) =>
      p.id === personaId ? { ...p, [field]: updatedArray } : p
    )

    // Atualiza o estado do projeto
    setProject({ ...project, personas: updatedPersonas })
    setDeleteConfirmItem({ personaId: null, field: null, itemIndex: null })

    // Envia a atualização para o servidor
    router.patch(`/persona/${personaId}`, {
      ...persona,
      [field]: updatedArray,
      project_id: project.id,
    })
  }

  // Função para excluir uma persona inteira
  const handleDeletePersona = () => {
    if (deleteConfirmPersona === null || !project.personas) return

    const updatedPersonas = project.personas.filter(
      (persona) => persona.id !== deleteConfirmPersona
    )

    setExpandedPersona(null)
    setDeleteConfirmPersona(null)

    setProject((prevProject) => ({
      ...prevProject,
      personas: updatedPersonas,
    }))

    router.delete(`/persona/${deleteConfirmPersona}`)
  }

  // Função para adicionar um novo item a um campo
  const addNewItem = (personaId, field) => {
    if (!project.personas) return

    // Encontra a persona pelo ID
    const persona = project.personas.find((p) => p.id === personaId)
    if (!persona) return

    // Adiciona um novo item vazio ao campo
    const updatedArray = [...persona[field], ""]

    // Cria uma nova lista de personas com a persona atualizada
    const updatedPersonas = project.personas.map((p) =>
      p.id === personaId ? { ...p, [field]: updatedArray } : p
    )

    // Atualiza o estado do projeto
    setProject({ ...project, personas: updatedPersonas })

    // Envia a atualização para o servidor
    router.patch(`/persona/${personaId}`, {
      ...persona,
      [field]: updatedArray,
      project_id: project.id,
    })
  }

  // Função para obter o título adequado para cada campo
  const getFieldTitle = (field) => {
    switch (field) {
      case "profile":
        return "Perfil"
      case "expectations":
        return "Expectativas"
      case "restrictions":
        return "Restrições"
      case "goals":
        return "Objetivos"
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
    // O TooltipProvider foi removido daqui, pois não há mais tooltips.
    <div className="grid grid-cols-1 gap-2 w-full p-4">
      {/* Cabeçalho da Seção */}
      <div className="col-span-1 flex flex-col sm:flex-row gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button className="flex flex-1 items-center justify-center gap-2 p-2 rounded-lg text-white bg-gray-800 hover:bg-gray-600 transition-colors">
              <UserCircle2 className="size-4 text-indigo-400" />
              Personas
              <Badge className="!bg-indigo-400 border-0">
                {project?.personas?.length || 0}
              </Badge>
              <Info className="size-4 text-muted-foreground" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="bg-gray-800 text-white">
            As personas representam os arquétipos de usuários do seu sistema...
          </PopoverContent>
        </Popover>
        <Button
          onClick={addNewPersona}
          disabled={isSubmitting}
          className="flex-1 sm:w-auto bg-indigo-400 hover:bg-indigo-500"
        >
          <Plus
            size={18}
            className="mr-2"
          />
          {isSubmitting ? "Criando..." : "Nova Persona"}
        </Button>
      </div>

      {/* Grid de Personas */}
      {project.personas && project.personas.length > 0 ? (
        project.personas
          .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
          .map((persona) => (
            <Card
              key={persona.id}
              className="col-span-1 dark:bg-gray-800 border-0 animate-fade-in"
            >
              <CardHeader className="flex-row items-center justify-between">
                <div className="flex items-center gap-3">
                  <UserCircle2 className="h-8 w-8 text-indigo-400" />
                  {editingPersona === persona.id ? (
                    <Input
                      type="text"
                      value={editPersonaName}
                      onChange={(e) => setEditPersonaName(e.target.value)}
                      onKeyUp={(e) => {
                        if (e.key === "Enter") saveEditPersona()
                      }}
                      className="text-xl font-bold"
                      autoFocus
                    />
                  ) : (
                    <CardTitle className="text-xl">{persona.name}</CardTitle>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  {/* Botões de Salvar/Editar Nome sem Tooltip */}
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
                  {/* Botão de Excluir Persona sem Tooltip */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-red-500/80 hover:text-red-500"
                    onClick={() => confirmDeletePersona(persona.id)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
                {["profile", "expectations", "goals"].map((field) => (
                  <div
                    key={field}
                    className="flex flex-col gap-2 p-3 rounded-lg bg-black/20 border border-gray-800"
                  >
                    <div className="flex items-center justify-between">
                      <h4
                        className={`font-semibold text-sm ${colors[field].text}`}
                      >
                        {getFieldTitle(field)}
                      </h4>
                      {/* Botão de Adicionar Item sem Tooltip */}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => addNewItem(persona.id, field)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <Separator className="bg-gray-700" />
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
        <div className="col-span-1 flex flex-col items-center justify-center p-10 bg-gray-900/50 border border-dashed border-gray-800 rounded-lg text-center">
          <UserCircle2
            size={40}
            className="mb-4 text-indigo-400"
          />
          <h3 className="text-xl font-semibold">Nenhuma persona definida</h3>
          <p className="text-muted-foreground mt-2">
            Crie sua primeira persona para mapear os usuários do seu projeto.
          </p>
        </div>
      )}

      {/* AlertDialogs para Exclusão (sem alterações) */}
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
