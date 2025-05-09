import React, { useState, useEffect } from 'react';
import { Plus} from 'lucide-react';
import { StoryCard } from '@/Components/Card';
import { router } from '@inertiajs/react';


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
    setProject({ ...project, stories: [...project.stories, { id: project?.stories.length + 1, title: 'Nova Story', type: 'user' }] });
    
    router.post('/stories', {
      title: 'Nova Story',
      type: 'user',
      project_id: project.id // ID do projeto atual
  }, { preserveScroll: true });
  };

  // Função para alternar entre modo de edição e visualização
  const editStory = (story) => {
    if (editingId === story.id) {
      // Se já estiver editando esta story, salve as alterações

      router.put( route('story.update', story.id), {
        title: editValue,
        type: story.type,
        project_id: project.id
    }, { preserveScroll: true });
      setEditingId(null)
    } else {
      // Entra no modo de edição para esta story
      setEditingId(story.id);
      setEditValue(story.title); // Inicializa o campo com o valor atual
    }
    console.log(editValue)
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
    const story = project.stories.find(story => story.id === storyId)
    console.log(story)
    router.put(route('story.update', storyId), {
      title: story.title,
      type: newType,
      project_id: project.id
    })
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
    const updatedStories = project?.stories.filter(s => s.id !== storyId);
    setProject({ ...project, stories: updatedStories });
    setDeleteConfirmId(null); // Fecha o diálogo de confirmação
    router.delete(`/stories/${storyId}`, {
        preserveScroll: true,
        onSuccess: () => {
            setDeleteConfirmId(null);
        }
    });
  };

  return (
    <div className="stories rounded grid grid-cols-2 gap-2 w-full p-2 cursor-pointer items-start">
      <div className='flex flex-col gap-2 '>
        {/* User stories */}
      {project?.stories?.length > 0 ? (
        project?.stories?.map((story, i) => {
          if (story.type === 'user') return (
          <StoryCard 
          key={i}
          story={story} 
          toggleTypeSelect={toggleTypeSelect}
          changeStoryType={changeStoryType}
          setTypeSelectId={setTypeSelectId}
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
      {project?.stories?.map((story, i) => {
          if (story.type === 'system') return (
          <StoryCard 
          key={i}
          story={story} 
          toggleTypeSelect={toggleTypeSelect}
          changeStoryType={changeStoryType}
          setTypeSelectId={setTypeSelectId}
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