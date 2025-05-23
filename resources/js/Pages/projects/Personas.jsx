
import React, { useState, useEffect, useRef } from 'react';
import { User, Plus, ChevronDown, ChevronRight, Edit, Trash, UserCircle2 } from 'lucide-react';
import { router } from '@inertiajs/react';
import { ModalConfirmation } from '@/Components/Modals';
import TextArea from '@/Components/TextArea';

const Personas = ({ project, setProject }) => {
  const textareaRef = useRef(null);
  // Estado para controlar qual persona está expandida
  const [expandedPersona, setExpandedPersona] = useState(null);
  // Estado para controlar qual item está sendo editado
  const [editingField, setEditingField] = useState({ personaId: null, field: null, itemIndex: null });
  // Estado para armazenar o valor temporário durante a edição
  const [editValue, setEditValue] = useState('');
  // Estado para controlar qual item está com o diálogo de confirmação de exclusão aberto
  const [deleteConfirmItem, setDeleteConfirmItem] = useState({ personaId: null, field: null, itemIndex: null });
  // Estado para controlar qual persona está sendo editada
  const [editingPersona, setEditingPersona] = useState(null);
  // Estado para o nome da persona em edição
  const [editPersonaName, setEditPersonaName] = useState('');
  // Estado para confirmação de exclusão de persona
  const [deleteConfirmPersona, setDeleteConfirmPersona] = useState(null);
  // Estado para controlar submissão e prevenir múltiplos cliques
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Cores padrão do projeto para cada tipo de campo
  const colors = {
    profile: { text: 'text-purple-2', border: 'border-purple-2', bg: 'bg-purple-2' },
    expectations: { text: 'text-blue-400', border: 'border-blue-400', bg: 'bg-blue-400' },
    restrictions: { text: 'text-red-400', border: 'border-red-400', bg: 'bg-red-400' },
    goals: { text: 'text-green-400', border: 'border-green-400', bg: 'bg-green-400' }
  };

  // Função para ajustar a altura do textarea
  const adjustTextAreaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.resize = 'none';
      textarea.style.webkitAppearence = 'none';
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  // Aciona a função sempre que o texto do textarea mudar
  useEffect(() => {
    adjustTextAreaHeight();
  }, [editValue, editingField]);

  // Função para expandir/recolher uma persona
  const togglePersona = (personaId) => {
    if (expandedPersona === personaId) {
      setExpandedPersona(null);
    } else {
      setExpandedPersona(personaId);
    }
  };

  // Função para iniciar a edição de um item
  const startEditField = (personaId, field, itemIndex) => {
    const persona = project.personas.find((p) => p.id === personaId);
    setEditingField({ personaId, field, itemIndex });
    setEditValue(persona[field][itemIndex]);
  };

  // Função para iniciar a edição do nome da persona
  const startEditPersona = (personaId) => {
    const persona = project.personas.find((p) => p.id === personaId);
    setEditingPersona(personaId);
    setEditPersonaName(persona.name);
  };

  // Função para mostrar confirmação de exclusão de item
  const confirmDeleteItem = (personaId, field, itemIndex) => {
    setDeleteConfirmItem({ personaId, field, itemIndex });
  };

  // Função para mostrar confirmação de exclusão de persona
  const confirmDeletePersona = (personaId) => {
    setDeleteConfirmPersona(personaId);
  };

  // Função para adicionar uma nova persona
  const addNewPersona = () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    const newPersona = {
      name: 'Nova Persona',
      profile: [''],
      expectations: [''],
      restrictions: [''],
      goals: [''],
      project_id: project.id,
    };

    router.post('/persona', newPersona, {
      preserveState: true,
      onSuccess: (page) => {
        // Atualiza o estado local apenas após confirmação do servidor
        const createdPersona = page.props.project.personas.find(
          p => !project.personas.find(existingP => existingP.id === p.id)
        );

        if (createdPersona) {
          setProject({
            ...project,
            personas: [...project.personas, createdPersona]
          });
          // Expandir a persona recém-criada
          setExpandedPersona(createdPersona.id);
        }
        setIsSubmitting(false);
      },
      onError: (errors) => {
        console.error('Erro ao criar persona:', errors);
        setIsSubmitting(false);
      }
    });
  };

  // Função para salvar a edição do nome da persona
  const saveEditPersona = () => {
    const personaId = editingPersona;
    if (personaId === null || !project.personas) return;

    const updatedPersonas = project.personas.map(persona =>
      persona.id === personaId
        ? { ...persona, name: editPersonaName }
        : persona
    );

    setProject({ ...project, personas: updatedPersonas });
    setEditingPersona(null);

    router.patch(`/persona/${personaId}`, {
      name: editPersonaName,
      project_id: project.id
    });
  };

  // Função para salvar a edição de um item
  const saveEditField = () => {
    const { personaId, field, itemIndex } = editingField;
    if (!personaId || !field || itemIndex === null) return;

    // Encontra a persona específica
    const persona = project.personas.find(p => p.id === personaId);
    if (!persona) return;

    // Cria uma nova versão do array com a edição aplicada
    const updatedArray = [...persona[field]];
    updatedArray[itemIndex] = editValue;

    // Cria uma nova lista de personas com a persona editada
    const updatedPersonas = project.personas.map(p =>
      p.id === personaId ? { ...p, [field]: updatedArray } : p
    );

    // Atualiza o estado
    setProject({ ...project, personas: updatedPersonas });
    setEditingField({ personaId: null, field: null, itemIndex: null });

    // Envia a atualização para o servidor
    router.patch(`/persona/${personaId}`, {
      ...persona,
      [field]: updatedArray,
      project_id: project.id
    });
  };

  // Função para excluir um item
  const deleteItem = () => {
    const { personaId, field, itemIndex } = deleteConfirmItem;
    if (personaId === null || field === null || itemIndex === null) return;

    // Encontra a persona pelo ID
    const persona = project.personas.find(p => p.id === personaId);
    if (!persona || !persona[field] || itemIndex >= persona[field].length) return;

    // Cria uma nova lista de itens removendo o item no índice especificado
    const updatedArray = [...persona[field]];
    updatedArray.splice(itemIndex, 1);

    // Se a lista ficou vazia, adiciona um item vazio
    if (updatedArray.length === 0) {
      updatedArray.push('');
    }

    // Cria uma nova lista de personas com a persona atualizada
    const updatedPersonas = project.personas.map(p =>
      p.id === personaId ? { ...p, [field]: updatedArray } : p
    );

    // Atualiza o estado do projeto
    setProject({ ...project, personas: updatedPersonas });
    setDeleteConfirmItem({ personaId: null, field: null, itemIndex: null });

    // Envia a atualização para o servidor
    router.patch(`/persona/${personaId}`, {
      ...persona,
      [field]: updatedArray,
      project_id: project.id
    });
  };

  // Função para excluir uma persona inteira
  const handleDeletePersona = () => {
    if (deleteConfirmPersona === null || !project.personas) return;

    const updatedPersonas = project.personas.filter((persona) => persona.id !== deleteConfirmPersona);

    setExpandedPersona(null);
    setDeleteConfirmPersona(null);

    setProject((prevProject) => ({
      ...prevProject,
      personas: updatedPersonas,
    }));

    router.delete(`/persona/${deleteConfirmPersona}`);
  };

  // Função para adicionar um novo item a um campo
  const addNewItem = (personaId, field) => {
    if (!project.personas) return;

    // Encontra a persona pelo ID
    const persona = project.personas.find(p => p.id === personaId);
    if (!persona) return;

    // Adiciona um novo item vazio ao campo
    const updatedArray = [...persona[field], ''];

    // Cria uma nova lista de personas com a persona atualizada
    const updatedPersonas = project.personas.map(p =>
      p.id === personaId ? { ...p, [field]: updatedArray } : p
    );

    // Atualiza o estado do projeto
    setProject({ ...project, personas: updatedPersonas });

    // Envia a atualização para o servidor
    router.patch(`/persona/${personaId}`, {
      ...persona,
      [field]: updatedArray,
      project_id: project.id
    });
  };

  // Função para obter o título adequado para cada campo
  const getFieldTitle = (field) => {
    switch (field) {
      case 'profile':
        return 'Perfil';
      case 'expectations':
        return 'Expectativas';
      case 'restrictions':
        return 'Restrições';
      case 'goals':
        return 'Objetivos';
      default:
        return field;
    }
  };

  return (
    <div className="grid md:grid-cols-2 grid-flow-dense gap-4 w-full p-4">
      {project.personas && project.personas.length > 0 ? (
        project.personas
          .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
          .map((persona) => (
            <div
              key={persona.id}
              className="persona bg-gray-3 rounded-lg shadow-md overflow-hidden">
              {/* Cabeçalho da Persona */}
              <div
                className="flex items-center justify-between py-2 px-3 cursor-pointer bg-gray-700 rounded-lg hover:bg-gray-1 transition-colors"
                onClick={() => togglePersona(persona.id)}
              >
                <div className="flex items-center text-2xl">
                  <UserCircle2 className="text-purple-2 mr-2" size={20} />
                  {editingPersona === persona.id ? (
                    <input
                      type="text"
                      value={editPersonaName}
                      onChange={(e) => setEditPersonaName(e.target.value)}
                      onKeyUp={(e) => { if (e.key === 'Enter') saveEditPersona() }}
                      className="border-b-2 text-white p-0 bg-gray-800 border-none focus:ring-0 font-medium text-2xl rounded h-full focus:outline-none focus:border-purple-2"
                      autoFocus
                    />
                  ) : (
                    <h4 className="text-white font-medium m-0">{persona.name}</h4>
                  )}
                </div>

                <div className="flex items-center">
                  {editingPersona === persona.id ? (
                    <button
                      className="p-1 bg-green-600 hover:bg-green-500 rounded-full mr-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        saveEditPersona();
                      }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-300">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </button>
                  ) : (
                    <button
                      className="p-1 hover:bg-gray-1 rounded-full mr-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        startEditPersona(persona.id);
                      }}
                    >
                      <Edit size={16} className="text-gray-300" />
                    </button>
                  )}

                  <button
                    className="p-1 hover:bg-gray-1 rounded-full mr-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      confirmDeletePersona(persona.id);
                    }}
                  >
                    <Trash size={16} className="text-red-400" />
                  </button>

                  {expandedPersona === persona.id ? (
                    <ChevronRight className="text-white animate-rotate-90" size={20} />
                  ) : (
                    <ChevronDown className="text-white animate-rotate-90-reverse" size={20} />
                  )}
                </div>
              </div>

              {/* Diálogo de confirmação de exclusão de persona */}
              {deleteConfirmPersona === persona.id && (
                <ModalConfirmation
                  onConfirm={handleDeletePersona}
                  onCancel={() => setDeleteConfirmPersona(null)}
                  message="Deseja remover esta persona?"
                />
              )}

              {/* Conteúdo da Persona */}
              {expandedPersona === persona.id && (
                <div className="flex flex-col bg-gray-800 rounded p-4">
                  {['profile', 'expectations', 'restrictions', 'goals'].map((field) => (
                    <div key={field} className="mb-4">
                      <h5 className={`${colors[field].text} font-medium mb-2`}>{getFieldTitle(field)}</h5>
                      <div className="grid gap-4 md:grid-cols-2">
                        {persona[field].map((item, itemIndex) => (
                          <div
                            key={itemIndex}
                            className="relative cursor-pointer rounded hover:bg-gray-2 transition-colors popup-animation">
                            <div
                              onClick={() => startEditField(persona.id, field, itemIndex)}
                              className={`rounded-lg border-l-4 ${colors[field].border} min-h-full shadow-sm bg-gray-3`}>
                              {editingField.personaId === persona.id && editingField.field === field && editingField.itemIndex === itemIndex ? (
                                <div className="h-full w-full p-2 text-sm bg-gray-2 rounded" onClick={(e) => e.stopPropagation()}>
                                  <textarea
                                    ref={textareaRef}
                                    value={editValue}
                                    onChange={(e) => setEditValue(e.target.value)}
                                    className="resize-none overflow-hidden scroll-height-10 text-white bg-gray-800 rounded text-sm pt-2 w-full min-h-content focus:outline-none border-none focus:ring-0 focus:border-purple-2"
                                    rows={2}
                                    autoFocus
                                  />
                                  <div className="flex justify-between mt-1">
                                    <button
                                      className="bg-purple-2 hover:bg-purple-1 text-white text-xs p-1 rounded"
                                      onClick={saveEditField}
                                    >
                                      Salvar
                                    </button>
                                    <button
                                      className="bg-red-400 hover:bg-red-500 text-white text-xs p-1 rounded"
                                      onClick={() => confirmDeleteItem(persona.id, field, itemIndex)}
                                    >
                                      Excluir
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <p className="p-2 text-white text-sm">{item || 'Clique para editar'}</p>
                              )}
                            </div>

                            {/* Diálogo de confirmação de exclusão de item */}
                            {deleteConfirmItem.personaId === persona.id && deleteConfirmItem.field === field && deleteConfirmItem.itemIndex === itemIndex && (
                              <div className="absolute top-16 left-1/2 transform -translate-x-1/2 z-10 bg-gray-2 rounded shadow-lg p-2 w-48">
                                <div className="text-white text-xs mb-2">
                                  Deseja remover este item?
                                </div>
                                <div className="flex justify-between gap-1">
                                  <button
                                    className="bg-red-500 hover:bg-red-600 text-white text-xs py-1 px-2 rounded flex-1"
                                    onClick={deleteItem}
                                  >
                                    Sim
                                  </button>
                                  <button
                                    className="bg-gray-3 hover:bg-gray-1 text-white text-xs py-1 px-2 rounded flex-1"
                                    onClick={() => setDeleteConfirmItem({ personaId: null, field: null, itemIndex: null })}
                                  >
                                    Não
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                        {/* Botão para adicionar novo item */}
                        <div className="flex items-center justify-center">
                          <button
                            className="w-full h-10 rounded bg-gray-700 hover:bg-gray-600 flex items-center justify-center text-blue-400"
                            onClick={() => addNewItem(persona.id, field)}
                          >
                            <Plus size={18} className="mr-1" />
                            <span className="text-sm">Adicionar {getFieldTitle(field).slice(0, -1)}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
      ) : (
        <div className="flex flex-col col-span-2 items-center justify-center p-6 bg-gray-3 rounded-lg text-gray-400">
          <UserCircle2 size={40} className="mb-4 text-purple-2 col-span-2" />
          <p className="mb-2">Nenhuma persona definida ainda.</p>
          <p className="mb-4 text-sm">Crie uma nova persona para mapear os usuários do seu projeto.</p>
        </div>
      )}

      {/* Botão "Nova Persona" */}
      <button
        className={`col-span-2 flex items-center justify-center py-2 bg-gray-800 hover:bg-gray-2 text-blue-400 rounded-lg transition-colors shadow-md ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
        onClick={addNewPersona}
        disabled={isSubmitting}
      >
        <Plus size={18} className="mr-2" />
        <span>{isSubmitting ? 'Criando...' : 'Nova Persona'}</span>
      </button>
    </div>
  );
};

export default Personas;