import React, { useState } from 'react';
import { Plus } from 'lucide-react';

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
    <div className="flex flex-col gap-2 w-full p-4 cursor-pointer items-center">
      {project.stories.length > 0 ? (
        project.stories.map((story) => (
          <div key={story.id} className="bg-gray-800 rounded-lg p-2 shadow-md w-md">
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
                    <input
                      type="text"
                      value={editValue}
                      onKeyUp={(e)=> {if(e.key === 'Enter') {editStory(story)}}}
                      onChange={handleInputChange}
                      className="text-white mx-1 w-full h-max rounded focus:outline-none"
                      autoFocus
                    />
                  ) : (
                    <span className="w-full ">{story.title}</span>
                  )}
                </div>
              </div>
              <div className="flex space-x-2 relative">
                <button
                  className={`edit p-1 hover:bg-gray-700 rounded ${editingId === story.id ? 'bg-green-700' : ''}`}
                  onClick={() => editStory(story)}
                >
                  {editingId === story.id ? (
                    // Ícone de confirmação quando estiver editando
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-400">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  ) : (
                    // Ícone de edição quando não estiver editando
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                    </svg>
                  )}
                </button>
                <button
                  className="p-1 hover:bg-gray-700 rounded"
                  onClick={() => toggleDeleteConfirm(story.id)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`${deleteConfirmId === story.id ? 'text-red-400' : 'text-gray-400'}`}>
                    <path d="M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16z"></path>
                    <path d="M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"></path>
                  </svg>
                </button>

                {/* Diálogo de confirmação de exclusão */}
                {deleteConfirmId === story.id && (
                  <div className="absolute right-0 top-8 z-10 bg-gray-700 rounded shadow-lg p-2 w-40">
                    <div className="text-white text-xs mb-2">
                      Deseja remover esta story?
                    </div>
                    <div className="flex justify-between gap-1">
                      <button
                        className="bg-red-500 hover:bg-red-600 text-white text-xs py-0.5 px-2 rounded text-center flex-1"
                        onClick={() => deleteStory(story.id)}
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
              </div>
            </div>
          </div>
        ))
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

      {/* Botão "Nova story" */}
      <button
        className="flex items-center justify-center w-full py-1 bg-gray-800 hover:bg-gray-700 text-blue-400 rounded-lg transition-colors rounded shadow-md w-md"
        onClick={addNewStory}
      >
        <Plus size={18} className="mr-2" />
        <span>Nova story</span>
      </button>
    </div>
  );
}

export default Stories