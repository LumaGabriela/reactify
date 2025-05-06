import React, { useState, useEffect } from 'react';
import { Plus, CircleX, Pencil, Check } from 'lucide-react';
import PopUpConfirmation from '@/Components/PopUpConfimation';
import TextArea from '@/Components/TextArea';

const Story = ({ 
  story, 
  toggleTypeSelect,
  changeStoryType,
  typeSelectId,
  editingId, 
  editValue,
  handleInputChange,
  editStory,
  deleteConfirmId,
  toggleDeleteConfirm,
  deleteStory,
  setDeleteConfirmId
}) => {
  return (
    <div  className={`story bg-gray-800 rounded-lg p-2 shadow-md col-span-1`}>
    <div className="flex items-center mb-2 relative">
      <div
        className={`${story.type === 'user' ? 'bg-pink-600' : 'bg-cyan-600'} text-white text-xs font-medium py-1 px-3 rounded-full cursor-pointer`}
        onClick={() => toggleTypeSelect(story.id)}
      >
        {story.type}
      </div>

      {/* Seletor de tipo */}
      {typeSelectId === story.id && (
        <div className="flex items-center justify-center absolute -top-9 -left-2 z-10 bg-gray-700 rounded shadow-lg px-2 py-1 shadow-md">
          <div
            className="bg-pink-600 text-white text-xs font-medium py-1 px-3 rounded-full cursor-pointer mr-1 shadow-md"
            onClick={() => changeStoryType(story.id, 'user')}
          >
            user
          </div>
          <div
            className="bg-cyan-600 text-white text-xs font-medium py-1 px-3 rounded-full cursor-pointer shadow-md"
            onClick={() => changeStoryType(story.id, 'system')}
          >
            system
          </div>
        </div>
      )}
    </div>

    <div className="flex items-center justify-between ">
      <div className="flex items-cente w-full">
        <div className="rounded-full flex items-center justify-center text-white text-xs w-full">
          {editingId === story.id ? (
            <TextArea
              value={editValue}
              onEnter={() => editStory(story)}
              onChange={handleInputChange}
            />
          ) : (
            <span className="w-full ">{story.title}</span>
          )}
        </div>
      </div>
      <div className="flex gap-1">
        <button
          className={`edit flex p-1 hover:bg-gray-700 rounded transition-colors ${editingId === story.id ? 'bg-green-700 hover:bg-green-800' : ''}`}
          onClick={() => editStory(story)}
        >
          {editingId === story.id ? (
            // Ícone de confirmação quando estiver editando
            <Check size={16} className='stroke-green-400' />
          ) : (
            // Ícone de edição quando não estiver editando
            <Pencil size={16} className='stroke-gray-400' />
          )}
        </button>
        <button
          className="p-1 flex hover:bg-gray-700 rounded"
          onClick={() => toggleDeleteConfirm(story.id)}
        >
          <CircleX size={16} className={`${deleteConfirmId === story.id ? 'stroke-red-400' : 'stroke-gray-400'}`} />
        </button>

        {/* Diálogo de confirmação de exclusão */}
        {deleteConfirmId === story.id && (
          <PopUpConfirmation
            onConfirm={() => deleteStory(story.id)}
            onCancel={() => setDeleteConfirmId(null)}
            message="Deseja remover esta story?"
          />
        )}
      </div>
    </div>
  </div>
  );
};
const Stories = ({ project, setProject }) => {
  // Estado para controlar qual story está sendo editada
  const [editingId, setEditingId] = useState(null);
  // Estado para armazenar o valor temporário durante a edição
  const [editValue, setEditValue] = useState('');
  // Estado para controlar qual story está com o seletor de tipo aberto
  const [typeSelectId, setTypeSelectId] = useState(null);
  // Estado para controlar qual story está com o diálogo de confirmação de exclusão aberto
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  // Função para adicionar uma nova story
  const addNewStory = () => {
    setProject({ ...project, stories: [...project.stories, { id: project.stories.length + 1, title: 'Nova Story', type: 'user' }] });
  };

  // Função para alternar entre modo de edição e visualização
  const editStory = (story) => {
    if (editingId === story.id) {
      // Se já estiver editando esta story, salve as alterações
      const updatedStories = project.stories.map(s =>
        s.id === story.id ? { ...s, title: editValue } : s
      );
      setProject({ ...project, stories: updatedStories });
      setEditingId(null); // Sai do modo de edição
    } else {
      // Entra no modo de edição para esta story
      setEditingId(story.id);
      setEditValue(story.title); // Inicializa o campo com o valor atual
    }
  };

  // Função para lidar com mudanças no input
  const handleInputChange = (e) => {
    setEditValue(e.target.value);
  };

  // Função para alternar a exibição do seletor de tipo
  const toggleTypeSelect = (storyId) => {
    if (typeSelectId === storyId) {
      setTypeSelectId(null);
    } else {
      setTypeSelectId(storyId);
      setDeleteConfirmId(null); // Fecha o diálogo de exclusão caso esteja aberto
    }
  };

  // Função para alterar o tipo da story
  const changeStoryType = (storyId, newType) => {
    const updatedStories = project.stories.map(s =>
      s.id === storyId ? { ...s, type: newType } : s
    );
    setProject({ ...project, stories: updatedStories });
    setTypeSelectId(null); // Fecha o seletor de tipo
  };

  // Função para alternar a exibição do diálogo de confirmação de exclusão
  const toggleDeleteConfirm = (storyId) => {
    if (deleteConfirmId === storyId) {
      setDeleteConfirmId(null);
    } else {
      setDeleteConfirmId(storyId);
      setTypeSelectId(null); // Fecha o seletor de tipo caso esteja aberto
      setEditingId(null); // Fecha a edição caso esteja aberta
    }
  };

  // Função para excluir a story
  const deleteStory = (storyId) => {
    const updatedStories = project.stories.filter(s => s.id !== storyId);
    setProject({ ...project, stories: updatedStories });
    setDeleteConfirmId(null); // Fecha o diálogo de confirmação
  };

  return (
    <div className="stories rounded grid grid-cols-2 gap-2 w-full p-2 cursor-pointer items-start">
      <div className='flex flex-col gap-2 '>
        {/* User stories */}
      {project.stories.length > 0 ? (
        project.stories.map((story, i) => {
          if (story.type === 'user') return (
          <Story 
          key={i}
          story={story} 
          toggleTypeSelect={toggleTypeSelect}
          changeStoryType={changeStoryType}
          typeSelectId={typeSelectId}
          editingId={editingId} 
          editValue={editValue}
          handleInputChange={handleInputChange}
          editStory={editStory}
          deleteConfirmId={deleteConfirmId}
          toggleDeleteConfirm={toggleDeleteConfirm}
          deleteStory={deleteStory}
          setDeleteConfirmId={setDeleteConfirmId}
          />

        )})
      ) : (
        // Exibir um card de exemplo quando não houver stories
        <div className="bg-gray-800 rounded-lg p-4 shadow-md">
          <div className="flex items-center mb-2">
            <div className="bg-blue-600 text-white text-xs font-medium py-1 px-3 rounded-full">
              Em andamento
            </div>
          </div>
          <div className="text-white text-base font-medium mb-4">
            criar get da tela de edição update e delete dos psr
          </div>
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center text-white">
              E
            </div>
            <span className="ml-2 text-gray-300 text-sm">
              Eduardo Rodrigues
            </span>
          </div>
        </div>
      )}
</div>
{/* System stories */}
<div className='flex flex-col gap-2 '>
      {project.stories.map((story, i) => {
          if (story.type === 'system') return (
          <Story 
          key={i}
          story={story} 
          toggleTypeSelect={toggleTypeSelect}
          changeStoryType={changeStoryType}
          typeSelectId={typeSelectId}
          editingId={editingId} 
          editValue={editValue}
          handleInputChange={handleInputChange}
          editStory={editStory}
          deleteConfirmId={deleteConfirmId}
          toggleDeleteConfirm={toggleDeleteConfirm}
          deleteStory={deleteStory}
          setDeleteConfirmId={setDeleteConfirmId}
          />
        )}
      )}
</div>

      {/* Botão "Nova story" */}
      <button
        className="col-span-2 flex items-center justify-center w-full py-1 bg-gray-800 hover:bg-gray-700 text-blue-400 rounded-lg transition-colors rounded shadow-md"
        onClick={addNewStory}
      >
        <Plus size={18} className="mr-2" />
        <span>Nova story</span>
      </button>
    </div>
  );
}

export default Stories