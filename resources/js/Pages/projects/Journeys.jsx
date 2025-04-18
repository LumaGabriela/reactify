import React, { useState } from 'react';
import { Plus, ChevronDown, ChevronRight, MapPin, Map } from 'lucide-react';

const Journeys = ({ project, setProject }) => {
  // Estado para controlar qual journey está expandida
  const [expandedJourney, setExpandedJourney] = useState(null);
  // Estado para controlar qual step está sendo editado
  const [editingStep, setEditingStep] = useState({ journeyIndex: null, stepIndex: null });
  // Estado para armazenar o valor temporário durante a edição
  const [editValue, setEditValue] = useState('');
  // Estado para controlar qual step está com o diálogo de confirmação de exclusão aberto
  const [deleteConfirmStep, setDeleteConfirmStep] = useState({ journeyIndex: null, stepIndex: null });
  // Estado para controlar qual journey está sendo editada
  const [editingJourney, setEditingJourney] = useState(null);
  // Estado para o nome da journey em edição
  const [editJourneyName, setEditJourneyName] = useState('');
  // Estado para confirmação de exclusão de journey
  const [deleteConfirmJourney, setDeleteConfirmJourney] = useState(null);

  // Função para expandir/recolher uma journey
  const toggleJourney = (journeyIndex) => {
    if (expandedJourney === journeyIndex) {
      setExpandedJourney(null);
    } else {
      setExpandedJourney(journeyIndex);
    }
  };

  // Função para adicionar uma nova journey
  const addNewJourney = () => {
    const newJourney = {
      name: 'Nova Journey',
      steps: []
    };
    
    const updatedJourneys = project.journeys ? [...project.journeys, newJourney] : [newJourney];
    setProject({ ...project, journeys: updatedJourneys });
    
    // Expandir a journey recém-criada (último índice)
    setExpandedJourney(updatedJourneys.length - 1);
  };

  // Função para adicionar um novo step a uma journey
  const addNewStep = (journeyIndex) => {
    if (!project.journeys || journeyIndex >= project.journeys.length) return;
    
    const currentSteps = project.journeys[journeyIndex].steps || [];
    const newStep = {
      step: currentSteps.length + 1,
      description: 'Novo passo'
    };
    
    const updatedJourneys = [...project.journeys];
    updatedJourneys[journeyIndex] = {
      ...updatedJourneys[journeyIndex],
      steps: [...currentSteps, newStep]
    };
    
    setProject({ ...project, journeys: updatedJourneys });
  };

  // Função para iniciar a edição de um step
  const startEditStep = (journeyIndex, stepIndex) => {
    setEditingStep({ journeyIndex, stepIndex });
    setEditValue(project.journeys[journeyIndex].steps[stepIndex].description);
  };

  // Função para salvar a edição de um step
  const saveEditStep = () => {
    const { journeyIndex, stepIndex } = editingStep;
    
    if (journeyIndex === null || stepIndex === null) return;
    if (!project.journeys || journeyIndex >= project.journeys.length) return;
    if (!project.journeys[journeyIndex].steps || stepIndex >= project.journeys[journeyIndex].steps.length) return;
    
    const updatedJourneys = [...project.journeys];
    updatedJourneys[journeyIndex].steps[stepIndex].description = editValue;
    
    setProject({ ...project, journeys: updatedJourneys });
    setEditingStep({ journeyIndex: null, stepIndex: null });
  };

  // Função para mostrar confirmação de exclusão de step
  const confirmDeleteStep = (journeyIndex, stepIndex) => {
    setDeleteConfirmStep({ journeyIndex, stepIndex });
  };

  // Função para excluir um step
  const deleteStep = () => {
    const { journeyIndex, stepIndex } = deleteConfirmStep;
    
    if (journeyIndex === null || stepIndex === null) return;
    if (!project.journeys || journeyIndex >= project.journeys.length) return;
    if (!project.journeys[journeyIndex].steps || stepIndex >= project.journeys[journeyIndex].steps.length) return;
    
    const updatedSteps = [...project.journeys[journeyIndex].steps];
    updatedSteps.splice(stepIndex, 1);
    
    // Reajustar os números dos steps
    const reorderedSteps = updatedSteps.map((s, idx) => ({
      ...s,
      step: idx + 1
    }));
    
    const updatedJourneys = [...project.journeys];
    updatedJourneys[journeyIndex] = {
      ...updatedJourneys[journeyIndex],
      steps: reorderedSteps
    };
    
    setProject({ ...project, journeys: updatedJourneys });
    setDeleteConfirmStep({ journeyIndex: null, stepIndex: null });
  };

  // Função para iniciar a edição de uma journey
  const startEditJourney = (journeyIndex) => {
    setEditingJourney(journeyIndex);
    setEditJourneyName(project.journeys[journeyIndex].name);
  };

  // Função para salvar a edição de uma journey
  const saveEditJourney = () => {
    if (editingJourney === null || !project.journeys || editingJourney >= project.journeys.length) return;
    
    const updatedJourneys = [...project.journeys];
    updatedJourneys[editingJourney] = {
      ...updatedJourneys[editingJourney],
      name: editJourneyName
    };
    
    setProject({ ...project, journeys: updatedJourneys });
    setEditingJourney(null);
  };

  // Função para mostrar confirmação de exclusão de journey
  const confirmDeleteJourney = (journeyIndex) => {
    setDeleteConfirmJourney(journeyIndex);
  };

  // Função para excluir uma journey inteira
  const deleteJourney = () => {
    if (deleteConfirmJourney === null || !project.journeys || deleteConfirmJourney >= project.journeys.length) return;
    
    const updatedJourneys = [...project.journeys];
    updatedJourneys.splice(deleteConfirmJourney, 1);
    
    setProject({ ...project, journeys: updatedJourneys });
    setExpandedJourney(null);
    setDeleteConfirmJourney(null);
  };

  return (
    <div className="flex flex-col gap-4 w-full p-4">
      {project.journeys && project.journeys.length > 0 ? (
        project.journeys.map((journey, journeyIndex) => (
          <div key={journeyIndex} className="bg-gray-800 rounded-lg shadow-md overflow-hidden">
            {/* Cabeçalho da Journey */}
            <div 
              className="flex items-center justify-between p-3 cursor-pointer bg-gray-700 hover:bg-gray-600 transition-colors"
              onClick={() => toggleJourney(journeyIndex)}
            >
              <div className="flex items-center">
                <Map className="text-blue-400 mr-2" size={20} />
                {editingJourney === journeyIndex ? (
                  <input
                    type="text"
                    value={editJourneyName}
                    onChange={(e) => setEditJourneyName(e.target.value)}
                    onKeyUp={(e) => {if(e.key === 'Enter') saveEditJourney()}}
                    className="bg-gray-800 text-white rounded px-2 py-1 focus:outline-none"
                    autoFocus
                  />
                ) : (
                  <h3 className="text-white font-medium">{journey.name}</h3>
                )}
              </div>
              
              <div className="flex items-center">
                {editingJourney === journeyIndex ? (
                  <button
                    className="p-1 bg-green-700 hover:bg-green-600 rounded-full mr-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      saveEditJourney();
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-300">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </button>
                ) : (
                  <button
                    className="p-1 hover:bg-gray-500 rounded-full mr-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      startEditJourney(journeyIndex);
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-300">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                    </svg>
                  </button>
                )}
                
                <button
                  className="p-1 hover:bg-gray-500 rounded-full mr-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    confirmDeleteJourney(journeyIndex);
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-400">
                    <path d="M3 6h18"></path>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  </svg>
                </button>
                
                {expandedJourney === journeyIndex ? (
                  <ChevronDown className="text-white" size={20} />
                ) : (
                  <ChevronRight className="text-white" size={20} />
                )}
              </div>
            </div>
            
            {/* Diálogo de confirmação de exclusão de journey */}
            {deleteConfirmJourney === journeyIndex && (
              <div className="absolute z-10 bg-gray-700 rounded shadow-lg p-2 w-64">
                <div className="text-white text-xs mb-2">
                  Deseja remover esta journey e todos seus passos?
                </div>
                <div className="flex justify-between gap-1">
                  <button
                    className="bg-red-500 hover:bg-red-600 text-white text-xs py-1 px-2 rounded flex-1"
                    onClick={deleteJourney}
                  >
                    Sim
                  </button>
                  <button
                    className="bg-gray-600 hover:bg-gray-500 text-white text-xs py-1 px-2 rounded flex-1"
                    onClick={() => setDeleteConfirmJourney(null)}
                  >
                    Não
                  </button>
                </div>
              </div>
            )}
            
            {/* Conteúdo da Journey (Steps) */}
            {expandedJourney === journeyIndex && (
              <div className="p-4">
                {journey.steps && journey.steps.length > 0 ? (
                  <div className="flex flex-col">
                    <div className="overflow-x-auto pb-2">
                      <div className="flex items-center min-w-max">
                        {/* Journey como ponto de início */}
                        <div className="flex flex-col items-center">
                          <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white">
                            <Map size={20} />
                          </div>
                          <span className="text-xs text-gray-400 mt-1">Início</span>
                        </div>
                        
                        {/* Steps com setas de conexão */}
                        {journey.steps.map((step, stepIndex) => (
                          <React.Fragment key={stepIndex}>
                            {/* Seta conectando os steps */}
                            <div className="mx-2 w-8 h-1 bg-blue-500"></div>
                            
                            {/* Step */}
                            <div className="flex flex-col items-center relative">
                              <div 
                                className="w-14 h-14 rounded-full bg-cyan-600 flex items-center justify-center text-white cursor-pointer relative"
                                onClick={() => startEditStep(journeyIndex, stepIndex)}
                              >
                                <MapPin size={20} />
                                <span className="absolute -bottom-1 text-xs bg-gray-800 rounded-full w-5 h-5 flex items-center justify-center border border-cyan-600">
                                  {step.step}
                                </span>
                              </div>
                              
                              <div className="w-32 text-center">
                                {editingStep.journeyIndex === journeyIndex && editingStep.stepIndex === stepIndex ? (
                                  <div className="mt-2">
                                    <textarea
                                      value={editValue}
                                      onChange={(e) => setEditValue(e.target.value)}
                                      className="bg-gray-700 text-white rounded p-2 text-xs w-full resize-none focus:outline-none"
                                      rows={3}
                                      autoFocus
                                    />
                                    <div className="flex justify-between mt-1">
                                      <button
                                        className="bg-green-600 hover:bg-green-500 text-white text-xs px-2 py-1 rounded"
                                        onClick={saveEditStep}
                                      >
                                        Salvar
                                      </button>
                                      <button
                                        className="bg-red-600 hover:bg-red-500 text-white text-xs px-2 py-1 rounded"
                                        onClick={() => confirmDeleteStep(journeyIndex, stepIndex)}
                                      >
                                        Excluir
                                      </button>
                                    </div>
                                  </div>
                                ) : (
                                  <span className="text-xs text-gray-300 mt-2 block">
                                    {step.description}
                                  </span>
                                )}
                              </div>
                              
                              {/* Diálogo de confirmação de exclusão de step */}
                              {deleteConfirmStep.journeyIndex === journeyIndex && deleteConfirmStep.stepIndex === stepIndex && (
                                <div className="absolute top-16 left-1/2 transform -translate-x-1/2 z-10 bg-gray-700 rounded shadow-lg p-2 w-48">
                                  <div className="text-white text-xs mb-2">
                                    Deseja remover este passo?
                                  </div>
                                  <div className="flex justify-between gap-1">
                                    <button
                                      className="bg-red-500 hover:bg-red-600 text-white text-xs py-1 px-2 rounded flex-1"
                                      onClick={deleteStep}
                                    >
                                      Sim
                                    </button>
                                    <button
                                      className="bg-gray-600 hover:bg-gray-500 text-white text-xs py-1 px-2 rounded flex-1"
                                      onClick={() => setDeleteConfirmStep({ journeyIndex: null, stepIndex: null })}
                                    >
                                      Não
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          </React.Fragment>
                        ))}
                        
                        {/* Botão para adicionar novo passo */}
                        <div className="ml-2">
                          <button
                            className="w-10 h-10 rounded-full bg-gray-700 hover:bg-gray-600 flex items-center justify-center text-blue-400"
                            onClick={() => addNewStep(journeyIndex)}
                          >
                            <Plus size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center p-4 text-gray-400">
                    <p className="mb-2">Esta journey ainda não possui passos.</p>
                    <button
                      className="flex items-center justify-center py-1 px-3 bg-gray-700 hover:bg-gray-600 text-blue-400 rounded transition-colors"
                      onClick={() => addNewStep(journeyIndex)}
                    >
                      <Plus size={16} className="mr-1" />
                      <span className="text-sm">Adicionar primeiro passo</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        ))
      ) : (
        <div className="flex flex-col items-center justify-center p-6 bg-gray-800 rounded-lg text-gray-400">
          <Map size={40} className="mb-4 text-blue-400" />
          <p className="mb-2">Nenhuma journey definida ainda.</p>
          <p className="mb-4 text-sm">Crie uma nova journey para mapear o fluxo do usuário.</p>
        </div>
      )}

      {/* Botão "Nova Journey" */}
      <button
        className="flex items-center justify-center py-2 bg-gray-800 hover:bg-gray-700 text-blue-400 rounded-lg transition-colors shadow-md"
        onClick={addNewJourney}
      >
        <Plus size={18} className="mr-2" />
        <span>Nova Journey</span>
      </button>
    </div>
  );
};

export default Journeys;