import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';
const Personas = ({ project, setProject }) => {
  // Estado para controlar qual story está com o diálogo de confirmação de exclusão aberto
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const updatePersonaName = (index, newName) => {
    const updatedProject = { ...project };
    updatedProject.personas[index].name = newName;
    setProject(updatedProject);
  };

  // Função para adicionar uma nova persona
  const addNewPersona = () => {
    setProject({
      ...project,
      personas: [
        ...project.personas,
        {
          id: (project.personas.length + 1).toString(),
          name: 'Nova Persona',
          profile: [''],
          expectations: [''],
          restrictions: [''],
          goals: ['']
        }
      ]
    });
  };
  const deletePersona = (personaId) => {
    const updatedPersonas = project.personas.filter(p => p.id !== personaId);
    setProject({ ...project, personas: updatedPersonas });
    setDeleteConfirmId(null); // Fecha o diálogo de confirmação
  };

  const addArrayItem = (personaIndex, arrayType) => {
    const updatedProject = { ...project };
    updatedProject.personas[personaIndex][arrayType].push('');
    setProject(updatedProject);
  };

  // Adicione esta nova função junto com as outras funções
  const removeArrayItem = (personaIndex, arrayType, itemIndex) => {
    const updatedProject = { ...project };
    updatedProject.personas[personaIndex][arrayType].splice(itemIndex, 1);

    // Se a lista ficou vazia, adiciona um item vazio
    // if (updatedProject.personas[personaIndex][arrayType].length === 0) {
    //   updatedProject.personas[personaIndex][arrayType].push('');
    // }

    setProject(updatedProject);
  };

  const updateArrayItem = (personaIndex, arrayType, itemIndex, newValue) => {
    const updatedProject = { ...project };
    updatedProject.personas[personaIndex][arrayType][itemIndex] = newValue;
    setProject(updatedProject);
  };

  const placeholderSelect = (type) => {
    switch (type) {
      case 'profile':
        return 'Perfil da persona';
      case 'expectations':
        return 'Expectativas da persona';
      case 'restrictions':
        return 'Restrições da persona';
      case 'goals':
        return 'Objetivos da persona';
      default:
        return '';
    }
  }
  return (
    <div className="grid md:grid-cols-2 grid-flow-dense gap-2 w-full p-4">
      {project.personas.map((persona, personaIndex) => (
        <div
          key={personaIndex}
          className="flex flex-col mb-2 p-4 rounded bg-gray-2 w-full">
          <div className='flex flex-row justify-between '>
            <h5 className='text-white mb-1'>Name</h5>
            <X
              onClick={() => setDeleteConfirmId(persona.id)}
              className='text-red-hover rounded-full p-1 cursor-pointer transition-colors	w-8 h-8' />
          </div>

          {/* Diálogo de confirmação de exclusão */}
          {deleteConfirmId === persona.id && (
            <div className="absolute z-10 translate-x-15 bg-gray-700 rounded shadow-lg p-2 w-54">
              <div className="text-white text-xs mb-2">
                Deseja remover esta persona?
              </div>
              <div className="flex justify-between gap-1">
                <button
                  className="bg-red-500 hover:bg-red-600 text-white text-xs py-0.5 px-2 rounded text-center flex-1"
                  onClick={() => deletePersona(persona.id)}
                >
                  Sim
                </button>
                <button
                  className="bg-gray-600 hover:bg-gray-500 text-white text-xs py-0.5 px-2 rounded text-center flex-1"
                  onClick={() => setDeleteConfirmId(null)}
                >
                  Não
                </button>
              </div>
            </div>
          )}

          <input
            type="text"
            value={persona.name}
            placeholder='Name'
            onChange={(e) => updatePersonaName(personaIndex, e.target.value)}
            className="w-full mb-4 p-2 bg-gray-1 text-white rounded"
          />

          {['profile', 'expectations', 'restrictions', 'goals'].map((arrayType) => (
            <div key={arrayType} className="mb-4">
              <h5 className="text-white capitalize mb-1">{arrayType}</h5>
              {persona[arrayType].map((item, itemIndex) => (
                <div
                  className='flex flex-row justify-between'
                  key={itemIndex}>
                  <input
                    value={item}
                    placeholder={placeholderSelect(arrayType)}
                    onChange={(e) =>
                      updateArrayItem(personaIndex, arrayType, itemIndex, e.target.value)
                    }
                    className="w-full mb-2 p-2 bg-gray-1 text-white rounded shadow-md resize-y min-h-[40px]"
                  />
                  <X
                    onClick={() => removeArrayItem(personaIndex, arrayType, itemIndex)}
                    className='text-red-hover rounded-full p-1 cursor-pointer transition-colors	w-8 h-8' />
                </div>

              ))}
              <button
                onClick={() => addArrayItem(personaIndex, arrayType)}
                className="flex items-center justify-center w-full py-1 bg-gray-800 hover:bg-gray-700 text-blue-400 rounded-lg transition-colors rounded shadow-md"
              >
                {arrayType === 'profile' && <>Add Profile</>}
                {arrayType !== 'profile' && <>Add {arrayType.slice(0, -1)}</>}
              </button>
            </div>
          ))}
        </div>
      ))}
      {/* Botão "Nova Persona" */}
      <button
        className="col-span-2 flex items-center justify-center py-1 bg-gray-800 hover:bg-gray-700 text-blue-400 rounded-lg transition-colors rounded shadow-md"
        onClick={addNewPersona}
      >
        <Plus size={18} className="mr-2" />
        <span>Nova Persona</span>
      </button>
    </div>
  );
};

export default Personas;