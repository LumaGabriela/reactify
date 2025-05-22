import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { GoalCard } from '@/Components/Card';
import { router } from '@inertiajs/react';
const Goals = ({ project, setProject }) => {

  // Estado para controlar qual goal está sendo editada
  const [editingId, setEditingId] = useState(null);
  // Estado para armazenar o valor temporário durante a edição
  const [editValue, setEditValue] = useState('');
  // Estado para controlar qual goal está com o seletor de tipo aberto
  const [typeSelectId, setTypeSelectId] = useState(null);
  // Estado para controlar qual goal está com o seletor de prioridade aberto
  const [prioritySelectId, setPrioritySelectId] = useState(null);
  // Estado para controlar qual goal está com o diálogo de confirmação de exclusão aberto
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // Função para lidar com mudanças no input
  const handleInputChange = (e) => {
    setEditValue(e.target.value);
  };

  // Função para alternar a exibição do seletor de tipo
  const toggleTypeSelect = (goalId) => {
    if (typeSelectId === goalId) {
      setTypeSelectId(null);
    } else {
      setTypeSelectId(goalId);
      setPrioritySelectId(null); // Fecha outros seletores
      setDeleteConfirmId(null); // Fecha o diálogo de exclusão caso esteja aberto
    }
  };

  // Função para alternar a exibição do seletor de prioridade
  const togglePrioritySelect = (goalId) => {
    if (prioritySelectId === goalId) {
      setPrioritySelectId(null);
    } else {
      setPrioritySelectId(goalId);
      setTypeSelectId(null); // Fecha outros seletores
      setDeleteConfirmId(null); // Fecha o diálogo de exclusão caso esteja aberto
    }
  };


  // Função para alternar a exibição do diálogo de confirmação de exclusão
  const toggleDeleteConfirm = (goalId) => {
    if (deleteConfirmId === goalId) {
      setDeleteConfirmId(null);
    } else {
      setDeleteConfirmId(goalId);
      setTypeSelectId(null); // Fecha o seletor de tipo caso esteja aberto
      setPrioritySelectId(null); // Fecha o seletor de prioridade caso esteja aberto
      setEditingId(null); // Fecha a edição caso esteja aberta
    }
  };


  // Função para adicionar uma nova goal
  const addNewGoal = () => {
    setProject({
      ...project,
      goal_sketches: [
        ...project.goal_sketches || [],
        {
          title: 'New Goal',
          type: 'bg',
          priority: 'med'
        }
      ]
    });

    router.post(route('goal.store'), {
      title: 'New Goal',
      type: 'bg',
      priority: 'high',
      project_id: project.id
    })
  };

  // Função para alternar entre modo de edição e visualização
  const editGoal = (goal) => {

    if (editingId === goal.id) {

      // Se já estiver editando esta goal, salve as alterações
      const updatedGoals = (project.goal_sketches || []).map(g =>
        g.id === goal.id ? {
          ...g,
          title: editValue,
          updated_at: (goal.title !== editValue) ? new Date().toISOString() : g.updated_at
        } : g
      );
      setProject({ ...project, goal_sketches: updatedGoals });
      setEditingId(null); // Sai do modo de edição
      if (goal.title !== editValue) {
        router.patch(route('goal.update', goal.id), {
          title: editValue,
        })
      }
    } else {
      // Entra no modo de edição para esta goal
      setEditingId(goal.id);
      setEditValue(goal.title); // Inicializa o campo com o valor atual
    }
  };


  // Função para alterar o tipo da goal
  const changeGoalType = (goalId, newType) => {
    const goal = project.goal_sketches.find(g => g.id === goalId);

    if (goal.type !== newType) {

      const updatedGoals = (project.goal_sketches || []).map(g =>
        g.id === goalId ? {
          ...g,
          type: newType,
          updated_at: new Date().toISOString()
        } : g
      );

      setProject({ ...project, goal_sketches: updatedGoals });

      router.patch(route('goal.update', goalId), {
        type: newType,
      })
    }

    setTypeSelectId(null); // Fecha o seletor de tipo
  };

  // Função para alterar a prioridade da goal
  const changeGoalPriority = (goalId, newPriority) => {
    const goal = project.goal_sketches.find(g => g.id === goalId);
    if (goal.priority !== newPriority) {
      const updatedGoals = (project.goal_sketches || []).map(g =>
        g.id === goalId ? {
          ...g,
          priority: newPriority,
          updated_at: new Date().toISOString()
        } : g
      );

      setProject({ ...project, goal_sketches: updatedGoals });

      router.patch(route('goal.update', goalId), {
        priority: newPriority,
      })
    }
    setPrioritySelectId(null); // Fecha o seletor de prioridade
  };

  // Função para excluir a goal
  const deleteGoal = (goalId) => {
    const updatedGoals = (project.goal_sketches || []).filter(g => g.id !== goalId);
    setProject({ ...project, goal_sketches: updatedGoals });
    setDeleteConfirmId(null); // Fecha o diálogo de confirmação
    router.delete(route('goal.delete', goalId));
  };

  // Helper para definir a cor de fundo baseada na prioridade

  return (
    <div className="goalSketches  rounded grid grid-cols-2 gap-2 w-full p-4 cursor-pointer items-start">
      <div className='flex flex-col gap-2 '>
        {project.goal_sketches && project.goal_sketches.length > 0 ? (
          project?.goal_sketches
            .filter(goal => goal.type === 'cg')
            .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
            .map((goal, i) => (
              <GoalCard
                key={i}
                goal={goal}
                setTypeSelectId={setTypeSelectId}
                setPrioritySelectId={setPrioritySelectId}
                toggleTypeSelect={toggleTypeSelect}
                togglePrioritySelect={togglePrioritySelect}
                toggleDeleteConfirm={toggleDeleteConfirm}
                changeGoalType={changeGoalType}
                changeGoalPriority={changeGoalPriority}
                typeSelectId={typeSelectId}
                prioritySelectId={prioritySelectId}
                editingId={editingId}
                editValue={editValue}
                handleInputChange={handleInputChange}
                editGoal={editGoal}
                deleteConfirmId={deleteConfirmId}
                deleteGoal={deleteGoal}
                setDeleteConfirmId={setDeleteConfirmId}
              />
            ))
        ) : (
          // Exibir um card de exemplo quando não houver goals
          <div className="bg-gray-800 rounded-lg p-4 shadow-md">
            <div className="flex items-center mb-2 gap-2">
              <div className="bg-purple-600 text-white text-xs font-medium py-1 px-3 rounded-full">
                BG
              </div>
              <div className="bg-yellow-600 text-white text-xs font-medium py-1 px-3 rounded-full">
                med
              </div>
            </div>
            <div className="text-white text-base font-medium mb-4">
              Descobrir quem está por trás do desaparecimento dos artefatos
            </div>
          </div>
        )}
      </div>
      <div className='flex flex-col gap-2 '>
        {project?.goal_sketches
          .filter(goal => goal.type === 'bg')
          .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
          .map((goal, i) => (
            <GoalCard
              key={i}
              goal={goal}
              setTypeSelectId={setTypeSelectId}
              setPrioritySelectId={setPrioritySelectId}
              toggleTypeSelect={toggleTypeSelect}
              togglePrioritySelect={togglePrioritySelect}
              toggleDeleteConfirm={toggleDeleteConfirm}
              changeGoalType={changeGoalType}
              changeGoalPriority={changeGoalPriority}
              typeSelectId={typeSelectId}
              prioritySelectId={prioritySelectId}
              editingId={editingId}
              editValue={editValue}
              handleInputChange={handleInputChange}
              editGoal={editGoal}
              deleteConfirmId={deleteConfirmId}
              deleteGoal={deleteGoal}
              setDeleteConfirmId={setDeleteConfirmId}
            />
          ))
        }
      </div>
      {/* Botão "Nova goal" */}
      <button
        className="col-span-2 flex items-center justify-center w-full py-1 bg-gray-800 hover:bg-gray-700 text-blue-400 rounded-lg transition-colors rounded shadow-md"
        onClick={addNewGoal}
      >
        <Plus size={18} className="mr-2" />
        <span>Nova goal</span>
      </button>
    </div>
  );
}

export default Goals;