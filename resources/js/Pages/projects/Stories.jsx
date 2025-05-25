import React, { useState, useEffect } from 'react';
import { Plus, Sparkles } from 'lucide-react';
import { StoryCard } from '@/Components/Card';
import { router } from '@inertiajs/react';
import axios from 'axios';

const Stories = ({ project, setProject }) => {
  // Estado para controlar qual story está sendo editada
  const [editingId, setEditingId] = useState(null);
  // Estado para armazenar o valor temporário durante a edição
  const [editValue, setEditValue] = useState('');
  // Estado para controlar qual story está com o seletor de tipo aberto
  const [typeSelectId, setTypeSelectId] = useState(null);
  // Estado para controlar qual story está com o diálogo de confirmação de exclusão aberto
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  // Estados para IA
  const [aiInput, setAiInput] = useState('');
  const [aiGeneratedStories, setAiGeneratedStories] = useState([]);
  const [showAiInput, setShowAiInput] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  // Função para gerar stories via IA
  const generateStories = async () => {
    if (!showAiInput) {
      setShowAiInput(true);
      return;
    }

    if (!aiInput.trim()) {
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000); // Remove após 3 segundos
      return;
    }

    try {
      const response = await axios.post('/api/ai/generate', {
        message: aiInput
      });
      
      console.log('Resposta completa:', response.data);
      
      // Atualiza o estado com as stories geradas
      setAiGeneratedStories(response.data.message.stories);
      setShowAiInput(false);
      setAiInput('');
    } catch (error) {
      console.error('Erro ao gerar stories:', error);
      console.error('Detalhes do erro:', error.response?.data);
    }
  };

  // Função para adicionar uma story da IA ao projeto
  const addAiStory = (story) => {
    setProject({
      ...project,
      stories: [...project.stories, { title: story.title, type: story.type }]
    });
    
    // Opcional: Enviar para o backend
    router.post(route('story.store'), {
      title: story.title,
      type: story.type,
      project_id: project.id
    });
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
  // Função para adicionar uma nova story
  const addNewStory = () => {
    setProject({
      ...project, stories: [...project.stories, {
        title: 'Nova Story',
        type: 'user'
      }]
    });

    router.post(route('story.store'), {
      title: 'Nova Story',
      type: 'user',
      project_id: project.id // ID do projeto atual
    });
  };

  // Função para alternar entre modo de edição e visualização
  const editStory = (story) => {
    if (editingId === story.id) {
      // Se já estiver editando esta story, salve as alterações
      if (story.title !== editValue) {
        const updatedStories = project.stories.map(s =>
          s.id === story.id ? {
            ...s,
            title: editValue,
            updated_at: new Date().toISOString()
          } : s
        );

        setProject({ ...project, stories: updatedStories });

        router.patch(route('story.update', story.id), {
          title: editValue,
        });

      }
      setEditingId(null)
    } else {
      // Entra no modo de edição para esta story
      setEditingId(story.id);
      setEditValue(story.title); // Inicializa o campo com o valor atual
    }
  };

  // Função para alterar o tipo da story
  const changeStoryType = (storyId, newType) => {
    const story = project.stories.find(s => s.id === storyId);

    if (story.type !== newType) {
      const updatedStories = project.stories.map(s =>
        s.id === storyId ? {
          ...s,
          type: newType,
          updated_at: new Date().toISOString()
        } : s
      );

      setProject({ ...project, stories: updatedStories });

      router.patch(route('story.update', storyId), {
        type: newType,
      })
    }

    setTypeSelectId(null); // Fecha o seletor de tipo
  };


  // Função para excluir a story
  const deleteStory = (storyId) => {
    const updatedStories = project?.stories.filter(s => s.id !== storyId);
    setProject({ ...project, stories: updatedStories });
    setDeleteConfirmId(null); // Fecha o diálogo de confirmação
    router.delete(route('story.delete', storyId));
  };

  return (
    <div className="stories rounded grid grid-cols-2 gap-2 w-full p-4 cursor-pointer items-start">
      <div className='flex flex-col gap-2 '>
        {/* User stories */}
        {project?.stories?.length > 0 ? (
          project?.stories
            .filter((story) => story.type === 'user')
            .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
            .map((story, i) => {
              return (
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

              )
            })
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
        {project?.stories?.length > 0 && project?.stories
          .filter((story) => story.type === 'system')
          .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
          .map((story, i) => {
            return (
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
            )
          }
          )}
      </div>

      {/* Botões "Nova story" e "Gerar com IA" */}
      <div className="col-span-2 flex gap-2">
        <button
          className="flex items-center justify-center flex-1 py-1 bg-gray-800 hover:bg-gray-700 text-blue-400 rounded-lg transition-colors rounded shadow-md"
          onClick={addNewStory}
        >
          <Plus size={18} className="mr-2" />
          <span>Nova story</span>
        </button>
        
        <button
          onClick={() => {
            if (showAiInput) {
              setShowAiInput(false);
              setAiInput('');
            } else {
              generateStories();
            }
          }}
          className="flex items-center justify-center flex-1 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors rounded shadow-md"
        >
          <Sparkles size={18} className="mr-2" />
          <span>{showAiInput ? 'Cancelar' : 'Gerar com IA'}</span>
        </button>
      </div>

      {/* Seção de Input para IA - aparece apenas quando showAiInput for true */}
      {showAiInput && (
        <div className="col-span-2 space-y-2 mb-4">
          <textarea
            placeholder="Descreva o contexto para a IA gerar stories..."
            className="w-full bg-gray-800 rounded-lg p-2 text-white"
            value={aiInput}
            onChange={(e) => setAiInput(e.target.value)}
          />
          {showAlert && (
            <p className="text-red-400 text-sm">Por favor, insira a entrevista para gerar as stories.</p>
          )}
          <div className="flex gap-2">
            <button
              onClick={generateStories}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
            >
              Gerar Stories
            </button>
            <button
              onClick={() => {
                setShowAiInput(false);
                setAiInput('');
              }}
              className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Listagem de Stories Geradas pela IA */}
      {aiGeneratedStories.length > 0 && (
        <div className="col-span-2 space-y-2 mb-4">
          <h5 className="text-white mt-4">Stories Geradas</h5>
          {aiGeneratedStories.map((story, index) => (
            <div key={index} className="bg-gray-800 p-2 rounded flex justify-between items-center gap-1">
              <div className={`${story.type === 'user' ? 'bg-violet-600' : 'bg-teal-600'} text-white text-xs font-medium py-0.5 px-2 rounded-full whitespace-nowrap`}>
                {story.type}
              </div>
              <span className="text-white text-xs px-2 flex-1 min-w-0 break-words">
                {story.title}
              </span>
              <button
                onClick={() => addAiStory(story)}
                className="bg-pink-400 hover:bg-pink-500 text-white text-xs font-medium px-2 py-0.5 rounded transition-colors whitespace-nowrap"
              >
                Adicionar
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Stories