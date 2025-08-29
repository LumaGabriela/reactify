import { useForm, router } from '@inertiajs/react'
import MotionDivOptions from '@/Components/MotionDivOptions'
/**
 * Componente para gerenciar as interfaces de um projeto (criação e edição).
 *
 * @param {{ project: object }} props
 */
const Interfaces = ({ project }) => {
  // A lista de todas as classes disponíveis para o formulário.
  const allClassModels = project.overall_model_classes || []
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  // Hook `useForm` do Inertia para gerenciar o estado completo do formulário.
  const {
    data,
    setData,
    post,
    patch,

    processing,
    errors,
    reset,
    clearErrors,
  } = useForm({
    id: null, // O 'id' diferencia se estamos criando (null) ou editando (number).
    title: '',
    type: 'internal',
    input: '',
    output: '',
    project_id: project.id,
    overall_model_class_ids: [],
  })

  // Abre o dialog para criar uma NOVA interface.
  const handleOpenForCreate = () => {
    clearErrors()
    reset() // Limpa o formulário para os valores iniciais.
    setData('project_id', project.id)
    setIsDialogOpen(true)
  }

  // Abre o dialog para EDITAR uma interface existente.
  const handleOpenForEdit = (interfaceData) => {
    clearErrors()
    // Preenche o formulário com os dados do card que foi clicado.
    setData({
      id: interfaceData.id,
      title: interfaceData.title,
      type: interfaceData.type,
      input: interfaceData.input,
      output: interfaceData.output,
      project_id: project.id,
      overall_model_class_ids: interfaceData.overall_model_class_ids || [],
    })
    setIsDialogOpen(true)
  }

  // Lida com a seleção (check/uncheck) de classes no formulário.
  const handleMultiSelectChange = (selectedId) => {
    const currentIds = data.overall_model_class_ids
    const newIds = currentIds.includes(selectedId)
      ? currentIds.filter((id) => id !== selectedId)
      : [...currentIds, selectedId]
    setData('overall_model_class_ids', newIds)
  }

  // Submete o formulário, decidindo entre POST (criar) ou PUT (atualizar).
  const handleSubmit = (e) => {
    e.preventDefault()
    const onSuccess = () => setIsDialogOpen(false)

    if (data.id) {
      // MODO EDIÇÃO: Envia uma requisição PUT para a rota de update.
      patch(route('system-interface.update', { interface: data.id }), {
        preserveScroll: true, // Mantém a posição do scroll na página após a resposta.
        onSuccess,
      })
    } else {
      // MODO CRIAÇÃO: Envia uma requisição POST para a rota de store.
      post(route('system-interface.store'), {
        preserveScroll: true,
        onSuccess,
      })
    }
    setData({
      id: null, // O 'id' diferencia se estamos criando (null) ou editando (number).
      title: '',
      type: 'internal',
      input: '',
      output: '',
      project_id: project.id,
      overall_model_class_ids: [],
    })
  }

  const handleDelete = (interfaceData) => {
    if (!interfaceData.id) return

    router.delete(
      route('system-interface.destroy', { interface: interfaceData.id }),
      {
        preserveScroll: true,
      },
    )
  }

  // --- Sub-componente para renderizar cada card ---
  const InterfaceCard = ({ data, onClick, onDelete }) => {
    const relatedIds = data.overall_model_class_ids || []
    const idsToString = relatedIds.length > 0 ? `C${relatedIds.join('-C')}` : ''
    const [isHovered, setIsHovered] = useState(false)
    return (
      <div
        className="relative group border border-border bg-card text-card-foreground rounded-lg shadow-md p-4 flex flex-col justify-between text-left cursor-pointer hover:shadow-lg hover:border-primary transition-all duration-200"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <MotionDivOptions
          isHovered={isHovered}
          onDelete={onDelete}
          onEdit={onClick}
        />
        <div>
          <h4 className="font-bold text-sm mb-2">{data.title}</h4>
          <p>
            <span className="font-bold text-sm">Input: </span>
            <span className="text-sm text-muted-foreground">{data.input}</span>
          </p>
          <p>
            <span className="font-bold text-sm">Output: </span>
            <span className="text-sm text-muted-foreground">{data.output}</span>
          </p>
        </div>
        <div className="flex justify-between items-center mt-4">
          <Button
            variant="secondary"
            className="pointer-events-none text-xs h-8"
          >
            ID: {data.id}
          </Button>
          {idsToString && (
            <Button
              variant="outline"
              className="text-sm font-semibold pointer-events-none h-8"
            >
              {idsToString}
            </Button>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="p-4">
      <div className="mb-2">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <Button onClick={handleOpenForCreate}>ADICIONAR INTERFACE</Button>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {data.id ? 'Editar Interface' : 'Adicionar Nova Interface'}
              </DialogTitle>
              <DialogDescription>
                Preencha os dados para {data.id ? 'atualizar' : 'criar'} a
                interface do sistema.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                {/* Título */}
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="title" className="text-right">
                    Título
                  </Label>
                  <Input
                    id="title"
                    value={data.title}
                    onChange={(e) => setData('title', e.target.value)}
                    className="col-span-3"
                  />
                  {errors.title && (
                    <p className="col-span-4 text-red-500 text-xs text-right">
                      {errors.title}
                    </p>
                  )}
                </div>
                {/* Tipo */}
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="type" className="text-right">
                    Tipo
                  </Label>
                  <Select
                    value={data.type}
                    onValueChange={(value) => setData('type', value)}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="internal">Interna</SelectItem>
                      <SelectItem value="external">Externa</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {/* Input */}
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="input" className="text-right">
                    Input
                  </Label>
                  <Input
                    id="input"
                    value={data.input}
                    onChange={(e) => setData('input', e.target.value)}
                    className="col-span-3"
                  />
                  {errors.input && (
                    <p className="col-span-4 text-red-500 text-xs text-right">
                      {errors.input}
                    </p>
                  )}
                </div>
                {/* Output */}
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="output" className="text-right">
                    Output
                  </Label>
                  <Input
                    id="output"
                    value={data.output}
                    onChange={(e) => setData('output', e.target.value)}
                    className="col-span-3"
                  />
                  {errors.output && (
                    <p className="col-span-4 text-red-500 text-xs text-right">
                      {errors.output}
                    </p>
                  )}
                </div>
                {/* Classes Relacionadas */}
                {data.type === 'internal' && (
                  <div className="grid grid-cols-4 items-start gap-4">
                    <Label className="text-right pt-2">Classes</Label>
                    <div className="col-span-3 border rounded-md p-2 h-32 overflow-y-auto">
                      {allClassModels.map((model) => (
                        <div
                          key={model.id}
                          className="flex items-center space-x-2 my-1"
                        >
                          <input
                            type="checkbox"
                            id={`rel-${model.id}`}
                            checked={data.overall_model_class_ids.includes(
                              model.id,
                            )}
                            onChange={() => handleMultiSelectChange(model.id)}
                            className="form-checkbox h-4 w-4"
                          />
                          <label
                            htmlFor={`rel-${model.id}`}
                            className="text-sm font-medium"
                          >
                            {model.name}
                          </label>
                        </div>
                      ))}
                      {errors.overall_model_class_ids && (
                        <p className="col-span-4 text-red-500 text-xs text-right">
                          {errors.overall_model_class_ids}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button type="submit" disabled={processing}>
                  {processing ? 'Salvando...' : 'Salvar'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <h3 className="text-2xl font-bold mb-4 mt-6">Interfaces Internas</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {project?.system_interfaces
          ?.filter((i) => i.type === 'internal')
          .map((item) => (
            <InterfaceCard
              key={`internal-${item.id}`}
              data={item}
              onDelete={() => handleDelete(item)}
              onClick={() => handleOpenForEdit(item)}
            />
          ))}
      </div>

      <h3 className="text-2xl font-bold mb-4">Interfaces Externas</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {project?.system_interfaces
          ?.filter((i) => i.type === 'external')
          .map((item) => (
            <InterfaceCard
              key={`external-${item.id}`}
              data={item}
              onClick={() => handleOpenForEdit(item)}
            />
          ))}
      </div>
    </div>
  )
}

export default Interfaces
